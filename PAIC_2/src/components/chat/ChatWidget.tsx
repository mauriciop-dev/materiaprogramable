import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const SUGGESTIONS = [
  "¿Cómo registro un nuevo residente?",
  "¿Qué es el coeficiente de copropiedad?",
  "Explícame las expensas comunes",
  "Quiero tomar el curso básico",
];

const initialMessages: Message[] = [
  {
    role: "assistant",
    content:
      "¡Hola! Soy PAIC, tu asistente virtual para administración de copropiedades. Puedo ayudarte a usar la plataforma o resolver dudas sobre propiedades horizontales en Colombia.",
  },
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [modo, setModo] = useState<"chat" | "curso">("chat");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  async function sendMessage(content: string) {
    if (!content.trim() || loading) return;

    const userMsg: Message = { role: "user", content: content.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const chatHistory = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory, modo }),
      });

      if (!res.ok) {
        const err = await res.json();
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "assistant", content: `Error: ${err.error ?? "Error de conexión"}` },
        ]);
        setLoading(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        setLoading(false);
        return;
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          try {
            const parsed = JSON.parse(data);
            if (parsed.done) {
              setLoading(false);
              continue;
            }
            if (parsed.error) {
              setMessages((prev) => [
                ...prev.slice(0, -1),
                { role: "assistant", content: `Error: ${parsed.error}` },
              ]);
              setLoading(false);
              continue;
            }
            if (parsed.text) {
              setMessages((prev) => {
                const copy = [...prev];
                const last = copy[copy.length - 1];
                if (last && last.role === "assistant") {
                  copy[copy.length - 1] = {
                    ...last,
                    content: last.content + parsed.text,
                  };
                }
                return copy;
              });
            }
          } catch {
            // skip invalid JSON
          }
        }
      }
    } catch (error: any) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "assistant", content: `Error de conexión: ${error?.message}` },
      ]);
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "#4fc3f7",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontSize: "1.5rem",
          boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        title="Asistente PAIC"
      >
        {open ? "✕" : "💬"}
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "5rem",
            right: "1.5rem",
            width: "380px",
            height: "560px",
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            fontFamily: "sans-serif",
          }}
        >
          <div
            style={{
              background: "#1a1a2e",
              color: "white",
              padding: "0.75rem 1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontWeight: 600 }}>Asistente PAIC</span>
            <div style={{ display: "flex", gap: "0.4rem" }}>
              <button
                onClick={() => setModo("chat")}
                style={{
                  padding: "0.2rem 0.6rem",
                  fontSize: "0.75rem",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                  background: modo === "chat" ? "#4fc3f7" : "#333",
                  color: "white",
                }}
              >
                Chat
              </button>
              <button
                onClick={() => setModo("curso")}
                style={{
                  padding: "0.2rem 0.6rem",
                  fontSize: "0.75rem",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                  background: modo === "curso" ? "#4fc3f7" : "#333",
                  color: "white",
                }}
              >
                Curso
              </button>
            </div>
          </div>

          <div
            ref={listRef}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "0.75rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              background: "#f5f5f5",
            }}
          >
            {messages.length === 1 && !loading && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.4rem",
                  marginBottom: "0.5rem",
                }}
              >
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    style={{
                      padding: "0.35rem 0.7rem",
                      fontSize: "0.78rem",
                      borderRadius: "12px",
                      border: "1px solid #4fc3f7",
                      background: "white",
                      color: "#1a1a2e",
                      cursor: "pointer",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "12px",
                  background: msg.role === "user" ? "#4fc3f7" : "white",
                  color: msg.role === "user" ? "white" : "#1a1a2e",
                  fontSize: "0.85rem",
                  lineHeight: 1.4,
                  whiteSpace: "pre-wrap",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                {msg.content || (msg.role === "assistant" && i === messages.length - 1 ? (
                  <span style={{ opacity: 0.6 }}>Escribiendo...</span>
                ) : null)}
              </div>
            ))}
          </div>

          <div
            style={{
              padding: "0.5rem",
              borderTop: "1px solid #ddd",
              display: "flex",
              gap: "0.5rem",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={loading ? "Esperando respuesta..." : "Escribe tu mensaje..."}
              disabled={loading}
              style={{
                flex: 1,
                padding: "0.5rem 0.75rem",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "0.85rem",
                outline: "none",
              }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                border: "none",
                background: loading || !input.trim() ? "#ccc" : "#4fc3f7",
                color: "white",
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                fontSize: "0.85rem",
              }}
            >
              {loading ? "..." : "→"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
