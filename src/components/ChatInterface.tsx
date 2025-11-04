'use client';

import { sendMessage } from '@/app/chat/actions';
import { Message, SimulationWithPersonaAndMessages } from '@/db/drizzle/schema';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import EndSimulationButton from './EndSimulationButton';

interface ChatInterfaceProps {
  initialSimulation: SimulationWithPersonaAndMessages;
}

export default function ChatInterface({
  initialSimulation,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(
    [...(initialSimulation.messages || [])].sort(
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
        initialSimulation.id,
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

  const personaName = initialSimulation.persona.name || 'Unknown Persona';
  const scenarioSubject = initialSimulation.scenarioContext.subject;

  return (
    <div className="flex flex-col h-[70vh] bg-white border rounded-lg shadow-lg">
      <div className="flex flex-row justify-between p-4 bg-gray-100 border-b">
        <div>
          <h3 className="font-semibold text-lg text-gray-800">{personaName}</h3>
          <p className="text-sm text-gray-500">Scenario: {scenarioSubject}</p>
        </div>

        <EndSimulationButton simulationId={initialSimulation.id} />
      </div>

      {error && (
        <div className="px-4 py-2 text-sm text-red-800 bg-red-100 border-b border-red-200">
          {error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-gray-400">
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
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="max-w-xs p-3 rounded-xl bg-gray-200 text-gray-800 rounded-bl-none animate-pulse">
              Persona is typing...
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t flex space-x-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your user response..."
          disabled={isProcessing}
          className="flex-1 p-3 border text-gray-800 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
        />
        <button
          type="submit"
          disabled={isProcessing}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
