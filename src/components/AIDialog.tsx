import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, X, ShoppingBag, User, ArrowRight, Bot } from 'lucide-react';
import { Product, User as UserType } from '../types';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

interface AIDialogProps {
  user: UserType | null;
  onNavigateToProduct: (productId: string) => void;
  products: Product[];
}

export default function AIDialog({ user, onNavigateToProduct, products }: AIDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello ${user ? user.name : 'Guest'}! I'm your RFP Personal Concierge. I can recommend sarees, running shoes, smart earbuds, programming books, and even identify active custom coupons for your cart. Ask me anything!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const resp = await fetch('/api/gemini/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ text: m.text, role: m.sender === 'user' ? 'user' : 'model' })),
          userProfile: user
        })
      });

      const data = await resp.json();
      setIsTyping(false);

      if (data.text) {
        setMessages(prev => [...prev, {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        throw new Error('No assistant text returned');
      }
    } catch (err) {
      setIsTyping(false);
      // Smart client-side catalog recommendation fallback
      const q = userMsg.text.toLowerCase();
      const matched = products.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) || 
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      ).slice(0, 3);

      let fallbackText = `Here are some recommendations from our curated catalog of ${products.length} products:`;
      if (matched.length > 0) {
        fallbackText = `I found some great options for you:\n` + 
          matched.map(m => `• **${m.title}** (${m.brand}) - ₹${m.price.toLocaleString('en-IN')} [ID: ${m.id}]`).join('\n') +
          `\n\nFeel free to explore our categories or use coupon code **SAVE20** at checkout!`;
      } else {
        fallbackText = `I'm your ShopSphere shopping concierge. You can explore our verified catalog across Women's Fashion, Men's Fashion, Electronics, Footwear, Books, Gaming, and Beauty. How can I help you find what you need?`;
      }

      setMessages(prev => [...prev, {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  };

  // Extract any product IDs mentioned in AI response to enable click-to-view helper buttons
  const findMentionedProducts = (text: string) => {
    return products.filter(p => text.toLowerCase().includes(p.id.toLowerCase()) || text.toLowerCase().includes(p.title.toLowerCase().substring(0, 15)));
  };

  return (
    <>
      {/* Floating Sparkle Bubble */}
      <motion.button
        id="btn-ai-bubble"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-5 py-4 rounded-full shadow-2xl hover:brightness-110 cursor-pointer border border-white/20"
      >
        <Sparkles className="w-5 h-5 animate-pulse" />
        <span className="font-sans font-medium text-sm tracking-wide hidden sm:inline">Ask RFP AI</span>
      </motion.button>

      {/* Floating Dialog Shield */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="ai-panel-overlay"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[420px] h-[550px] bg-slate-900 border border-slate-700/60 rounded-2xl shadow-3xl overflow-hidden flex flex-col font-sans"
          >
            {/* Header */}
            <div className="bg-slate-800 p-4 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center shadow-md">
                   <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm flex items-center gap-1.5 leading-none">
                    RFP Concierge
                    <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block animate-ping"></span>
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono tracking-tight">Active Gemini Model Core</span>
                </div>
              </div>
              <button
                id="btn-close-ai"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Message Pane */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/40">
              {messages.map(msg => {
                const isAI = msg.sender === 'ai';
                const related = isAI ? findMentionedProducts(msg.text) : [];
                
                return (
                  <div key={msg.id} className={`flex gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}>
                    {isAI && (
                      <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      </div>
                    )}
                    <div className="max-w-[80%] flex flex-col space-y-1">
                      <div className={`p-3 rounded-2xl text-[13.5px] leading-relaxed select-text ${isAI ? 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700/50' : 'bg-indigo-600 text-white rounded-tr-none'}`}>
                        {msg.text}
                      </div>

                      {/* Display mentioned items shortcut buttons */}
                      {related.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {related.map(p => (
                            <button
                              key={`shortcut-${p.id}`}
                              onClick={() => {
                                onNavigateToProduct(p.id);
                                setIsOpen(false);
                              }}
                              className="text-[11px] bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 hover:border-indigo-500/50 py-1 px-2.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <ShoppingBag className="w-3 h-3" />
                              View "{p.title.length > 18 ? p.title.substring(0, 18) + '...' : p.title}"
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          ))}
                        </div>
                      )}

                      <span className="text-[10px] text-slate-500 px-1 self-start font-mono">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                  <div className="bg-slate-800 text-slate-100 p-3 rounded-2xl rounded-tl-none border border-slate-700/50">
                    <div className="flex gap-1.5 items-center py-1">
                      <span className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce delay-100"></span>
                      <span className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce delay-200"></span>
                      <span className="w-2.5 h-2.5 bg-pink-400 rounded-full animate-bounce delay-300"></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Footer Form */}
            <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
              <input
                id="inp-ai-chat"
                type="text"
                placeholder="Ask about sarees, books, active coupons..."
                value={input}
                onChange={e => setInput(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder:text-slate-500 font-sans"
              />
              <button
                id="btn-send-ai"
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-full shadow-lg flex items-center justify-center transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
