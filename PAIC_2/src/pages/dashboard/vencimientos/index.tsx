import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";

export default function VencimientosPage() {
  const [items, setItems] = useState<any[]>([]);
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState<any>(null);

  useEffect(() => { fetch("/api/database/due_dates").then(r=>r.json()).then(j => setItems(j.data ?? [])); }, []);

  const refresh = async () => { const r = await fetch("/api/database/due_dates"); const j = await r.json(); setItems(j.data ?? []); };

  const handleSave = async (form: any) => {
    const method = form.id ? "PUT" : "POST";
    await fetch("/api/database/due_dates", { method, headers:{"Content-Type":"application/json"}, body: JSON.stringify(form) });
    setModal(false); setEdit(null); refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Eliminar?")) return;
    await fetch("/api/database/due_dates", { method:"DELETE", headers:{"Content-Type":"application/json"}, body: JSON.stringify({id}) });
    refresh();
  };

  const hoy = new Date();
  const vencidos = items.filter(i => i.due_date && new Date(i.due_date) < hoy && i.status !== "completed");
  const prox = items.filter(i => i.due_date && new Date(i.due_date) >= hoy && i.status !== "completed").sort((a,b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
  const completados = items.filter(i => i.status === "completed");

  return (
    <Layout>
      <div style={{maxWidth:1000,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem"}}>
          <h1 style={{margin:0,fontSize:"1.5rem",color:"#1a1a2e"}}>Vencimientos</h1>
          <button onClick={()=>{setEdit(null);setModal(true);}} style={{padding:"0.5rem 1.2rem",background:"#1a1a2e",color:"white",border:"none",borderRadius:8,cursor:"pointer",fontWeight:500}}>+ Nuevo</button>
        </div>

        <div style={{display:"flex",gap:"1rem",marginBottom:"1.5rem"}}>
          <div style={{flex:1,background:"white",borderRadius:12,padding:"1rem",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
            <div style={{fontSize:"0.8rem",color:"#888"}}>Vencidos</div>
            <div style={{fontSize:"1.5rem",fontWeight:700,color:"#e74c3c"}}>{vencidos.length}</div>
          </div>
          <div style={{flex:1,background:"white",borderRadius:12,padding:"1rem",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
            <div style={{fontSize:"0.8rem",color:"#888"}}>Proximos</div>
            <div style={{fontSize:"1.5rem",fontWeight:700,color:"#f39c12"}}>{prox.length}</div>
          </div>
          <div style={{flex:1,background:"white",borderRadius:12,padding:"1rem",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
            <div style={{fontSize:"0.8rem",color:"#888"}}>Completados</div>
            <div style={{fontSize:"1.5rem",fontWeight:700,color:"#27ae60"}}>{completados.length}</div>
          </div>
        </div>

        {vencidos.length > 0 && (
          <div style={{background:"#fff5f5",borderRadius:12,padding:"1rem",marginBottom:"1rem",border:"1px solid #fcc"}}>
            <h3 style={{margin:"0 0 0.5rem",fontSize:"0.9rem",color:"#e74c3c"}}>Vencidos</h3>
            {vencidos.map((item:any) => (
              <div key={item.id} style={{display:"flex",alignItems:"center",gap:"0.5rem",padding:"0.4rem 0",borderBottom:"1px solid #fee"}}>
                <span style={{flex:1,fontSize:"0.9rem"}}>{item.item ?? "-"}</span>
                <span style={{fontSize:"0.8rem",color:"#e74c3c",fontWeight:600}}>Vence: {new Date(item.due_date).toLocaleDateString()}</span>
                <span style={{background:"#fcc",color:"#c0392b",padding:"0.15rem 0.5rem",borderRadius:4,fontSize:"0.75rem"}}>{item.category ?? "General"}</span>
                <button onClick={()=>handleDelete(item.id)} style={{background:"none",border:"none",color:"#e74c3c",cursor:"pointer",fontSize:"0.8rem"}}>X</button>
              </div>
            ))}
          </div>
        )}

        <div style={{background:"white",borderRadius:12,boxShadow:"0 2px 8px rgba(0,0,0,0.06)",overflow:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead>
              <tr style={{borderBottom:"2px solid #f0f0f0"}}>
                <th style={{padding:"0.75rem 1rem",textAlign:"left",color:"#888",fontSize:"0.8rem",fontWeight:600}}>Item</th>
                <th style={{padding:"0.75rem 1rem",textAlign:"left",color:"#888",fontSize:"0.8rem",fontWeight:600}}>Categoria</th>
                <th style={{padding:"0.75rem 1rem",textAlign:"left",color:"#888",fontSize:"0.8rem",fontWeight:600}}>Vence</th>
                <th style={{padding:"0.75rem 1rem",textAlign:"left",color:"#888",fontSize:"0.8rem",fontWeight:600}}>Estado</th>
                <th style={{padding:"0.75rem 1rem",width:100}}></th>
              </tr>
            </thead>
            <tbody>
              {[...vencidos,...prox,...completados].map((row:any) => (
                <tr key={row.id} style={{borderBottom:"1px solid #f5f5f5",opacity:row.status==="completed"?0.5:1}}>
                  <td style={{padding:"0.75rem 1rem",fontSize:"0.9rem",textDecoration:row.status==="completed"?"line-through":"none"}}>{row.item ?? "-"}</td>
                  <td style={{padding:"0.75rem 1rem",fontSize:"0.9rem"}}><span style={{background:"#e8f4fd",color:"#2196f3",padding:"0.15rem 0.5rem",borderRadius:4,fontSize:"0.8rem"}}>{row.category ?? "General"}</span></td>
                  <td style={{padding:"0.75rem 1rem",fontSize:"0.9rem",color:row.due_date&&new Date(row.due_date)<hoy?"#e74c3c":"inherit",fontWeight:row.due_date&&new Date(row.due_date)<hoy?600:"normal"}}>{row.due_date?new Date(row.due_date).toLocaleDateString():"-"}</td>
                  <td style={{padding:"0.75rem 1rem",fontSize:"0.9rem"}}>{row.status === "completed" ? <span style={{color:"#27ae60"}}>Completado</span> : row.due_date && new Date(row.due_date) < hoy ? <span style={{color:"#e74c3c"}}>Vencido</span> : <span style={{color:"#f39c12"}}>Pendiente</span>}</td>
                  <td style={{padding:"0.75rem 1rem"}}>
                    <button onClick={()=>{setEdit(row);setModal(true);}} style={{...btnSmall,marginRight:"0.3rem"}}>Editar</button>
                    <button onClick={()=>handleDelete(row.id)} style={{...btnSmall,background:"#e74c3c"}}>Eliminar</button>
                  </td>
                </tr>
              ))}
              {items.length===0 && <tr><td colSpan={5} style={{padding:"2rem",textAlign:"center",color:"#999"}}>Sin vencimientos</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {modal && <ModalVenc edit={edit} onSave={handleSave} onClose={()=>{setModal(false);setEdit(null);}} />}
    </Layout>
  );
}

function ModalVenc({edit,onSave,onClose}:{edit?:any;onSave:(f:any)=>void;onClose:()=>void}) {
  const [form,setForm] = useState(edit ?? {});
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}}>
      <div style={{background:"white",borderRadius:16,padding:"2rem",width:"90%",maxWidth:500}}>
        <h2 style={{margin:"0 0 1.5rem",fontSize:"1.2rem",color:"#1a1a2e"}}>{edit?"Editar":"Nuevo"} Vencimiento</h2>
        {[{key:"item",label:"Item"},{key:"category",label:"Categoria"},{key:"due_date",label:"Fecha de vencimiento",type:"date"},{key:"status",label:"Estado"}].map(c => (
          <div key={c.key} style={{marginBottom:"1rem"}}>
            <label style={{display:"block",marginBottom:"0.3rem",fontSize:"0.85rem",color:"#555"}}>{c.label}</label>
            <input value={form[c.key]??""} type={c.type??"text"} onChange={e=>setForm({...form,[c.key]:e.target.value})} style={{width:"100%",padding:"0.6rem 0.8rem",border:"1px solid #ddd",borderRadius:8,fontSize:"0.9rem"}} />
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
