import './ChatBot.css'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { API } from '../api'

const WELCOME = {
  role: 'model',
  text: "Hi there! 👋 I'm your menu assistant. Ask me about our dishes, prices, or what to order.",
};

function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // keep the conversation pinned to the latest message
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isSending, open]);

  // focus the field when the panel opens
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const sendMessage = async (e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || isSending) return;

    setError(null);
    setInput('');

    // history the backend expects: prior turns, excluding the welcome greeting
    const history = messages
      .filter((m) => m !== WELCOME)
      .map((m) => ({ role: m.role, text: m.text }));

    setMessages((prev) => [...prev, { role: 'user', text }]);
    setIsSending(true);

    try {
      const { data } = await axios.post(`${API}/api/chat`, { message: text, history });
      setMessages((prev) => [...prev, { role: 'model', text: data.reply }]);
    } catch (err) {
      const detail =
        err.response?.data?.error ?? "Something went wrong. Please try again.";
      setError(detail);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="chatbot">
      {/* Chat panel */}
      <div className={`chatbot__panel ${open ? 'is-open' : ''}`} role="dialog" aria-label="Menu assistant chat">
        <header className="chatbot__header">
          <div className="chatbot__header-info">
            <span className="chatbot__avatar" aria-hidden="true"><BotIcon /></span>
            <div>
              <p className="chatbot__title">Menu Assistant</p>
              <p className="chatbot__status">
                <span className="chatbot__dot" /> Online
              </p>
            </div>
          </div>
          <button className="chatbot__close" onClick={() => setOpen(false)} aria-label="Close chat">
            &times;
          </button>
        </header>

        <div className="chatbot__messages" ref={scrollRef}>
          {messages.map((m, i) => (
            <div key={i} className={`chatbot__msg chatbot__msg--${m.role}`}>
              {m.text}
            </div>
          ))}

          {isSending && (
            <div className="chatbot__msg chatbot__msg--model chatbot__typing" aria-label="Assistant is typing">
              <span /><span /><span />
            </div>
          )}

          {error && <p className="chatbot__error">{error}</p>}
        </div>

        <form className="chatbot__form" onSubmit={sendMessage}>
          <input
            ref={inputRef}
            className="chatbot__input"
            type="text"
            placeholder="Ask about our menu…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isSending}
          />
          <button
            className="chatbot__send"
            type="submit"
            disabled={isSending || !input.trim()}
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </form>
      </div>

      {/* Floating launcher */}
      <button
        className={`chatbot__launcher ${open ? 'is-open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        <span className="chatbot__launcher-icon chatbot__launcher-icon--bot"><BotIcon /></span>
        <span className="chatbot__launcher-icon chatbot__launcher-icon--close">&times;</span>
      </button>
    </div>
  );
}

function BotIcon() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="8" width="16" height="11" rx="3.5" />
      <path d="M12 8V4" />
      <circle cx="12" cy="3" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="9" cy="13" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="15" cy="13" r="1.2" fill="currentColor" stroke="none" />
      <path d="M9.5 16.2h5" />
      <path d="M2.5 12v3" />
      <path d="M21.5 12v3" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
    </svg>
  );
}

export default ChatBot
