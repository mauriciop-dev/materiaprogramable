import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { MODULOS_INFO } from "@/services/subscription";

type PlanInfo = { slug: string; nombre: string; precio: number; periodo: string; destacado?: boolean; descripcion: string };

export default function PlanesPage() {
  const [planes, setPlanes] = useState<PlanInfo[]>([]);
  const [modulosPorPlan, setModulosPorPlan] = useState<Record<string, string[]>>({});
  const [planActual, setPlanActual] = useState("");
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/subscription")
      .then((r) => r.json())
      .then((j) => {
        setPlanes(j.planes ?? []);
        setModulosPorPlan(j.modulos_por_plan ?? {});
        setPlanActual(j.plan_actual ?? "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleUpgrade(plan: string) {
    setUpgrading(plan);
    const r = await fetch("/api/subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const j = await r.json();
    if (j.success) {
      setPlanActual(plan);
    }
    setUpgrading(null);
  }

  function getModulos(plan: string): string[] {
    return modulosPorPlan[plan] ?? [];
  }

  return (
    <Layout>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <h1 style={{ margin: "0 0 0.3rem", color: "#1a1a2e", fontSize: "1.5rem" }}>Planes y Suscripción</h1>
        <p style={{ color: "#888", marginBottom: "2rem", fontSize: "0.9rem" }}>
          Plan actual: <strong>{planActual.toUpperCase()}</strong>
        </p>

        {loading ? (
          <p style={{ color: "#888" }}>Cargando...</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            {planes.map((plan) => {
              const esActual = plan.slug === planActual;
              const modulos = getModulos(plan.slug);

              return (
                <div key={plan.slug} style={{
                  background: "white", borderRadius: "12px", padding: "1.5rem",
                  boxShadow: plan.destacado ? "0 4px 20px rgba(79,195,247,0.25)" : "0 2px 8px rgba(0,0,0,0.06)",
                  border: plan.destacado ? "2px solid #4fc3f7" : "1px solid #eee",
                  position: "relative", display: "flex", flexDirection: "column",
                }}>
                  {plan.destacado && (
                    <div style={{
                      position: "absolute", top: "-10px", right: "10px",
                      background: "#4fc3f7", color: "white", padding: "0.2rem 0.8rem",
                      borderRadius: "12px", fontSize: "0.75rem", fontWeight: 600,
                    }}>
                      Recomendado
                    </div>
                  )}

                  <h3 style={{ margin: "0 0 0.3rem", color: "#1a1a2e", fontSize: "1.1rem" }}>{plan.nombre}</h3>
                  <p style={{ color: "#888", fontSize: "0.8rem", margin: "0 0 1rem", minHeight: "2.5rem" }}>
                    {plan.descripcion}
                  </p>

                  <div style={{ marginBottom: "1rem" }}>
                    <span style={{ fontSize: "1.8rem", fontWeight: 700, color: "#1a1a2e" }}>
                      {plan.precio === 0 ? "Gratis" : `$${(plan.precio ?? 0).toLocaleString()}`}
                    </span>
                    {plan.precio > 0 && <span style={{ color: "#888", fontSize: "0.85rem" }}>{plan.periodo}</span>}
                  </div>

                  <div style={{ flex: 1, marginBottom: "1rem" }}>
                    <p style={{ fontSize: "0.75rem", color: "#888", margin: "0 0 0.5rem", fontWeight: 600 }}>
                      MÓDULOS INCLUIDOS:
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                      {modulos.map((m) => (
                        <div key={m} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", color: "#444" }}>
                          <span>✓</span>
                          <span>{MODULOS_INFO[m] ?? m}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleUpgrade(plan.slug)}
                    disabled={esActual || upgrading !== null}
                    style={{
                      padding: "0.6rem 1rem", borderRadius: "8px", border: "none",
                      background: esActual ? "#e0e0e0" : plan.destacado ? "#4fc3f7" : "#1a1a2e",
                      color: esActual ? "#888" : "white",
                      cursor: esActual || upgrading !== null ? "not-allowed" : "pointer",
                      fontSize: "0.85rem", fontWeight: 600,
                    }}
                  >
                    {upgrading === plan.slug ? "Procesando..." : esActual ? "Plan Actual" : plan.precio === 0 ? "Comenzar Prueba" : "Seleccionar"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
