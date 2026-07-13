import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";

export default function ComunicacionesPage() {
  const [mensajes, setMensajes] = useState<any[]>([]);
  const [texto, setTexto] = useState("");
  const [titulo, setTitulo] = useState("");

  useEffect(() => { fetch("/api/database/carteleria?estado=publicado").then(r=>r.json()).then(j => setMensajes(j.data?.filter((c:any)=>c.estado==="publicado") ?? [])); }, []);

  return (
    <Layout>
      <div style={{maxWidth:800,margin:"0 auto"}}>
        <h1 style={{margin:"0 0 1rem",fontSize:"1.5rem",color:"#1a1a2e"}}>Comunicaciones</h1>
        <p style={{margin:"0 0 1.5rem",color:"#888",fontSize:"0.85rem"}}>Contenidos publicados visibles para los residentes.</p>

        <div style={{display:"flex",gap:"1rem",marginBottom:"1rem"}}>
          <div style={{flex:1,background:"white",borderRadius:12,padding:"1rem",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
            <div style={{fontSize:"0.8rem",color:"#888"}}>Comunicados activos</div>
            <div style={{fontSize:"1.5rem",fontWeight:700,color:"#2196f3"}}>{mensajes.length}</div>
          </div>
          <div style={{flex:1,background:"white",borderRadius:12,padding:"1rem",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
            <div style={{fontSize:"0.8rem",color:"#888"}}>Ultima actualizacion</div>
            <div style={{fontSize:"0.9rem",fontWeight:600,color:"#1a1a2e"}}>{mensajes.length > 0 ? new Date(mensajes[0]?.updated_at ?? mensajes[0]?.created_at).toLocaleDateString() : "-"}</div>
          </div>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:"0.75rem"}}>
          {mensajes.map((m:any) => (
            <div key={m.id} style={{background:"white",borderRadius:12,boxShadow:"0 2px 8px rgba(0,0,0,0.06)",padding:"1rem 1.2rem",borderLeft:"4px solid #4fc3f7"}}>
              <h3 style={{margin:"0 0 0.3rem",fontSize:"1rem",color:"#1a1a2e"}}>{m.titulo}</h3>
              <p style={{margin:0,fontSize:"0.85rem",color:"#555",lineHeight:1.5}}>{m.contenido}</p>
              <div style={{marginTop:"0.5rem",fontSize:"0.75rem",color:"#999"}}>
                {new Date(m.created_at).toLocaleDateString()} | Tipo: {m.tipo ?? "texto"}
              </div>
            </div>
          ))}
          {mensajes.length===0 && (
            <div style={{padding:"2rem",textAlign:"center",color:"#999"}}>
              No hay comunicados publicados. Cree contenido en Cartelera Digital y publiquelo para que aparezca aqui.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
