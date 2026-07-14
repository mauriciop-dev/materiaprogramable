import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const MENU_BASE = [
  { label: "Centro de Control", href: "/dashboard", icon: "📊", modulo: "dashboard" },
  { label: "Base de Datos", href: "/dashboard/base-datos", icon: "🗄️", modulo: "base_datos" },
  { label: "Áreas Comunes", href: "/dashboard/areas-comunes", icon: "🏊", modulo: "areas_comunes" },
  { label: "Comunicaciones", href: "/dashboard/comunicaciones", icon: "📢", modulo: "comunicaciones" },
  { label: "Archivos", href: "/dashboard/archivos", icon: "📁", modulo: "archivos" },
  { label: "Finanzas", href: "/dashboard/finanzas", icon: "💰", modulo: "finanzas" },
  { label: "Seguridad", href: "/dashboard/seguridad", icon: "🔒", modulo: "seguridad" },
  { label: "Vencimientos", href: "/dashboard/vencimientos", icon: "📅", modulo: "vencimientos" },
  { label: "Tareas", href: "/dashboard/tareas", icon: "✅", modulo: "tareas" },
  { label: "Cámaras", href: "/dashboard/camaras", icon: "🎥", modulo: "camaras" },
  { label: "Cartelera", href: "/dashboard/cartelera", icon: "📺", modulo: "cartelera" },
];

export default function Sidebar() {
  const router = useRouter();
  const [modulosPermitidos, setModulosPermitidos] = useState<string[] | null>(null);
  const [planActual, setPlanActual] = useState<string>("");

  useEffect(() => {
    fetch("/api/subscription")
      .then((r) => r.json())
      .then((j) => {
        setPlanActual(j.plan_actual ?? "basico");
        const modulos = j.modulos_por_plan?.[j.plan_actual] ?? [];
        setModulosPermitidos(modulos);
      })
      .catch(() => setModulosPermitidos([]));
  }, []);

  const tieneModulo = (modulo: string) => {
    if (!modulosPermitidos) return true;
    return modulosPermitidos.includes(modulo);
  };

  return (
    <aside style={{
      width: "240px", minHeight: "100vh", background: "#1a1a2e",
      color: "white", padding: "1rem 0", position: "fixed", left: 0, top: 0,
      overflowY: "auto",
    }}>
      <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #2a2a4a", marginBottom: "0.5rem" }}>
        <h2 style={{ fontSize: "1.3rem", margin: 0 }}>PAIC</h2>
        <small style={{ color: "#8899aa" }}>Copropiedades</small>
      </div>

      {planActual && (
        <Link href="/dashboard/planes" style={{
          display: "flex", alignItems: "center", gap: "0.4rem",
          padding: "0.3rem 1.5rem 0.7rem", fontSize: "0.75rem",
          color: "#4fc3f7", textDecoration: "none",
        }}>
          Plan: {planActual.toUpperCase()} ⚙️
        </Link>
      )}

      <nav>
        {MENU_BASE.map((item) => {
          const active = router.pathname === item.href;
          const permitido = tieneModulo(item.modulo);

          return (
            <Link
              key={item.href}
              href={permitido ? item.href : "#"}
              onClick={(e) => { if (!permitido) e.preventDefault(); }}
              style={{
                display: "flex", alignItems: "center", gap: "0.6rem",
                padding: "0.7rem 1.5rem",
                color: active ? "#4fc3f7" : permitido ? "#ccd" : "#555",
                textDecoration: "none", fontSize: "0.9rem",
                background: active ? "rgba(79,195,247,0.1)" : "transparent",
                borderRight: active ? "3px solid #4fc3f7" : "3px solid transparent",
                cursor: permitido ? "pointer" : "not-allowed",
                opacity: permitido ? 1 : 0.5,
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
              {!permitido && <span style={{ marginLeft: "auto", fontSize: "0.65rem", color: "#888" }}>🔒</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
