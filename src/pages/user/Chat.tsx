import { useEffect, useState } from "react";

type Message = {
  role: "assistant" | "user";
  content: string;
};

// 🎯 Predefined question sets (random flow)
const QUESTION_SETS = [
  [
    "What symptoms are you experiencing?",
    "How long have you had these symptoms?",
    "Do you have any fever or pain?",
    "Are you currently on any medication?",
  ],
  [
    "What seems to be the issue today?",
    "When did this start?",
    "Is it getting better or worse?",
    "Have you faced this before?",
    "Any allergies?",
  ],
  [
    "Can you describe your condition?",
    "Is the pain mild, moderate, or severe?",
    "Do you feel fatigue or weakness?",
    "Any recent illness?",
  ],
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(0);
  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [queueStage, setQueueStage] = useState<"chat" | "queue" | "call">("chat");

  // 🎯 Pick random question set on load
  useEffect(() => {
    const randomSet =
      QUESTION_SETS[Math.floor(Math.random() * QUESTION_SETS.length)];
    setQuestions(randomSet);

    setMessages([
      {
        role: "assistant",
        content: "👋 Welcome to Virtual Clinic. Let me ask you a few quick questions.",
      },
      {
        role: "assistant",
        content: randomSet[0],
      },
    ]);
  }, []);

  const sendMessage = () => {
    if (!input.trim() || queueStage !== "chat") return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const nextStep = step + 1;

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      // 🎯 If more questions remain
      if (nextStep < questions.length) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: questions[nextStep],
          },
        ]);
        setStep(nextStep);
      } else {
        // 🎯 End chat → Move to queue
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "✅ Thank you. Based on your responses, we’re connecting you to a doctor.",
          },
          {
            role: "assistant",
            content: "⏳ You are now in queue...",
          },
        ]);

        setQueueStage("queue");

        // 🎯 Simulate queue → video call
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "📞 Doctor is ready. Starting video call...",
            },
          ]);

          setQueueStage("call");
        }, 3000);
      }
    }, 1000);
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>🏥 Virtual Clinic Demo</h2>

      <div
        style={{
          border: "1px solid #ccc",
          padding: 16,
          height: 400,
          overflowY: "auto",
          marginBottom: 10,
        }}
      >
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <b>{msg.role === "user" ? "You" : "System"}:</b>
            <div>{msg.content}</div>
          </div>
        ))}

        {loading && <p>Typing...</p>}
      </div>

      {/* 🎯 INPUT DISABLED AFTER CHAT */}
      {queueStage === "chat" && (
        <>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your answer..."
            style={{ width: "80%", padding: 10 }}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />

          <button onClick={sendMessage} style={{ padding: 10 }}>
            Send
          </button>
        </>
      )}

      {/* 🎯 QUEUE UI */}
      {queueStage === "queue" && (
        <p style={{ color: "orange" }}>⏳ Waiting for doctor...</p>
      )}

      {/* 🎯 VIDEO CALL UI */}
      {queueStage === "call" && (
        <div
          style={{
            marginTop: 20,
            padding: 20,
            border: "2px solid green",
            textAlign: "center",
          }}
        >
          <h3>🎥 Video Call Live</h3>
          <p>Doctor has joined the consultation.</p>
        </div>
      )}
    </div>
  );
}
