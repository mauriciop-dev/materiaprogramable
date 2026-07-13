export default function WidgetTable({ data, columns }: { data: any[]; columns: { key: string; label: string }[] }) {
  return (
    <div style={{ height: "100%", overflow: "auto", padding: "0.5rem" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
            {columns.map((c) => (
              <th key={c.key} style={{ padding: "0.4rem 0.5rem", textAlign: "left", color: "#888", fontWeight: 600 }}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.slice(0, 5).map((row, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #f8f8f8" }}>
              {columns.map((c) => (
                <td key={c.key} style={{ padding: "0.4rem 0.5rem", color: "#444" }}>{row[c.key] ?? "-"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
