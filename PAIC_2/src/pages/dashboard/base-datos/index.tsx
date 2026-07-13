import Layout from "@/components/layout/Layout";
import { useState, useEffect, useCallback } from "react";

type Tab = "residentes" | "unidades" | "proveedores" | "personal";

const TABS: { key: Tab; label: string }[] = [
  { key: "residentes", label: "Residentes" },
  { key: "unidades", label: "Unidades" },
  { key: "proveedores", label: "Proveedores" },
  { key: "personal", label: "Personal Interno" },
];

const COLUMNAS: Record<Tab, { key: string; label: string }[]> = {
  residentes: [
    { key: "name", label: "Nombre" },
    { key: "apartment", label: "Unidad" },
    { key: "documento", label: "Documento" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Telefono" },
  ],
  unidades: [
    { key: "numero", label: "Numero" },
    { key: "tipo", label: "Tipo" },
    { key: "torre", label: "Torre" },
    { key: "interior", label: "Interior" },
    { key: "piso", label: "Piso" },
    { key: "propietario_nombre", label: "Propietario" },
  ],
  proveedores: [
    { key: "company", label: "Empresa" },
    { key: "specialty", label: "Especialidad" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Telefono" },
  ],
  personal: [
    { key: "name", label: "Nombre" },
    { key: "position", label: "Cargo" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Telefono" },
  ],
};

export default function BaseDatosPage() {
  const [tab, setTab] = useState<Tab>("residentes");
  const [data, setData] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [modal, setModal] = useState<{ open: boolean; edit?: any }>({ open: false });

  const fetchData = useCallback(async () => {
    const res = await fetch(`/api/database/${tab}`);
    const json = await res.json();
    setData(json.data ?? []);
  }, [tab]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async (form: any) => {
    const method = form.id ? "PUT" : "POST";
    await fetch(`/api/database/${tab}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setModal({ open: false });
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Eliminar este registro?")) return;
    await fetch(`/api/database/${tab}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchData();
  };

  const filtered = data.filter((row) =>
    JSON.stringify(row).toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <Layout>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h1 style={{ margin: 0, fontSize: "1.5rem", color: "#1a1a2e" }}>Base de Datos</h1>
          <button onClick={() => setModal({ open: true })} style={btnPrimary}>
            + Agregar
          </button>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", borderBottom: "2px solid #e0e0e0", paddingBottom: "0.5rem" }}>
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: "0.5rem 1.2rem", border: "none", cursor: "pointer",
                background: tab === t.key ? "#1a1a2e" : "transparent",
                color: tab === t.key ? "white" : "#666",
                borderRadius: "6px", fontWeight: 500,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <input
          placeholder="Buscar..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            width: "100%", padding: "0.7rem 1rem", border: "1px solid #ddd",
            borderRadius: "8px", marginBottom: "1rem", fontSize: "0.9rem",
          }}
        />

        <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #f0f0f0" }}>
                {COLUMNAS[tab].map((col) => (
                  <th key={col.key} style={{ padding: "0.75rem 1rem", textAlign: "left", color: "#888", fontSize: "0.8rem", fontWeight: 600 }}>
                    {col.label}
                  </th>
                ))}
                <th style={{ padding: "0.75rem 1rem", width: "100px" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={row.id ?? i} style={{ borderBottom: "1px solid #f5f5f5" }}>
                  {COLUMNAS[tab].map((col) => (
                    <td key={col.key} style={{ padding: "0.75rem 1rem", fontSize: "0.9rem" }}>
                      {row[col.key] ?? "-"}
                    </td>
                  ))}
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <button onClick={() => setModal({ open: true, edit: row })} style={{ ...btnSmall, marginRight: "0.3rem" }}>Editar</button>
                    <button onClick={() => handleDelete(row.id)} style={{ ...btnSmall, background: "#e74c3c" }}>Eliminar</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={COLUMNAS[tab].length + 1} style={{ padding: "2rem", textAlign: "center", color: "#999" }}>
                    Sin registros
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal.open && (
        <ModalForm
          tab={tab}
          edit={modal.edit}
          onSave={handleSave}
          onClose={() => setModal({ open: false })}
        />
      )}
    </Layout>
  );
}

function ModalForm({ tab, edit, onSave, onClose }: { tab: Tab; edit?: any; onSave: (f: any) => void; onClose: () => void }) {
  const [form, setForm] = useState(edit ?? {});

  const campos = COLUMNAS[tab].filter((c) => c.key !== "accion");

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ background: "white", borderRadius: "16px", padding: "2rem", width: "90%", maxWidth: "500px", maxHeight: "80vh", overflow: "auto" }}>
        <h2 style={{ margin: "0 0 1.5rem", fontSize: "1.2rem", color: "#1a1a2e" }}>
          {edit ? "Editar" : "Nuevo"} registro
        </h2>
        {campos.map((campo) => (
          <div key={campo.key} style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.3rem", fontSize: "0.85rem", color: "#555" }}>
              {campo.label}
            </label>
            <input
              value={form[campo.key] ?? ""}
              onChange={(e) => setForm({ ...form, [campo.key]: e.target.value })}
              style={{
                width: "100%", padding: "0.6rem 0.8rem", border: "1px solid #ddd",
                borderRadius: "8px", fontSize: "0.9rem",
              }}
            />
          </div>
        ))}
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end", marginTop: "1.5rem" }}>
          <button onClick={onClose} style={{ ...btnSecondary }}>Cancelar</button>
          <button onClick={() => onSave(form)} style={btnPrimary}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

const btnPrimary: React.CSSProperties = {
  padding: "0.6rem 1.2rem", background: "#1a1a2e", color: "white",
  border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 500,
};

const btnSecondary: React.CSSProperties = {
  padding: "0.6rem 1.2rem", background: "#f0f0f0", color: "#333",
  border: "none", borderRadius: "8px", cursor: "pointer",
};

const btnSmall: React.CSSProperties = {
  padding: "0.3rem 0.6rem", background: "#4fc3f7", color: "white",
  border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.75rem",
};
