import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";

export default function CamarasPage() {
  const [items, setItems] = useState<any[]>([]);
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState<any>(null);

  useEffect(() => { fetch("/api/database/camaras").then(r=>r.json()).then(j => setItems(j.data ?? [])); }, []);

  const refresh = async () => { const r = await fetch("/api/database/camaras"); const j = await r.json(); setItems(j.data ?? []); };

  const handleSave = async (form: any) => {
    const method = form.id ? "PUT" : "POST";
    await fetch("/api/database/camaras", { method, headers:{"Content-Type":"application/json"}, body: JSON.stringify(form) });
    setModal(false); setEdit(null); refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Eliminar camara?")) return;
    await fetch("/api/database/camaras", { method:"DELETE", headers:{"Content-Type":"application/json"}, body: JSON.stringify({id}) });
    refresh();
  };

  const activas = items.filter(i => i.activa !== false).length;

  return (
    <Layout>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem"}}>
          <h1 style={{margin:0,fontSize:"1.5rem",color:"#1a1a2e"}}>Camaras</h1>
          <button onClick={()=>{setEdit(null);setModal(true);}} style={{padding:"0.5rem 1.2rem",background:"#1a1a2e",color:"white",border:"none",borderRadius:8,cursor:"pointer",fontWeight:500}}>+ Camara</button>
        </div>

        <div style={{display:"flex",gap:"1rem",marginBottom:"1.5rem"}}>
          <div style={{flex:1,background:"white",borderRadius:12,padding:"1rem",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
            <div style={{fontSize:"0.8rem",color:"#888"}}>Total</div>
            <div style={{fontSize:"1.5rem",fontWeight:700,color:"#1a1a2e"}}>{items.length}</div>
          </div>
          <div style={{flex:1,background:"white",borderRadius:12,padding:"1rem",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
            <div style={{fontSize:"0.8rem",color:"#888"}}>Activas</div>
            <div style={{fontSize:"1.5rem",fontWeight:700,color:"#27ae60"}}>{activas}</div>
          </div>
          <div style={{flex:1,background:"white",borderRadius:12,padding:"1rem",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
            <div style={{fontSize:"0.8rem",color:"#888"}}>Inactivas</div>
            <div style={{fontSize:"1.5rem",fontWeight:700,color:"#e74c3c"}}>{items.length - activas}</div>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:"1rem"}}>
          {items.map((cam:any) => (
            <div key={cam.id} style={{background:"white",borderRadius:12,boxShadow:"0 2px 8px rgba(0,0,0,0.06)",overflow:"hidden"}}>
              <div style={{background:"#1a1a2e",color:"white",padding:"0.5rem 1rem",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontWeight:500,fontSize:"0.9rem"}}>{cam.nombre}</span>
                <span style={{fontSize:"0.7rem",padding:"0.15rem 0.5rem",borderRadius:4,background:cam.activa!==false?"#27ae60":"#e74c3c"}}>{cam.activa!==false?"Activa":"Inactiva"}</span>
              </div>
              <div style={{padding:"1rem"}}>
                <div style={{fontSize:"0.85rem",color:"#666",marginBottom:"0.3rem"}}>Ubicacion: {cam.ubicacion ?? "-"}</div>
                <div style={{fontSize:"0.85rem",color:"#666",marginBottom:"0.3rem"}}>Modelo: {cam.modelo ?? "-"}</div>
                <div style={{fontSize:"0.85rem",color:"#666",marginBottom:"0.3rem"}}>Resolucion: {cam.resolucion ?? "1920x1080"}</div>
                <div style={{fontSize:"0.85rem",color:"#666",marginBottom:"1rem"}}>RTSP: <code style={{fontSize:"0.75rem",wordBreak:"break-all"}}>{cam.rtsp_url?.slice(0,40)}...</code></div>
                <div style={{display:"flex",gap:"0.3rem"}}>
                  <button onClick={()=>{setEdit(cam);setModal(true);}} style={{...btnSmall,marginRight:"0.3rem"}}>Editar</button>
                  <button onClick={()=>handleDelete(cam.id)} style={{...btnSmall,background:"#e74c3c"}}>Eliminar</button>
                </div>
              </div>
            </div>
          ))}
          {items.length===0 && <div style={{gridColumn:"1/-1",padding:"2rem",textAlign:"center",color:"#999"}}>No hay camaras registradas</div>}
        </div>
      </div>

      {modal && <ModalCam edit={edit} onSave={handleSave} onClose={()=>{setModal(false);setEdit(null);}} />}
    </Layout>
  );
}

function ModalCam({edit,onSave,onClose}:{edit?:any;onSave:(f:any)=>void;onClose:()=>void}) {
  const [form,setForm] = useState(edit ?? {});
  const campos = [
    {key:"nombre",label:"Nombre"},{key:"ubicacion",label:"Ubicacion"},{key:"modelo",label:"Modelo"},{key:"rtsp_url",label:"URL RTSP"},{key:"resolucion",label:"Resolucion"},{key:"fps",label:"FPS",type:"number"},{key:"activa",label:"Activa",type:"checkbox"},
  ];
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}}>
      <div style={{background:"white",borderRadius:16,padding:"2rem",width:"90%",maxWidth:500}}>
        <h2 style={{margin:"0 0 1.5rem",fontSize:"1.2rem",color:"#1a1a2e"}}>{edit?"Editar":"Nueva"} Camara</h2>
        {campos.map(c => (
          <div key={c.key} style={{marginBottom:"1rem"}}>
            <label style={{display:"block",marginBottom:"0.3rem",fontSize:"0.85rem",color:"#555"}}>{c.label}</label>
            {c.type === "checkbox" ? (
              <input type="checkbox" checked={form[c.key]!==false} onChange={e=>setForm({...form,[c.key]:e.target.checked})} />
            ) : (
              <input value={form[c.key]??""} type={c.type??"text"} onChange={e=>setForm({...form,[c.key]:e.target.value})} style={{width:"100%",padding:"0.6rem 0.8rem",border:"1px solid #ddd",borderRadius:8,fontSize:"0.9rem"}} />
            )}
          </div>
        ))}
        <div style={{display:"flex",gap:"0.5rem",justifyContent:"flex-end",marginTop:"1.5rem"}}>
          <button onClick={onClose} style={{padding:"0.6rem 1.2rem",background:"#f0f0f0",color:"#333",border:"none",borderRadius:8,cursor:"pointer"}}>Cancelar</button>
          <button onClick={()=>onSave(form)} style={{padding:"0.6rem 1.2rem",background:"#1a1a2e",color:"white",border:"none",borderRadius:8,cursor:"pointer",fontWeight:500}}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

const btnSmall: React.CSSProperties = { padding:"0.3rem 0.6rem",background:"#4fc3f7",color:"white",border:"none",borderRadius:4,cursor:"pointer",fontSize:"0.75rem" };
