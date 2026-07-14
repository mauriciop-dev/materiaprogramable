import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { useRouter } from "next/router";

export default function NuevaCopropiedadPage() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [tipo, setTipo] = useState("residencial");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim()) return;
    setLoading(true);
    setError("");

    try {
      const r = await fetch("/api/copropiedades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nombre.trim(), direccion: direccion.trim(), ciudad: ciudad.trim(), tipo }),
      });
      const j = await r.json();
      if (j.data) {
        router.push("/dashboard/multi");
      } else {
        setError(j.error ?? "Error al crear");
      }
    } catch {
      setError("Error de conexión");
    }
    setLoading(false);
  }

  return (
    <Layout>
      <div style={{ maxWidth: "500px", margin: "0 auto" }}>
        <h1 style={{ margin: "0 0 1.5rem", color: "#1a1a2e", fontSize: "1.5rem" }}>Nueva Copropiedad</h1>

        <form onSubmit={handleSubmit} style={{ background: "white", borderRadius: "12px", padding: "2rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.3rem", fontSize: "0.85rem", color: "#555" }}>Nombre *</label>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} required
              style={{ width: "100%", padding: "0.6rem", borderRadius: "6px", border: "1px solid #ccc", fontSize: "0.9rem" }} />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.3rem", fontSize: "0.85rem", color: "#555" }}>Dirección</label>
            <input value={direccion} onChange={(e) => setDireccion(e.target.value)}
              style={{ width: "100%", padding: "0.6rem", borderRadius: "6px", border: "1px solid #ccc", fontSize: "0.9rem" }} />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.3rem", fontSize: "0.85rem", color: "#555" }}>Ciudad</label>
            <input value={ciudad} onChange={(e) => setCiudad(e.target.value)}
              style={{ width: "100%", padding: "0.6rem", borderRadius: "6px", border: "1px solid #ccc", fontSize: "0.9rem" }} />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.3rem", fontSize: "0.85rem", color: "#555" }}>Tipo</label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}
              style={{ width: "100%", padding: "0.6rem", borderRadius: "6px", border: "1px solid #ccc", fontSize: "0.9rem" }}>
              <option value="residencial">Residencial</option>
              <option value="comercial">Comercial</option>
              <option value="mixto">Mixto</option>
            </select>
          </div>

          {error && <p style={{ color: "#e53935", fontSize: "0.85rem", marginBottom: "1rem" }}>{error}</p>}

          <button type="submit" disabled={loading || !nombre.trim()}
            style={{
              width: "100%", padding: "0.7rem", borderRadius: "8px", border: "none",
              background: loading ? "#ccc" : "#4fc3f7", color: "white", fontSize: "0.95rem",
              cursor: loading ? "not-allowed" : "pointer", fontWeight: 600,
            }}>
            {loading ? "Creando..." : "Crear Copropiedad"}
          </button>
        </form>
      </div>
    </Layout>
  );
}
