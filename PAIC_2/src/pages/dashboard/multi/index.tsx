import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import Link from "next/link";

type Resumen = {
  id: string;
  nombre: string;
  ciudad?: string;
  subscription_plan?: string;
  stats?: { residentes: number; unidades: number; tareas_pendientes: number; ingresos_mes: number; gastos_mes: number };
};

export default function MultiDashboardPage() {
  const [copropiedades, setCopropiedades] = useState<Resumen[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const r = await fetch("/api/copropiedades");
      const j = await r.json();
      const lista: Resumen[] = j.data ?? [];

      const conStats = await Promise.all(
        lista.map(async (c) => {
          try {
            const s = await fetch(`/api/dashboard/summary?conjunto_id=${c.id}`);
            const sj = await s.json();
            return { ...c, stats: sj.data };
          } catch {
            return c;
          }
        })
      );

      setCopropiedades(conStats);
      setLoading(false);
    })();
  }, []);

  const totalResidentes = copropiedades.reduce((a, c) => a + (c.stats?.residentes ?? 0), 0);
  const totalUnidades = copropiedades.reduce((a, c) => a + (c.stats?.unidades ?? 0), 0);
  const totalTareas = copropiedades.reduce((a, c) => a + (c.stats?.tareas_pendientes ?? 0), 0);
  const totalIngresos = copropiedades.reduce((a, c) => a + (c.stats?.ingresos_mes ?? 0), 0);
  const totalGastos = copropiedades.reduce((a, c) => a + (c.stats?.gastos_mes ?? 0), 0);

  return (
    <Layout>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.5rem", color: "#1a1a2e" }}>Dashboard Multi</h1>
            <p style={{ margin: "0.2rem 0 0", color: "#888", fontSize: "0.85rem" }}>
              Información consolidada de todas tus copropiedades
            </p>
          </div>
          <Link href="/dashboard/nueva-copropiedad" style={{
            padding: "0.5rem 1rem", background: "#4fc3f7", color: "white",
            borderRadius: "8px", textDecoration: "none", fontSize: "0.85rem",
          }}>
            + Nueva Copropiedad
          </Link>
        </div>

        {loading ? (
          <p style={{ color: "#888" }}>Cargando...</p>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
              {[
                { label: "Total Residentes", value: totalResidentes, color: "#4fc3f7" },
                { label: "Total Unidades", value: totalUnidades, color: "#81c784" },
                { label: "Tareas Pendientes", value: totalTareas, color: "#ffb74d" },
                { label: "Ingresos Totales", value: `$${(totalIngresos ?? 0).toLocaleString()}`, color: "#aed581" },
                { label: "Gastos Totales", value: `$${(totalGastos ?? 0).toLocaleString()}`, color: "#e57373" },
                { label: "Copropiedades", value: copropiedades.length, color: "#ba68c8" },
              ].map((s) => (
                <div key={s.label} style={{
                  background: "white", borderRadius: "12px", padding: "1.2rem",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  borderLeft: `4px solid ${s.color}`,
                }}>
                  <div style={{ fontSize: "0.75rem", color: "#888", marginBottom: "0.3rem" }}>{s.label}</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1a1a2e" }}>{s.value}</div>
                </div>
              ))}
            </div>

            <h2 style={{ fontSize: "1.1rem", color: "#1a1a2e", marginBottom: "1rem" }}>Tus Copropiedades</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
              {copropiedades.map((c) => (
                <Link key={c.id} href={`/dashboard?conjunto_id=${c.id}`} style={{
                  textDecoration: "none", color: "inherit",
                }}>
                  <div style={{
                    background: "white", borderRadius: "12px", padding: "1.2rem",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)", cursor: "pointer",
                    transition: "box-shadow 0.2s",
                  }}>
                    <h3 style={{ margin: "0 0 0.3rem", fontSize: "1rem", color: "#1a1a2e" }}>{c.nombre}</h3>
                    {c.ciudad && <p style={{ margin: "0 0 0.8rem", fontSize: "0.8rem", color: "#888" }}>{c.ciudad}</p>}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", fontSize: "0.8rem" }}>
                      <div>Residentes: <strong>{c.stats?.residentes ?? 0}</strong></div>
                      <div>Unidades: <strong>{c.stats?.unidades ?? 0}</strong></div>
                      <div>Tareas: <strong>{c.stats?.tareas_pendientes ?? 0}</strong></div>
                      <div>Plan: <strong>{(c.subscription_plan ?? "N/A").toUpperCase()}</strong></div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
