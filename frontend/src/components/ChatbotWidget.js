import React, { useState, useEffect, useRef } from 'react';
import { sendChatbotMessage } from '../api/api';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi! I am your Fade Boba AI Assistant. How can I help you with our menu today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const data = await sendChatbotMessage(userMessage, messages);
      setMessages(prev => [...prev, { role: 'assistant', text: data.reply }]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages(prev => [...prev, { role: 'assistant', text: "Sorry, I am having trouble connecting right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.floatingContainer}>
      {isOpen && (
        <div style={styles.chatWindow}>
          <div style={styles.chatHeader}>
            <h3 style={{ margin: 0, fontSize: '16px' }}>Fade Boba AI Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              style={styles.closeBtn}
            >
              ✕
            </button>
          </div>

          <div style={styles.chatBody}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  ...styles.messageContainer,
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  ...styles.messageBubble,
                  background: msg.role === 'user' ? 'var(--purple)' : 'var(--surface-muted)',
                  color: msg.role === 'user' ? 'white' : 'var(--text)'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ ...styles.messageContainer, justifyContent: 'flex-start' }}>
                <div style={{ ...styles.messageBubble, background: 'var(--surface-muted)', color: 'var(--text)' }}>
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} style={styles.inputArea}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about our menu..."
              style={styles.input}
            />
            <button type="submit" disabled={isLoading || !input.trim()} style={styles.sendBtn}>
              Send
            </button>
          </form>
        </div>
      )}

      <button
        style={{
          ...styles.toggleBtn,
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          background: isHovered ? 'var(--purple)' : 'var(--purple)',
        }}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Toggle AI Assistant"
      >
        <span style={{ fontSize: '24px' }}>💬</span>
      </button>
    </div>
  );
}

const styles = {
  floatingContainer: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '10px'
  },
  toggleBtn: {
    background: 'var(--purple)',
    border: 'none',
    borderRadius: '50%',
    width: '60px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    color: 'white',
    transition: 'all 0.2s ease',
  },
  chatWindow: {
    width: '350px',
    height: '500px',
    background: 'var(--dark-card)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    boxShadow: '0 -8px 24px rgba(0,0,0,0.4)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  chatHeader: {
    padding: '16px',
    background: 'var(--purple)',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer'
  },
  chatBody: {
    flex: 1,
    padding: '16px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  messageContainer: {
    display: 'flex',
    width: '100%'
  },
  messageBubble: {
    maxWidth: '80%',
    padding: '10px 14px',
    borderRadius: '12px',
    lineHeight: '1.4',
    fontSize: '14px'
  },
  inputArea: {
    display: 'flex',
    padding: '12px',
    borderTop: '1px solid var(--border)',
    background: 'var(--dark-card)',
    gap: '8px'
  },
  input: {
    flex: 1,
    padding: '10px 14px',
    borderRadius: '20px',
    border: '1px solid var(--border)',
    background: 'var(--surface-muted)',
    color: 'var(--text)',
    outline: 'none'
  },
  sendBtn: {
    padding: '8px 16px',
    borderRadius: '20px',
    background: 'var(--purple)',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};
