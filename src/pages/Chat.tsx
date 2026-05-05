import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowLeft } from 'lucide-react';
import PageTransition from '@/components/PageTransition';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

const Chat = () => {
  const { t, language } = useI18n();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const msgCount = useRef(0);

  // Reset greeting when language changes
  useEffect(() => {
    setMessages([{ id: 1, text: t('chat.greeting'), sender: 'ai' }]);
    msgCount.current = 0;
  }, [language, t]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now(), text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    msgCount.current++;

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const aiResponses = [
        t('chat.response1'),
        t('chat.response2'),
        t('chat.response3'),
      ];
      const response = msgCount.current >= 3
        ? aiResponses[2]
        : aiResponses[Math.min(msgCount.current - 1, 1)];

      setMessages((prev) => [...prev, { id: Date.now() + 1, text: response, sender: 'ai' }]);

      if (msgCount.current >= 3) {
        setTimeout(() => navigate('/triage'), 2000);
      }
    }, 1500);
  };

  return (
    <PageTransition>
      <div className="h-[100dvh] flex flex-col pt-16">
        {/* Header */}
        <div className="glass border-b border-border px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-semibold text-foreground">{t('chat.title')}</h1>
            <p className="text-xs text-muted-foreground">Virtual Clinic</p>
          </div>
          <div className="ml-auto w-2 h-2 rounded-full bg-online" />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] px-5 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'gradient-hero text-primary-foreground rounded-br-md'
                      : 'bg-secondary text-secondary-foreground rounded-bl-md'
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs">{t('chat.analyzing')}</span>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="glass border-t border-border px-4 sm:px-6 py-3 sm:py-4 pb-[env(safe-area-inset-bottom,12px)]">
          <div className="max-w-3xl mx-auto flex items-center gap-2 sm:gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder={t('chat.placeholder')}
              className="flex-1 px-5 py-3 rounded-xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-sm"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="w-11 h-11 rounded-xl gradient-hero flex items-center justify-center text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40 active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Chat;
