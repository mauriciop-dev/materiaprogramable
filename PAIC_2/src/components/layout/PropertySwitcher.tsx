import { useCopropiedad } from "@/context/CopropiedadContext";
import { useRouter } from "next/router";

export default function PropertySwitcher() {
  const { actual, lista, setActual } = useCopropiedad();
  const router = useRouter();

  if (lista.length <= 1) return null;

  return (
    <div style={{ padding: "0.5rem 1.5rem", borderBottom: "1px solid #2a2a4a" }}>
      <select
        value={actual?.id ?? ""}
        onChange={(e) => {
          const c = lista.find((x) => x.id === e.target.value);
          if (c) setActual(c);
          if (router.pathname.startsWith("/dashboard")) {
            router.reload();
          }
        }}
        style={{
          width: "100%", padding: "0.4rem 0.5rem", borderRadius: "6px",
          border: "1px solid #2a2a4a", background: "#16213e", color: "white",
          fontSize: "0.8rem", cursor: "pointer", outline: "none",
        }}
      >
        {lista.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nombre}
          </option>
        ))}
      </select>
      <div style={{ fontSize: "0.7rem", color: "#667788", marginTop: "0.25rem" }}>
        {lista.length} copropiedade{lista.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
}
