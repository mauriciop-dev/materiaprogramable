import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";

export default function FinanzasPage() {
  const [tab, setTab] = useState<"ingresos" | "gastos">("ingresos");
  const [items, setItems] = useState<any[]>([]);
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState<any>(null);

  useEffect(() => { fetch(`/api/database/${tab}`).then(r=>r.json()).then(j => setItems(j.data ?? [])); }, [tab]);

  const handleSave = async (form: any) => {
    const method = form.id ? "PUT" : "POST";
    await fetch(`/api/database/${tab}`, { method, headers:{"Content-Type":"application/json"}, body: JSON.stringify(form) });
    setModal(false); setEdit(null);
    const r = await fetch(`/api/database/${tab}`); const j = await r.json(); setItems(j.data ?? []);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Eliminar?")) return;
    await fetch(`/api/database/${tab}`, { method:"DELETE", headers:{"Content-Type":"application/json"}, body: JSON.stringify({id}) });
    const r = await fetch(`/api/database/${tab}`); const j = await r.json(); setItems(j.data ?? []);
  };

  const total = items.reduce((s,i) => s + Number(i.amount ?? 0), 0);

  return (
    <Layout>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <h1 style={{margin:"0 0 1rem",fontSize:"1.5rem",color:"#1a1a2e"}}>Finanzas</h1>

        <div style={{display:"flex",gap:"1rem",marginBottom:"1rem"}}>
          <div style={{flex:1,background:"white",borderRadius:12,padding:"1rem",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
            <div style={{fontSize:"0.8rem",color:"#888"}}>Total Ingresos</div>
            <div style={{fontSize:"1.5rem",fontWeight:700,color:"#27ae60"}}>${items.filter(i=>tab==="ingresos").reduce((s,i)=>s+Number(i.amount??0),0).toLocaleString()}</div>
          </div>
          <div style={{flex:1,background:"white",borderRadius:12,padding:"1rem",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
            <div style={{fontSize:"0.8rem",color:"#888"}}>Total Gastos</div>
            <div style={{fontSize:"1.5rem",fontWeight:700,color:"#e74c3c"}}>${items.filter(i=>tab==="gastos").reduce((s,i)=>s+Number(i.amount??0),0).toLocaleString()}</div>
          </div>
          <div style={{flex:1,background:"white",borderRadius:12,padding:"1rem",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
            <div style={{fontSize:"0.8rem",color:"#888"}}>Balance</div>
            <div style={{fontSize:"1.5rem",fontWeight:700,color:"#2c3e50"}}>${(items.filter(i=>tab==="ingresos").reduce((s,i)=>s+Number(i.amount??0),0) - items.filter(i=>tab==="gastos").reduce((s,i)=>s+Number(i.amount??0),0)).toLocaleString()}</div>
          </div>
        </div>

        <div style={{display:"flex",gap:"0.5rem",marginBottom:"1rem",borderBottom:"2px solid #e0e0e0",paddingBottom:"0.5rem"}}>
          {(["ingresos","gastos"] as const).map(t => (
            <button key={t} onClick={()=>setTab(t)} style={{
              padding:"0.5rem 1.2rem",border:"none",cursor:"pointer",
              background: tab===t ? "#1a1a2e" : "transparent",
              color: tab===t ? "white" : "#666", borderRadius:6, fontWeight:500,
            }}>{t==="ingresos"?"Ingresos":"Gastos"}</button>
          ))}
          <div style={{flex:1}} />
          <button onClick={()=>{setEdit(null);setModal(true);}} style={{
            padding:"0.5rem 1.2rem",background:"#1a1a2e",color:"white",border:"none",borderRadius:8,cursor:"pointer",fontWeight:500,
          }}>+ Nuevo</button>
        </div>

        <div style={{background:"white",borderRadius:12,boxShadow:"0 2px 8px rgba(0,0,0,0.06)",overflow:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead>
              <tr style={{borderBottom:"2px solid #f0f0f0"}}>
                <th style={{padding:"0.75rem 1rem",textAlign:"left",color:"#888",fontSize:"0.8rem",fontWeight:600}}>Descripcion</th>
                <th style={{padding:"0.75rem 1rem",textAlign:"left",color:"#888",fontSize:"0.8rem",fontWeight:600}}>Categoria</th>
                <th style={{padding:"0.75rem 1rem",textAlign:"right",color:"#888",fontSize:"0.8rem",fontWeight:600}}>Monto</th>
                <th style={{padding:"0.75rem 1rem",textAlign:"left",color:"#888",fontSize:"0.8rem",fontWeight:600}}>Fecha</th>
                <th style={{padding:"0.75rem 1rem",width:100}}></th>
              </tr>
            </thead>
            <tbody>
              {items.map((row:any) => (
                <tr key={row.id} style={{borderBottom:"1px solid #f5f5f5"}}>
                  <td style={{padding:"0.75rem 1rem",fontSize:"0.9rem"}}>{row.description ?? "-"}</td>
                  <td style={{padding:"0.75rem 1rem",fontSize:"0.9rem"}}>
                    <span style={{background:"#e8f4fd",color:"#2196f3",padding:"0.15rem 0.5rem",borderRadius:4,fontSize:"0.8rem"}}>{row.category ?? "General"}</span>
                  </td>
                  <td style={{padding:"0.75rem 1rem",fontSize:"0.9rem",textAlign:"right",fontWeight:600,color:tab==="gastos"?"#e74c3c":"#27ae60"}}>${Number(row.amount??0).toLocaleString()}</td>
                  <td style={{padding:"0.75rem 1rem",fontSize:"0.9rem"}}>{row.date ? new Date(row.date).toLocaleDateString() : "-"}</td>
                  <td style={{padding:"0.75rem 1rem"}}>
                    <button onClick={()=>{setEdit(row);setModal(true);}} style={{...btnSmall,marginRight:"0.3rem"}}>Editar</button>
                    <button onClick={()=>handleDelete(row.id)} style={{...btnSmall,background:"#e74c3c"}}>Eliminar</button>
                  </td>
                </tr>
              ))}
              {items.length===0 && <tr><td colSpan={5} style={{padding:"2rem",textAlign:"center",color:"#999"}}>Sin registros</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {modal && <ModalFinanzas tab={tab} edit={edit} onSave={handleSave} onClose={()=>{setModal(false);setEdit(null);}} />}
    </Layout>
  );
}

function ModalFinanzas({tab,edit,onSave,onClose}:{tab:string;edit?:any;onSave:(f:any)=>void;onClose:()=>void}) {
  const [form,setForm] = useState(edit ?? {});
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}}>
      <div style={{background:"white",borderRadius:16,padding:"2rem",width:"90%",maxWidth:500}}>
        <h2 style={{margin:"0 0 1.5rem",fontSize:"1.2rem",color:"#1a1a2e"}}>{edit?"Editar":"Nuevo"} {tab==="ingresos"?"Ingreso":"Gasto"}</h2>
        {[{key:"description",label:"Descripcion"},{key:"category",label:"Categoria"},{key:"amount",label:"Monto",type:"number"},{key:"date",label:"Fecha",type:"date"}].map(c => (
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
