import React, { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AIAdvisorWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hi! I am your AI Influencer Advisor. How can I help you analyze creators today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    
    // Add loading state message
    setMessages(prev => [...prev, { role: 'ai', content: 'Processing your request...', isSystem: true }]);
    
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';
      const response = await fetch(`${API_BASE_URL}/analytics/advisor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: newMessages })
      });
      
      const data = await response.json();
      
      setMessages(prev => {
        // Remove the loading message and add the real response
        const filtered = prev.filter(msg => !msg.isSystem);
        return [...filtered, { role: 'ai', content: data.response }];
      });
    } catch (error) {
      console.error("Advisor Error:", error);
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isSystem);
        return [...filtered, { role: 'ai', content: "Sorry, I'm having trouble connecting to the backend. Is the server running?" }];
      });
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-gradient-to-r from-primary to-secondary shadow-[0_0_20px_rgba(124,58,237,0.4)] text-white z-50 transition-transform hover:scale-110 ${isOpen ? 'hidden' : 'block'}`}
      >
        <MessageSquare size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] glass-card flex flex-col p-0 overflow-hidden z-50 border border-white/20 shadow-2xl"
          >
            <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                  <span className="text-xs font-bold">AI</span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">AI Influencer Advisor™</h3>
                  <p className="text-xs text-success">Online</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${msg.role === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-white/10 text-gray-200 rounded-bl-none'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-white/10 bg-white/5">
              <form onSubmit={handleSend} className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask for suggestions..."
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-primary/50 text-white placeholder-gray-500"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:text-secondary transition-colors">
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAdvisorWidget;
