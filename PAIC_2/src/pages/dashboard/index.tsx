import { useEffect, useState, useCallback } from "react";
import Layout from "@/components/layout/Layout";
import DashboardGrid, { defaultLayout, getDefaultWidgets } from "@/components/dashboard/DashboardGrid";
import type { LayoutItem } from "@/components/dashboard/DashboardGrid";
import WidgetConfig from "@/components/dashboard/WidgetConfig";

const STORAGE_KEY = "paic-dashboard-config";

function loadConfig() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function saveConfig(config: { activeWidgets: Record<string, boolean>; layout: LayoutItem[] }) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showConfig, setShowConfig] = useState(false);

  const saved = loadConfig();
  const [activeWidgets, setActiveWidgets] = useState<Record<string, boolean>>(
    saved?.activeWidgets ?? getDefaultWidgets()
  );
  const [layout, setLayout] = useState<LayoutItem[]>(saved?.layout ?? defaultLayout());
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState("");

  const loadSummary = useCallback(() => {
    setLoading(true);
    fetch("/api/dashboard/summary")
      .then((r) => r.json())
      .then((j) => { setData(j.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  async function handleSeed() {
    setSeeding(true);
    setSeedMsg("Creando datos de ejemplo...");
    try {
      const r = await fetch("/api/seed", { method: "POST" });
      const j = await r.json();
      if (j.success) {
        setSeedMsg("¡Datos creados exitosamente! Recargando...");
        loadSummary();
      } else {
        setSeedMsg(`Error: ${j.error}`);
      }
    } catch {
      setSeedMsg("Error al conectar con el servidor");
    }
    setSeeding(false);
  }

  useEffect(() => {
    saveConfig({ activeWidgets, layout });
  }, [activeWidgets, layout]);

  const handleToggle = (id: string) => {
    setActiveWidgets((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Layout>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.5rem", color: "#1a1a2e" }}>Centro de Control</h1>
            <p style={{ margin: "0.2rem 0 0", color: "#888", fontSize: "0.85rem" }}>
              Arrastra las cajas para personalizar tu dashboard
            </p>
          </div>
          <button
            onClick={() => setShowConfig(true)}
            style={{
              padding: "0.5rem 1rem", background: "#1a1a2e", color: "white",
              border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "0.85rem",
            }}
          >
            Configurar
          </button>
        </div>

        {loading ? (
          <p style={{ color: "#888" }}>Cargando datos...</p>
        ) : data && Object.values(data).every((v: any) => v === 0 || v === "$0") ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem", background: "white", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <h2 style={{ margin: "0 0 0.5rem", color: "#1a1a2e" }}>¡Bienvenido a PAIC!</h2>
            <p style={{ color: "#888", marginBottom: "1.5rem" }}>
              Tu plataforma aún no tiene datos. Carga datos de ejemplo para explorar todas las funcionalidades.
            </p>
            <button
              onClick={handleSeed}
              disabled={seeding}
              style={{
                padding: "0.75rem 2rem", background: seeding ? "#ccc" : "#4fc3f7",
                color: "white", border: "none", borderRadius: "8px",
                cursor: seeding ? "not-allowed" : "pointer", fontSize: "1rem",
              }}
            >
              {seeding ? "Creando datos..." : "Cargar datos de ejemplo"}
            </button>
            {seedMsg && <p style={{ marginTop: "1rem", color: "#666", fontSize: "0.9rem" }}>{seedMsg}</p>}
          </div>
        ) : (
          <>
            <DashboardGrid
              data={data}
              activeWidgets={activeWidgets}
              layout={layout}
              onLayoutChange={setLayout}
            />
          </>
        )}
      </div>

      {showConfig && (
        <WidgetConfig
          activeWidgets={activeWidgets}
          onToggle={handleToggle}
          onClose={() => setShowConfig(false)}
        />
      )}
    </Layout>
  );
}
