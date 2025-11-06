'use client';

import { sendMessage } from '@/app/chat/actions';
import { Message, SimulationWithPersonaAndMessages } from '@/db/drizzle/schema';
import { clientSupabase } from '@/db/supabase/client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import EndSimulationButton from './EndSimulationButton';
import { useToast } from './ToastProvider';
import { Tooltip } from './Tooltip';

interface ChatInterfaceProps {
  simulation: SimulationWithPersonaAndMessages;
}

function TraitBar({ trait, value }: { trait: string; value: number }) {
  return (
    <div className="flex items-center gap-2 text-xs w-80">
      <span className="w-30 text-gray-300 font-bold">{trait}</span>
      <div className="w-40 h-1.5 bg-neutral-600 rounded overflow-hidden">
        <div
          className="h-full bg-teal-500 rounded"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="w-10 text-gray-400">{value}%</span>
    </div>
  );
}

function PersonaDetails({
  persona,
}: {
  persona: SimulationWithPersonaAndMessages['persona'];
}) {
  return (
    <div className="space-y-2 p-2 w-80">
      <div className="font-bold text-gray-300">
        <p>Role: {persona.role}</p>
        <p>Tone: {persona.tone}</p>
      </div>
      <div className="grid grid-cols-1 gap-1">
        <TraitBar trait="Openness" value={persona.oceanOpenness} />
        <TraitBar
          trait="Conscientiousness"
          value={persona.oceanConscientiousness}
        />
        <TraitBar trait="Extraversion" value={persona.oceanExtraversion} />
        <TraitBar trait="Agreeableness" value={persona.oceanAgreeableness} />
        <TraitBar trait="Neuroticism" value={persona.oceanNeuroticism} />
      </div>
    </div>
  );
}

function ScenarioTag({ text }: { text: string }) {
  return (
    <span className="px-2 py-0.5 bg-neutral-600 rounded-full text-xs text-gray-200 font-bold">
      {text}
    </span>
  );
}

export default function ChatInterface({ simulation }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(simulation.messages);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const supabase = clientSupabase();
  const showToast = useToast();

  useLayoutEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const channel = supabase
      .channel(`simulation:${simulation.id}:messages`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `simulation_id=eq.${simulation.id}`,
        },
        async (payload: { new: Message }) => {
          if (payload.new.sender === 'persona') {
            handlePersonaMessage(payload.new);
          } else {
            handleUserMessage(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [simulation.id]);

  const handleUserMessage = (message: Message) => {
    if (message.sender !== 'user') return;

    setMessages((prev) => {
      if (prev.some((m) => m.id === message.id)) return prev;

      // Replace optimistic message
      const updated = prev.map((m) => (m.id < 0 ? message : m));

      const alreadyReplaced = updated.some((m) => m.id === message.id);
      return alreadyReplaced ? updated : [...prev, message];
    });
  };

  const handlePersonaMessage = async (message: Message) => {
    if (message.sender !== 'persona') return;

    const full = message.content;
    const shell = { ...message, content: '' };

    setMessages((prev) => {
      if (prev.some((m) => m.id === shell.id)) return prev;
      return [...prev, shell];
    });

    const stepMs = 15;
    for (let i = 1; i <= full.length; i++) {
      await new Promise((r) => setTimeout(r, stepMs));
      const partial = full.slice(0, i);
      setMessages((prev) =>
        prev.map((m) => (m.id === shell.id ? { ...m, content: partial } : m))
      );
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isProcessing) return;

    const text = input.trim();

    setInput('');
    setIsProcessing(true);

    // Optimistic message for instant loading
    const optimisticMessage: Message = {
      id: -1,
      simulationId: simulation.id,
      sender: 'user',
      content: text,
      createdAt: new Date(),
    };

    handleUserMessage(optimisticMessage);

    try {
      const result = await sendMessage(simulation.id, text);

      if (result.error) {
        showToast(`Failed to send message: ${result.error}`, 'error');
      }
    } catch (error) {
      console.error(error);
      showToast(
        `An unexpected error occurred while sending the message.`,
        'error'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-[85vh] bg-neutral-800 border border-gray-600 rounded-lg shadow-lg">
      <div className="flex items-center justify-between p-4 bg-neutral-700 border-b border-gray-700 rounded-t-lg">
        <div className="flex items-center gap-4">
          <div>
            <Tooltip
              trigger={
                <h3 className="font-semibold text-lg text-gray-100 cursor-pointer">
                  {simulation.persona.name || 'Unknown Persona'}
                </h3>
              }
            >
              <PersonaDetails persona={simulation.persona} />
            </Tooltip>
            <div className="flex gap-2 mt-1">
              <ScenarioTag
                text={`Call ID: ${simulation.scenarioContext.callId}`}
              />
              <ScenarioTag
                text={`Service: ${simulation.scenarioContext.service}`}
              />
              <ScenarioTag
                text={`Subject: ${simulation.scenarioContext.subject}`}
              />
              <ScenarioTag
                text={`Notes: ${simulation.scenarioContext.notes}`}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <EndSimulationButton
            simulationId={simulation.id}
            userId={simulation.userId}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-gray-500">
            Chat loaded, awaiting first message...
          </p>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs p-3 rounded-xl ${
                msg.sender === 'user'
                  ? 'bg-teal-500 text-gray-100 rounded-br-none'
                  : 'bg-neutral-600 text-gray-100 rounded-bl-none'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-gray-700 flex space-x-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your user response..."
          disabled={isProcessing}
          className="flex-1 p-3 border border-gray-600 bg-neutral-700 text-gray-100 rounded-lg focus:ring-teal-500 focus:border-teal-500 disabled:bg-neutral-700 placeholder-gray-400"
        />
        <button
          type="submit"
          disabled={isProcessing}
          className="bg-teal-500 hover:bg-teal-600 text-gray-100 font-bold py-3 px-6 rounded-lg disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
