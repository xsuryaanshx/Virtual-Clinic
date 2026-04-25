import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Send, Bot, User, Loader2, ArrowRight, Sparkles, Shield } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { supabase, getChatMessages, saveChatMessage } from "@/lib/supabase";
import { getChatApiUrl } from "@/lib/chatApi";
import { springSnappy } from "@/lib/motionVariants";
import { Button } from "@/components/user/ui/button";
import { Input } from "@/components/user/ui/input";
import { ScrollArea } from "@/components/user/ui/scroll-area";

export type TriageResult = {
  urgency: "low" | "medium" | "high";
  specialist: string;
  summary: string;
};

type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
};

const Chat = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const consultationId = searchParams.get("id");
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const viewport = root.querySelector("[data-radix-scroll-area-viewport]") as HTMLElement | null;
    const el = viewport ?? root;
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [messages, loading]);

  useEffect(() => {
    if (consultationId) return;
    setMessages([
      {
        id: "initial",
        role: "assistant",
        content: t("chat.greeting"),
      },
    ]);
  }, [consultationId, t]);

  useEffect(() => {
    if (!consultationId) return;

    const loadHistory = async () => {
      const { data } = await getChatMessages(consultationId);
      if (data) {
        setMessages(
          data.map((msg: { id: string; role: string; content: string }) => ({
            id: msg.id,
            role: msg.role as Message["role"],
            content: msg.content,
          }))
        );
      }
    };
    void loadHistory();

    const channel = supabase
      .channel(`chat_messages:consultation_id=eq.${consultationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `consultation_id=eq.${consultationId}`,
        },
        (payload) => {
          const newMsg = payload.new as { id: string; role: string; content: string };
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [
              ...prev,
              { id: newMsg.id, role: newMsg.role as Message["role"], content: newMsg.content },
            ];
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
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    if (consultationId) {
      await saveChatMessage({
        consultation_id: consultationId,
        role: "user",
        content: userMessage.content,
      });
      return;
    }

    setLoading(true);
    const conversation = [...messages, userMessage].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const response = await fetch(getChatApiUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: conversation }),
      });

      const raw = await response.text();
      let data: { content?: string; error?: string };
      try {
        data = JSON.parse(raw) as { content?: string; error?: string };
      } catch {
        toast.error(t("chat.error"));
        setLoading(false);
        return;
      }

      if (!response.ok) {
        toast.error(data.error || t("chat.error"));
        setLoading(false);
        return;
      }

      const aiMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.content ?? "",
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      toast.error(t("chat.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleFinishTriage = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const triageResult: TriageResult = {
      urgency: "medium",
      specialist: "General Practitioner",
      summary:
        "Patient is experiencing symptoms that require standard evaluation.",
    };

    setLoading(false);
    navigate("/triage", { state: { triage: triageResult } });
  };

  const bubbleMotion = reduceMotion
    ? { initial: false, animate: { opacity: 1 } }
    : { layout: true as const, initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: springSnappy };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-background pt-16">
      <motion.header
        initial={reduceMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="border-b border-border/80 z-10 px-4 py-4 md:px-6 backdrop-blur-md bg-card/80 supports-[backdrop-filter]:bg-card/70 shadow-soft"
      >
        <div className="max-w-3xl mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div
              className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                consultationId ? "bg-primary/15 text-primary" : "gradient-hero text-primary-foreground shadow-card"
              }`}
            >
              {consultationId ? (
                <Shield className="h-5 w-5" aria-hidden />
              ) : (
                <Sparkles className="h-5 w-5" aria-hidden />
              )}
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
                {consultationId ? t("chat.consultationTitle") : t("chat.title")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {consultationId ? t("chat.consultationSubtitle") : t("chat.aiPowered")}
              </p>
            </div>
          </div>
          {!consultationId && messages.length > 2 && (
            <Button
              type="button"
              onClick={() => void handleFinishTriage()}
              disabled={loading}
              className="rounded-xl gap-2 shrink-0 shadow-card"
            >
              {t("chat.finishTriage")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </motion.header>

      <ScrollArea className="flex-1 min-h-0" ref={scrollRef}>
        <div className="max-w-3xl mx-auto space-y-4 p-4 pb-8 md:p-6">
          <AnimatePresence initial={false} mode="popLayout">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                {...bubbleMotion}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex gap-3 max-w-[min(100%,28rem)] ${
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted text-muted-foreground ring-1 ring-border/60"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User className="h-4 w-4" aria-hidden />
                    ) : (
                      <Bot className="h-4 w-4" aria-hidden />
                    )}
                  </div>
                  <div
                    className={`rounded-2xl px-4 py-3 shadow-soft ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-md"
                        : "bg-muted/80 text-foreground rounded-tl-md border border-border/50"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
            {loading && !consultationId && (
              <motion.div
                key="typing"
                initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex justify-start"
              >
                <div className="flex max-w-[min(100%,28rem)] gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground ring-1 ring-border/60">
                    <Bot className="h-4 w-4" aria-hidden />
                  </div>
                  <div className="flex items-center gap-2 rounded-2xl rounded-tl-md border border-border/50 bg-muted/80 px-4 py-3 shadow-soft">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
                    <span className="text-sm text-muted-foreground">{t("chat.analyzing")}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="border-t border-border/80 bg-card/90 backdrop-blur-md p-4 md:p-5 supports-[backdrop-filter]:bg-card/75"
      >
        <form
          onSubmit={(e) => void handleSend(e)}
          className="mx-auto flex max-w-3xl gap-2 md:gap-3"
        >
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              consultationId ? t("chat.messagePlaceholder") : t("chat.placeholder")
            }
            disabled={loading}
            className="h-11 flex-1 rounded-full border-input bg-background/80 px-5 text-sm shadow-inner focus-visible:ring-primary/40"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || loading}
            className="h-11 w-11 shrink-0 rounded-full shadow-card transition-transform hover:scale-[1.03] active:scale-[0.97]"
            aria-label={t("chat.messagePlaceholder")}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default Chat;
