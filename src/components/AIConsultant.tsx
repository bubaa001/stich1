import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, GraduationCap, Sparkles, Loader } from 'lucide-react';

interface AIConsultantProps {
  onClose: () => void;
  initialMessage?: string;
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export const AIConsultant: React.FC<AIConsultantProps> = ({ onClose, initialMessage }) => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: "Hello! I am Prof. Aris, your virtual mathematics mentor. 📚\n\nHow can I help you conquer algebra orquadratic formulas today?" }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Trigger initial query prompt if passed
  useEffect(() => {
    if (initialMessage) {
      handleSendMessage(initialMessage);
    }
  }, [initialMessage]);

  // Adjust scroll height on list updates
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    // Append user input
    setMessages((prev) => [...prev, { sender: 'user', text: textToSend }]);
    setInputVal('');
    setIsLoading(true);

    try {
      const resp = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          systemInstruction: "You are Professor Aris, an extremely helpful high-energy secondary school math tutor. Guide students step-by-step to understand quadratic roots, factoring, or linear inequalities. Encourage them often with active student cheers. Render LaTeX formulas beautifully."
        })
      });

      if (!resp.ok) {
        throw new Error("Endpoint failed");
      }

      const data = await resp.json();
      setMessages((prev) => [...prev, { sender: 'ai', text: data.text }]);

    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: "Forgive me, my neural circuits are recalculating formulas! Let's remember the basic quadratic step:\n\nTo solve $x^2 + 5x + 6 = 0$:\n- Factor into $(x+2)(x+3) = 0$\n- Roots are $x = -2$ and $x = -3$." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl z-[9999] border-l border-slate-200/80 flex flex-col justify-between animate-slide-in">
      
      {/* Drawer header */}
      <header className="px-5 py-4 border-b border-rose-100 flex items-center justify-between bg-indigo-600 text-white shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h4 className="font-display font-bold text-sm tracking-tight">Prof. Aris AI Companion</h4>
            <p className="text-[10px] text-indigo-200">24/7 Virtual Tutor</p>
          </div>
        </div>

        <button 
          onClick={onClose} 
          className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Messages list */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 no-scrollbar bg-slate-50/50">
        {messages.map((msg, idx) => {
          const isUser = msg.sender === 'user';
          return (
            <div 
              key={idx}
              className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-150 text-indigo-600 flex items-center justify-center shrink-0 mt-1">
                  <GraduationCap className="w-4 h-4" />
                </div>
              )}

              <div className={`p-3.5 rounded-2xl max-w-[80%] text-left text-xs leading-relaxed whitespace-pre-line shadow-sm border ${
                isUser 
                  ? 'bg-indigo-600 text-white border-transparent rounded-tr-none' 
                  : 'bg-white text-slate-800 border-slate-100 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-2.5 justify-start">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-150 text-indigo-600 flex items-center justify-center shrink-0 mt-1">
              <GraduationCap className="w-4 h-4 animate-bounce" />
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-100 rounded-tl-none flex items-center gap-1.5 text-slate-400 text-xs">
              <Loader className="w-3.5 h-3.5 animate-spin" />
              <span>Prof. Aris is calculating...</span>
            </div>
          </div>
        )}

        <div ref={scrollRef}></div>
      </div>

      {/* Suggested fast questions strip */}
      <div className="px-4 py-2 bg-slate-100 flex gap-2 overflow-x-auto no-scrollbar border-t border-slate-200/50">
        {[
          "Quadratic Factoring trick?",
          "How to evaluate 2x+5=15?",
          "Special inequality sign rules?"
        ].map((tip) => (
          <button
            key={tip}
            onClick={() => handleSendMessage(tip)}
            className="whitespace-nowrap bg-white border border-slate-200 hover:border-indigo-400/50 hover:bg-indigo-50/35 text-[10px] font-semibold text-slate-700 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
          >
            {tip}
          </button>
        ))}
      </div>

      {/* Bottom User Text Input fields */}
      <footer className="p-4 border-t border-slate-200/80 bg-white flex gap-2">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputVal)}
          placeholder="Ask about equations, proofs..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-250 focus:border-indigo-600 focus:outline-none text-xs text-slate-800 bg-slate-50"
        />

        <button
          onClick={() => handleSendMessage(inputVal)}
          disabled={!inputVal.trim()}
          className="p-3.5 bg-indigo-605 disabled:opacity-40 text-white rounded-xl shadow-md active:scale-95 transition-all flex items-center justify-center shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </footer>

    </div>
  );
};
