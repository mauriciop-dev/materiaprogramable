import { useState } from "react";
import { useRouter } from "next/router";
import { signInWithGoogle } from "@/services/auth";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithGoogle();
    } catch {
      setError("Error al iniciar sesión con Google");
      setLoading(false);
    }
  };

  return (
    <main style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "#f5f5f5", fontFamily: "sans-serif",
    }}>
      <div style={{
        background: "white", padding: "3rem", borderRadius: "16px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)", width: "100%", maxWidth: "400px",
        textAlign: "center",
      }}>
        <h1 style={{ fontSize: "1.8rem", marginBottom: "0.5rem", color: "#1a1a2e" }}>
          PAIC
        </h1>
        <p style={{ color: "#666", marginBottom: "2rem", fontSize: "0.95rem" }}>
          Plataforma para la Administración Inteligente de Copropiedades
        </p>

        {error && (
          <p style={{ color: "#e74c3c", marginBottom: "1rem", fontSize: "0.9rem" }}>
            {error}
          </p>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: "100%", padding: "0.85rem", border: "1px solid #ddd",
            borderRadius: "8px", background: "white", cursor: "pointer",
            fontSize: "1rem", display: "flex", alignItems: "center",
            justifyContent: "center", gap: "0.6rem", opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Conectando..." : "Iniciar sesión con Google"}
        </button>
      </div>
    </main>
  );
}
