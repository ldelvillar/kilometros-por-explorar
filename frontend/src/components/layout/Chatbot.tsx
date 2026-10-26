import { useState, useRef, useEffect } from 'preact/hooks';
import { Fragment } from 'preact';
import type { JSX } from 'preact';
import Bot from '@/assets/icons/Bot.tsx';
import Cross from '@/assets/icons/Cross.tsx';
import Reset from '@/assets/icons/Reset.tsx';
import Send from '@/assets/icons/Send.tsx';
import { PUBLIC_CHATBOT_WEBHOOK_ENDPOINT } from 'astro:env/client';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const CHATBOT_ENDPOINT = PUBLIC_CHATBOT_WEBHOOK_ENDPOINT;
const CONTACT_HREF = '/contacto';
// Once the visitor opens or dismisses the chat, stop nagging on every page view.
const SEEN_KEY = 'chatTeaserSeen';

const getGreeting = (): Message[] => [
  {
    id: '1',
    text: '¡Hola! 👋 Soy el asistente de Kilómetros por Explorar. ¿En qué puedo ayudarte hoy?',
    sender: 'bot',
    timestamp: new Date(),
  },
];

const getSessionId = () => {
  let id = localStorage.getItem('chatSessionId');
  if (!id) {
    id = `session_${Math.random().toString(36).slice(2, 11)}`;
    localStorage.setItem('chatSessionId', id);
  }
  return id;
};

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';
const iconButton = `flex rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 ${focusRing}`;

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(getGreeting);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  // Starts true so the server-rendered HTML has no badge to flash away on hydration.
  const [seen, setSeen] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const markSeen = () => {
    setSeen(true);
    setShowTeaser(false);
    sessionStorage.setItem(SEEN_KEY, '1');
  };

  useEffect(() => {
    if (sessionStorage.getItem(SEEN_KEY)) return;
    setSeen(false);
    const timer = setTimeout(() => setShowTeaser(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, isTyping, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    markSeen();
    inputRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  // Grow the textarea with its content, up to its max-height.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [inputValue, isOpen]);

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
      inputRef.current?.focus();
    }
  };

  const sendToBackend = async (message: string) => {
    const payload = {
      message,
      // localStorage is browser-only, so read it on send rather than on mount.
      sessionId: getSessionId(),
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    const response = await fetch(CHATBOT_ENDPOINT, {
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

  const handleKeyDown = (e: JSX.TargetedKeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const resetConversation = () => {
    setMessages(getGreeting());
    setInputValue('');
    inputRef.current?.focus();
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

  const userCount = messages.filter(m => m.sender === 'user').length;
  const lastMessage = messages[messages.length - 1];

  return (
    <div className="fixed right-6 bottom-6 z-50 font-display max-[480px]:right-3 max-[480px]:bottom-3">
      {/* Chat Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Asistente virtual"
          className="absolute right-0 bottom-18 flex h-[min(560px,calc(100vh-120px))] w-95 origin-bottom-right animate-chat-in flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl max-[480px]:fixed max-[480px]:inset-x-3 max-[480px]:top-3 max-[480px]:bottom-21 max-[480px]:h-auto max-[480px]:w-auto"
        >
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-gray-100 bg-white p-4">
            <div className="relative flex size-10 flex-none items-center justify-center rounded-full bg-primary/10 text-primary">
              <Bot className="size-5.5" />
              <span className="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-white bg-primary"></span>
            </div>
            <span className="min-w-0 flex-1 text-base font-bold text-gray-900">
              Asistente virtual
            </span>
            {userCount > 0 && (
              <button
                onClick={resetConversation}
                className={iconButton}
                aria-label="Nueva conversación"
                title="Nueva conversación"
              >
                <Reset className="size-4.5" />
              </button>
            )}
            <button
              onClick={toggleChat}
              className={iconButton}
              aria-label="Cerrar chat"
            >
              <Cross className="size-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div
            ref={scrollRef}
            aria-live="polite"
            className="flex flex-1 flex-col gap-1 overflow-y-auto bg-gray-50 p-4"
          >
            {messages.map((message: Message, i: number) => {
              const next = messages[i + 1];
              const endOfGroup = !next || next.sender !== message.sender;
              const isUser = message.sender === 'user';
              return (
                <Fragment key={message.id}>
                  <div
                    className={`flex animate-chat-msg items-end gap-2 ${
                      isUser ? 'justify-end' : ''
                    }`}
                  >
                    {!isUser && (
                      <div
                        className={`flex size-7 flex-none items-center justify-center rounded-full bg-primary/10 text-primary ${
                          endOfGroup ? '' : 'invisible'
                        }`}
                      >
                        <Bot className="size-3.75" />
                      </div>
                    )}
                    <p
                      className={`max-w-[78%] px-3.5 py-2.5 text-sm/normal text-pretty whitespace-pre-wrap ${
                        isUser
                          ? 'rounded-[16px_16px_4px_16px] bg-primary text-white'
                          : 'rounded-[16px_16px_16px_4px] border border-gray-200 bg-white text-gray-700'
                      }`}
                    >
                      {message.text}
                    </p>
                  </div>
                  {endOfGroup && (
                    <span
                      className={`mt-0.5 mb-2.5 text-xs text-gray-400 ${
                        isUser ? 'text-right' : 'pl-9'
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </span>
                  )}
                </Fragment>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div
                className="flex animate-chat-msg items-end gap-2"
                aria-label="El asistente está escribiendo"
              >
                <div className="flex size-7 flex-none items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Bot className="size-3.75" />
                </div>
                <div className="flex gap-1 rounded-[16px_16px_16px_4px] border border-gray-200 bg-white p-3.5">
                  <span className="size-1.5 animate-chat-dot rounded-full bg-gray-400"></span>
                  <span className="size-1.5 animate-chat-dot rounded-full bg-gray-400 [animation-delay:.2s]"></span>
                  <span className="size-1.5 animate-chat-dot rounded-full bg-gray-400 [animation-delay:.4s]"></span>
                </div>
              </div>
            )}

            {/* Hand-off to the humans once the conversation gets going */}
            {!isTyping && lastMessage.sender === 'bot' && userCount >= 2 && (
              <div className="flex flex-wrap gap-2 pt-1 pb-2 pl-9">
                <a
                  href={CONTACT_HREF}
                  className={`rounded-full border border-primary/35 bg-white px-3 py-1.5 text-sm text-primary transition-colors hover:border-primary hover:bg-primary/10 ${focusRing}`}
                >
                  Hablar con Lucas y Lucía
                </a>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-100 bg-white px-4 pt-3 pb-2.5">
            <form
              onSubmit={handleSubmit}
              className="flex items-end gap-2 border-b-2 border-gray-200 pb-1.5 transition-colors focus-within:border-primary"
            >
              <textarea
                ref={inputRef}
                rows={1}
                value={inputValue}
                onInput={e =>
                  setInputValue((e.target as HTMLTextAreaElement).value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu mensaje…"
                aria-label="Mensaje"
                className="max-h-24 min-w-0 flex-1 resize-none bg-transparent py-1.5 text-sm/normal text-gray-900 outline-none placeholder:text-gray-400"
                maxLength={500}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className={`flex size-9 flex-none items-center justify-center rounded-full bg-primary text-white transition-colors hover:enabled:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-35 ${focusRing}`}
                aria-label="Enviar mensaje"
              >
                <Send className="size-4.5" />
              </button>
            </form>
            <p className="mt-2 flex justify-between gap-2 text-xs text-gray-400">
              <span>Respuestas automáticas</span>
              <a
                href={CONTACT_HREF}
                className="text-gray-500 underline underline-offset-2 hover:text-primary"
              >
                ¿Prefieres escribirnos?
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Teaser */}
      {!isOpen && showTeaser && (
        <div
          onClick={toggleChat}
          className="absolute right-0 bottom-18 w-65 animate-chat-in cursor-pointer rounded-[16px_16px_4px_16px] border border-gray-200 bg-white py-3 pr-9 pl-3.5 text-sm/normal text-gray-700 shadow-lg"
        >
          ¿Tienes un viaje en mente? Cuéntanos y te ayudamos a planificarlo.
          <button
            onClick={e => {
              e.stopPropagation();
              markSeen();
            }}
            className={`absolute top-1 right-1 rounded-lg p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 ${focusRing}`}
            aria-label="Descartar"
          >
            <Cross className="size-3.5" />
          </button>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className={`relative flex size-15 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-all duration-200 hover:bg-primary/90 hover:shadow-xl ${focusRing}`}
        aria-label={isOpen ? 'Cerrar chat' : 'Abrir chat'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <Cross className="size-6.5 rotate-90" />
        ) : (
          <Bot className="size-7.5" />
        )}
        {!isOpen && !seen && (
          <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-gray-900 px-1.5 text-xs font-bold">
            1
          </span>
        )}
      </button>
    </div>
  );
}
