import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, Bot, User, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/user/useAuth';
import { supabase, getChatMessages, saveChatMessage } from '@/lib/supabase';

export type TriageResult = {
  urgency: 'low' | 'medium' | 'high';
  specialist: string;
  summary: string;
};

type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
};

const Chat = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const consultationId = searchParams.get('id');
  const { user } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Load initial messages & setup Realtime if it's a live consultation
  useEffect(() => {
    if (!consultationId) {
      // AI Triage Mode: Initialize with a greeting message
      setMessages([
        {
          id: 'initial',
          role: 'assistant',
          content: 'Hello! I am your AI medical assistant. Please describe your symptoms, and I will help triage your condition.',
        }
      ]);
      return;
    }

    // Live Consultation Mode: Load history from Supabase
    const loadHistory = async () => {
      const { data } = await getChatMessages(consultationId);
      if (data) {
        setMessages(data.map((msg: any) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content
        })));
      }
    };
    loadHistory();

    // Setup Supabase Realtime Subscription
    const channel = supabase
      .channel(`chat_messages:consultation_id=eq.${consultationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `consultation_id=eq.${consultationId}`
        },
        (payload) => {
          const newMsg = payload.new;
          setMessages((prev) => {
            // Avoid duplicate messages if we just sent it
            if (prev.some(m => m.id === newMsg.id)) return prev;
            return [...prev, { id: newMsg.id, role: newMsg.role as any, content: newMsg.content }];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [consultationId]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    if (consultationId) {
      // Live Consultation: Save to Supabase
      await saveChatMessage({
        consultation_id: consultationId,
        role: 'user',
        content: userMessage.content,
      });
      // The other party (doctor) will reply via their interface
      // Realtime subscription will catch their reply
    } else {
      // AI Triage Mode: Call OpenRouter API
      setLoading(true);
      const conversation = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content
      }));

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: conversation }),
        });

        if (response.ok) {
          const data = await response.json();
          const aiMessage: Message = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: data.content,
          };
          setMessages((prev) => [...prev, aiMessage]);
        } else {
          console.error('API Error:', await response.text());
        }
      } catch (err) {
        console.error('Failed to fetch from AI API:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFinishTriage = async () => {
    // In a real app, you would pass the chat history to the LLM to get a structured JSON summary
    // For now, we simulate the triage result to navigate to the Triage page
    setLoading(true);

    // Fake processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    const triageResult: TriageResult = {
      urgency: 'medium', // Mock result
      specialist: 'General Practitioner',
      summary: 'Patient is experiencing symptoms that require standard evaluation.'
    };

    navigate('/triage', { state: { triage: triageResult } });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-background pt-16">
      {/* Header */}
      <div className="border-b p-4 bg-card flex justify-between items-center shadow-sm z-10">
        <div>
          <h1 className="text-lg font-bold">
            {consultationId ? 'Consultation Chat' : 'AI Triage Assistant'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {consultationId ? 'Connected securely via Supabase Realtime' : 'Powered by OpenRouter AI'}
          </p>
        </div>
        {!consultationId && messages.length > 2 && (
          <button
            onClick={handleFinishTriage}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary/90 transition"
          >
            Finish Triage <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Chat Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`p-3 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted text-foreground rounded-tl-sm'}`}>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          </motion.div>
        ))}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-muted rounded-tl-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm text-muted-foreground">AI is typing...</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-card border-t">
        <form onSubmit={handleSend} className="flex gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-full border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 hover:bg-primary/90 transition-all flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
