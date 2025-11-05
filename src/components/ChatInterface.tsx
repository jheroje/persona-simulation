'use client';

import { sendMessage } from '@/app/chat/actions';
import { Message, SimulationWithPersonaAndMessages } from '@/db/drizzle/schema';
import { useLayoutEffect, useRef, useState } from 'react';
import EndSimulationButton from './EndSimulationButton';
import { Tooltip } from './Tooltip';

interface ChatInterfaceProps {
  simulation: SimulationWithPersonaAndMessages;
}

function TraitBar({ trait, value }: { trait: string; value: number }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-2 text-gray-300">{trait}:</span>
      <div className="w-50 h-1.5 bg-gray-600 rounded overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="w-8 text-gray-400">{value}%</span>
    </div>
  );
}

function PersonaDetails({
  persona,
}: {
  persona: SimulationWithPersonaAndMessages['persona'];
}) {
  return (
    <div className="space-y-2">
      <div className="font-bold text-gray-300">
        <p>Role: {persona.role}</p>
        <p>Tone: {persona.tone}</p>
      </div>
      <div className="grid grid-cols-1 gap-1">
        <TraitBar trait="O" value={persona.oceanOpenness} />
        <TraitBar trait="C" value={persona.oceanConscientiousness} />
        <TraitBar trait="E" value={persona.oceanExtraversion} />
        <TraitBar trait="A" value={persona.oceanAgreeableness} />
        <TraitBar trait="N" value={persona.oceanNeuroticism} />
      </div>
    </div>
  );
}

function ScenarioTag({ text }: { text: string }) {
  return (
    <span className="px-2 py-0.5 bg-gray-600 rounded-full text-xs text-gray-200">
      {text}
    </span>
  );
}

export default function ChatInterface({ simulation }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(
    [...(simulation.messages || [])].sort(
      (a, b) =>
        new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime()
    )
  );
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const text = input.trim();
    setInput('');
    setIsProcessing(true);
    setError(null);

    try {
      const { userMessage, personaMessage } = await sendMessage(
        simulation.id,
        text
      );

      setMessages((prev) => [...prev, userMessage]);

      const full = personaMessage.content;
      const personaShell = { ...personaMessage, content: '' };

      setMessages((prev) => [...prev, personaShell]);

      const stepMs = 15;
      for (let i = 1; i <= full.length; i++) {
        await new Promise((r) => setTimeout(r, stepMs));
        const partial = full.slice(0, i);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === personaShell.id ? { ...m, content: partial } : m
          )
        );
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Something went wrong';
      setError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-[80vh] bg-gray-800 border border-gray-600 rounded-lg shadow-lg">
      <div className="flex items-center justify-between p-4 bg-gray-700 border-b border-gray-700">
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
              <ScenarioTag text={`#${simulation.scenarioContext.callId}`} />
              <ScenarioTag text={simulation.scenarioContext.service} />
              <ScenarioTag text={simulation.scenarioContext.subject} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <EndSimulationButton simulationId={simulation.id} />
        </div>
      </div>

      {error && (
        <div className="px-4 py-2 text-sm text-red-200 bg-red-900/50 border-b border-red-700">
          {error}
        </div>
      )}

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
                  ? 'bg-blue-500 text-gray-100 rounded-br-none'
                  : 'bg-gray-600 text-gray-100 rounded-bl-none'
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
          className="flex-1 p-3 border border-gray-600 bg-gray-700 text-gray-100 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-700 placeholder-gray-400"
        />
        <button
          type="submit"
          disabled={isProcessing}
          className="bg-blue-600 hover:bg-blue-700 text-gray-100 font-bold py-3 px-6 rounded-lg disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
