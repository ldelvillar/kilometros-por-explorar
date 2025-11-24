import { useState, useRef, useEffect } from 'preact/hooks';
import type { JSX } from 'preact';
import Bot from '@/assets/Bot.tsx';
import Cross from '@/assets/Cross.tsx';
import Send from '@/assets/Send.tsx';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatbotConfig {
  webhookUrl: string;
  sessionId: string;
}

const getSessionId = () => {
  let id = localStorage.getItem('chatSessionId');
  if (!id) {
    id = `session_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('chatSessionId', id);
  }
  return id;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! 👋 Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [config, setConfig] = useState<ChatbotConfig | null>(null);

  useEffect(() => {
    setConfig({
      webhookUrl: import.meta.env.PUBLIC_CHATBOT_WEBHOOK_ENDPOINT,
      sessionId: getSessionId(),
    });
  }, []);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev: Message[]) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await sendToBackend(text.trim());

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text:
          response.message ||
          'Lo siento, ha ocurrido un error. Por favor, inténtalo de nuevo.',
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev: Message[]) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Lo siento, no puedo conectar en este momento. Por favor, inténtalo más tarde.',
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev: Message[]) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const sendToBackend = async (message: string) => {
    const payload = {
      message,
      sessionId: config?.sessionId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    const response = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  };

  const handleSubmit = (e: JSX.TargetedEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleKeyPress = (e: JSX.TargetedKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  if (!config) return null;

  return (
    <div className="fixed right-6 bottom-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="animate-in slide-in-from-bottom-2 absolute right-0 bottom-16 flex h-96 w-80 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl duration-200">
          {/* Header */}
          <div className="bg-primary flex items-center justify-between p-4 text-white">
            <div className="flex items-center gap-2">
              <Bot className="size-5" />
              <span className="font-semibold">Asistente Virtual</span>
            </div>
            <button
              onClick={toggleChat}
              className="text-white transition-colors hover:text-gray-200"
              aria-label="Cerrar chat"
            >
              <Cross className="size-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-4">
            {messages.map((message: Message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs rounded-lg p-3 shadow-sm ${
                    message.sender === 'user'
                      ? 'bg-primary text-white'
                      : 'border border-gray-100 bg-white text-gray-700'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <span className="mt-1 block text-xs opacity-70">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-lg border border-gray-100 bg-white p-3 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 bg-white p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onInput={e =>
                  setInputValue((e.target as HTMLInputElement).value)
                }
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje..."
                className="focus:ring-primary flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
                maxLength={500}
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="bg-primary hover:bg-primary/90 rounded-lg px-4 py-2 text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Enviar mensaje"
              >
                <Send className="size-5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className="bg-primary hover:bg-primary/90 group flex size-14 items-center justify-center rounded-full text-white shadow-lg transition-all duration-200 hover:shadow-xl"
        aria-label={isOpen ? 'Cerrar chat' : 'Abrir chat'}
      >
        <Bot className="size-8 transition-transform group-hover:scale-110" />
      </button>
    </div>
  );
}
