import { ALL_WIDGETS, WIDGET_IDS } from "./DashboardGrid";

export default function WidgetConfig({
  activeWidgets, onToggle, onClose,
}: {
  activeWidgets: Record<string, boolean>;
  onToggle: (id: string) => void;
  onClose: () => void;
}) {
  const activeCount = WIDGET_IDS.filter((id) => activeWidgets[id]).length;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ background: "white", borderRadius: "16px", padding: "2rem", width: "90%", maxWidth: "480px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ margin: 0, fontSize: "1.2rem", color: "#1a1a2e" }}>Configurar Widgets</h2>
          <span style={{ fontSize: "0.85rem", color: "#888" }}>{activeCount}/10 activos</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
          {WIDGET_IDS.map((id) => (
            <label
              key={id}
              style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                padding: "0.6rem 0.8rem", borderRadius: "8px",
                background: activeWidgets[id] ? "#e8f4fd" : "#f5f5f5",
                cursor: "pointer", fontSize: "0.9rem",
                opacity: activeCount >= 10 && !activeWidgets[id] ? 0.5 : 1,
              }}
            >
              <input
                type="checkbox"
                checked={!!activeWidgets[id]}
                onChange={() => onToggle(id)}
                disabled={activeCount >= 10 && !activeWidgets[id]}
              />
              {ALL_WIDGETS[id].title}
            </label>
          ))}
        </div>

        <button onClick={onClose} style={{
          marginTop: "1.5rem", width: "100%", padding: "0.7rem",
          background: "#1a1a2e", color: "white", border: "none",
          borderRadius: "8px", cursor: "pointer", fontWeight: 500,
        }}>
          Cerrar
        </button>
      </div>
    </div>
  );
}
