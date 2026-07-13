import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";

const ESTADOS = ["draft", "publicado", "archivado"] as const;

export default function CarteleraPage() {
  const [items, setItems] = useState<any[]>([]);
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState<any>(null);

  useEffect(() => { fetch("/api/database/carteleria").then(r=>r.json()).then(j => setItems(j.data ?? [])); }, []);

  const refresh = async () => { const r = await fetch("/api/database/carteleria"); const j = await r.json(); setItems(j.data ?? []); };

  const handleSave = async (form: any) => {
    const method = form.id ? "PUT" : "POST";
    await fetch("/api/database/carteleria", { method, headers:{"Content-Type":"application/json"}, body: JSON.stringify(form) });
    setModal(false); setEdit(null); refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Eliminar contenido?")) return;
    await fetch("/api/database/carteleria", { method:"DELETE", headers:{"Content-Type":"application/json"}, body: JSON.stringify({id}) });
    refresh();
  };

  const publicados = items.filter(i => i.estado === "publicado").length;

  return (
    <Layout>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem"}}>
          <h1 style={{margin:0,fontSize:"1.5rem",color:"#1a1a2e"}}>Cartelera Digital</h1>
          <button onClick={()=>{setEdit(null);setModal(true);}} style={{padding:"0.5rem 1.2rem",background:"#1a1a2e",color:"white",border:"none",borderRadius:8,cursor:"pointer",fontWeight:500}}>+ Contenido</button>
        </div>

        <div style={{display:"flex",gap:"1rem",marginBottom:"1.5rem"}}>
          <div style={{flex:1,background:"white",borderRadius:12,padding:"1rem",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
            <div style={{fontSize:"0.8rem",color:"#888"}}>Total Contenidos</div>
            <div style={{fontSize:"1.5rem",fontWeight:700,color:"#1a1a2e"}}>{items.length}</div>
          </div>
          <div style={{flex:1,background:"white",borderRadius:12,padding:"1rem",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
            <div style={{fontSize:"0.8rem",color:"#888"}}>Publicados</div>
            <div style={{fontSize:"1.5rem",fontWeight:700,color:"#27ae60"}}>{publicados}</div>
          </div>
          <div style={{flex:1,background:"white",borderRadius:12,padding:"1rem",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
            <div style={{fontSize:"0.8rem",color:"#888"}}>Borradores</div>
            <div style={{fontSize:"1.5rem",fontWeight:700,color:"#f39c12"}}>{items.filter(i=>i.estado==="draft"||!i.estado).length}</div>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:"1rem"}}>
          {items.map((c:any) => (
            <div key={c.id} style={{background:"white",borderRadius:12,boxShadow:"0 2px 8px rgba(0,0,0,0.06)",overflow:"hidden"}}>
              <div style={{padding:"1rem"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"0.5rem"}}>
                  <h3 style={{margin:0,fontSize:"1rem",color:"#1a1a2e"}}>{c.titulo}</h3>
                  <span style={{fontSize:"0.7rem",padding:"0.15rem 0.5rem",borderRadius:4,background:c.estado==="publicado"?"#e8f5e9":c.estado==="archivado"?"#f5f5f5":"#fff3e0",color:c.estado==="publicado"?"#27ae60":c.estado==="archivado"?"#999":"#f39c12"}}>{c.estado ?? "draft"}</span>
                </div>
                <p style={{fontSize:"0.85rem",color:"#666",margin:"0 0 0.5rem",lineHeight:1.4}}>{c.contenido?.slice(0,120)}</p>
                <div style={{fontSize:"0.75rem",color:"#999"}}>
                  Tipo: {c.tipo ?? "texto"} | Prioridad: {c.prioridad ?? 0}
                </div>
                <div style={{display:"flex",gap:"0.3rem",marginTop:"0.75rem"}}>
                  <button onClick={()=>{setEdit(c);setModal(true);}} style={{...btnSmall}}>Editar</button>
                  <button onClick={()=>handleDelete(c.id)} style={{...btnSmall,background:"#e74c3c"}}>Eliminar</button>
                </div>
              </div>
            </div>
          ))}
          {items.length===0 && <div style={{gridColumn:"1/-1",padding:"2rem",textAlign:"center",color:"#999"}}>No hay contenidos en la cartelera</div>}
        </div>
      </div>

      {modal && <ModalCartel edit={edit} onSave={handleSave} onClose={()=>{setModal(false);setEdit(null);}} />}
    </Layout>
  );
}

function ModalCartel({edit,onSave,onClose}:{edit?:any;onSave:(f:any)=>void;onClose:()=>void}) {
  const [form,setForm] = useState(edit ?? {});
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}}>
      <div style={{background:"white",borderRadius:16,padding:"2rem",width:"90%",maxWidth:500}}>
        <h2 style={{margin:"0 0 1.5rem",fontSize:"1.2rem",color:"#1a1a2e"}}>{edit?"Editar":"Nuevo"} Contenido</h2>
        <div style={{marginBottom:"1rem"}}>
          <label style={{display:"block",marginBottom:"0.3rem",fontSize:"0.85rem",color:"#555"}}>Titulo</label>
          <input value={form.titulo??""} onChange={e=>setForm({...form,titulo:e.target.value})} style={{width:"100%",padding:"0.6rem 0.8rem",border:"1px solid #ddd",borderRadius:8,fontSize:"0.9rem"}} />
        </div>
        <div style={{marginBottom:"1rem"}}>
          <label style={{display:"block",marginBottom:"0.3rem",fontSize:"0.85rem",color:"#555"}}>Contenido</label>
          <textarea value={form.contenido??""} rows={4} onChange={e=>setForm({...form,contenido:e.target.value})} style={{width:"100%",padding:"0.6rem 0.8rem",border:"1px solid #ddd",borderRadius:8,fontSize:"0.9rem",resize:"vertical"}} />
        </div>
        <div style={{marginBottom:"1rem"}}>
          <label style={{display:"block",marginBottom:"0.3rem",fontSize:"0.85rem",color:"#555"}}>Tipo</label>
          <select value={form.tipo??"texto"} onChange={e=>setForm({...form,tipo:e.target.value})} style={{width:"100%",padding:"0.6rem 0.8rem",border:"1px solid #ddd",borderRadius:8,fontSize:"0.9rem"}}>
            <option value="texto">Texto</option>
            <option value="imagen">Imagen</option>
            <option value="video">Video</option>
          </select>
        </div>
        <div style={{marginBottom:"1rem"}}>
          <label style={{display:"block",marginBottom:"0.3rem",fontSize:"0.85rem",color:"#555"}}>Estado</label>
          <select value={form.estado??"draft"} onChange={e=>setForm({...form,estado:e.target.value})} style={{width:"100%",padding:"0.6rem 0.8rem",border:"1px solid #ddd",borderRadius:8,fontSize:"0.9rem"}}>
            {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
        <div style={{marginBottom:"1rem"}}>
          <label style={{display:"block",marginBottom:"0.3rem",fontSize:"0.85rem",color:"#555"}}>Prioridad</label>
          <input value={form.prioridad??0} type="number" onChange={e=>setForm({...form,prioridad:Number(e.target.value)})} style={{width:"100%",padding:"0.6rem 0.8rem",border:"1px solid #ddd",borderRadius:8,fontSize:"0.9rem"}} />
        </div>
        <div style={{display:"flex",gap:"0.5rem",justifyContent:"flex-end",marginTop:"1.5rem"}}>
          <button onClick={onClose} style={{padding:"0.6rem 1.2rem",background:"#f0f0f0",color:"#333",border:"none",borderRadius:8,cursor:"pointer"}}>Cancelar</button>
          <button onClick={()=>onSave(form)} style={{padding:"0.6rem 1.2rem",background:"#1a1a2e",color:"white",border:"none",borderRadius:8,cursor:"pointer",fontWeight:500}}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

const btnSmall: React.CSSProperties = { padding:"0.3rem 0.6rem",background:"#4fc3f7",color:"white",border:"none",borderRadius:4,cursor:"pointer",fontSize:"0.75rem" };
