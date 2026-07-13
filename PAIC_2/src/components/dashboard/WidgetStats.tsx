export default function WidgetStats({ title, value, subtitle }: { title: string; value: string | number; subtitle?: string }) {
  return (
    <div style={{ height: "100%", padding: "1.2rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <p style={{ margin: "0 0 0.3rem", color: "#888", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
        {title}
      </p>
      <p style={{ margin: 0, fontSize: "2rem", fontWeight: 700, color: "#1a1a2e" }}>
        {value}
      </p>
      {subtitle && <p style={{ margin: "0.2rem 0 0", color: "#aaa", fontSize: "0.75rem" }}>{subtitle}</p>}
    </div>
  );
}
