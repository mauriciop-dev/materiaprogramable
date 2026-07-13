import Link from "next/link";
import { useRouter } from "next/router";

const menuItems = [
  { label: "Centro de Control", href: "/dashboard", icon: "📊" },
  { label: "Base de Datos", href: "/dashboard/base-datos", icon: "🗄️" },
  { label: "Áreas Comunes", href: "/dashboard/areas-comunes", icon: "🏊" },
  { label: "Comunicaciones", href: "/dashboard/comunicaciones", icon: "📢" },
  { label: "Archivos", href: "/dashboard/archivos", icon: "📁" },
  { label: "Finanzas", href: "/dashboard/finanzas", icon: "💰" },
  { label: "Seguridad", href: "/dashboard/seguridad", icon: "🔒" },
  { label: "Vencimientos", href: "/dashboard/vencimientos", icon: "📅" },
  { label: "Tareas", href: "/dashboard/tareas", icon: "✅" },
  { label: "Cámaras", href: "/dashboard/camaras", icon: "🎥" },
  { label: "Cartelera", href: "/dashboard/cartelera", icon: "📺" },
];

export default function Sidebar() {
  const router = useRouter();

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

      <nav>
        {menuItems.map((item) => {
          const active = router.pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex", alignItems: "center", gap: "0.6rem",
                padding: "0.7rem 1.5rem", color: active ? "#4fc3f7" : "#ccd",
                textDecoration: "none", fontSize: "0.9rem",
                background: active ? "rgba(79,195,247,0.1)" : "transparent",
                borderRight: active ? "3px solid #4fc3f7" : "3px solid transparent",
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
