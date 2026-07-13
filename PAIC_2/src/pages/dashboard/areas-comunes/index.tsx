import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";

export default function AreasComunesPage() {
  const [tab, setTab] = useState<"areas" | "reservas">("areas");
  const [items, setItems] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState<any>(null);

  const recurso = tab === "areas" ? "common_areas" : "reservations";

  useEffect(() => {
    fetch(`/api/database/${recurso}`).then(r=>r.json()).then(j => setItems(j.data ?? []));
    if (tab === "reservas") fetch("/api/database/common_areas").then(r=>r.json()).then(j => setAreas(j.data ?? []));
  }, [tab]);

  const handleSave = async (form: any) => {
    const method = form.id ? "PUT" : "POST";
    await fetch(`/api/database/${recurso}`, { method, headers:{"Content-Type":"application/json"}, body: JSON.stringify(form) });
    setModal(false); setEdit(null);
    const r = await fetch(`/api/database/${recurso}`); const j = await r.json(); setItems(j.data ?? []);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Eliminar?")) return;
    await fetch(`/api/database/${recurso}`, { method:"DELETE", headers:{"Content-Type":"application/json"}, body: JSON.stringify({id}) });
    const r = await fetch(`/api/database/${recurso}`); const j = await r.json(); setItems(j.data ?? []);
  };

  return (
    <Layout>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem"}}>
          <h1 style={{margin:0,fontSize:"1.5rem",color:"#1a1a2e"}}>Areas Comunes</h1>
          <button onClick={()=>{setEdit(null);setModal(true);}} style={{padding:"0.5rem 1.2rem",background:"#1a1a2e",color:"white",border:"none",borderRadius:8,cursor:"pointer",fontWeight:500}}>+ {tab==="areas"?"Area":"Reserva"}</button>
        </div>

        <div style={{display:"flex",gap:"0.5rem",marginBottom:"1rem",borderBottom:"2px solid #e0e0e0",paddingBottom:"0.5rem"}}>
          {[{k:"areas",l:"Areas"},{k:"reservas",l:"Reservas"}].map(t => (
            <button key={t.k} onClick={()=>setTab(t.k as any)} style={{padding:"0.5rem 1.2rem",border:"none",cursor:"pointer",background:tab===t.k?"#1a1a2e":"transparent",color:tab===t.k?"white":"#666",borderRadius:6,fontWeight:500}}>{t.l}</button>
          ))}
        </div>

        <div style={{display:"flex",gap:"1rem",marginBottom:"1rem",flexWrap:"wrap"}}>
          {tab==="areas" && items.length===0 && <div style={{width:"100%",padding:"2rem",background:"white",borderRadius:12,boxShadow:"0 2px 8px rgba(0,0,0,0.06)",textAlign:"center",color:"#999"}}>No hay areas creadas. Cree una area comun para empezar.</div>}
          {tab==="areas" && items.map((a:any) => (
            <div key={a.id} style={{flex:"0 0 200px",background:"white",borderRadius:12,padding:"1rem",boxShadow:"0 2px 8px rgba(0,0,0,0.06)",borderLeft:`4px solid ${a.color?.border ?? "#4fc3f7"}`}}>
              <div style={{fontSize:"0.9rem",fontWeight:600,marginBottom:"0.3rem"}}>{a.name}</div>
              <div style={{display:"flex",gap:"0.3rem",marginTop:"0.5rem"}}>
                <button onClick={()=>{setEdit(a);setModal(true);}} style={{fontSize:"0.75rem",padding:"0.2rem 0.5rem",background:"#4fc3f7",color:"white",border:"none",borderRadius:4,cursor:"pointer"}}>Editar</button>
                <button onClick={()=>handleDelete(a.id)} style={{fontSize:"0.75rem",padding:"0.2rem 0.5rem",background:"#e74c3c",color:"white",border:"none",borderRadius:4,cursor:"pointer"}}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>

        {tab==="reservas" && (
          <div style={{background:"white",borderRadius:12,boxShadow:"0 2px 8px rgba(0,0,0,0.06)",overflow:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr style={{borderBottom:"2px solid #f0f0f0"}}>
                <th style={{padding:"0.75rem 1rem",textAlign:"left",color:"#888",fontSize:"0.8rem",fontWeight:600}}>Residente</th>
                <th style={{padding:"0.75rem 1rem",textAlign:"left",color:"#888",fontSize:"0.8rem",fontWeight:600}}>Apartamento</th>
                <th style={{padding:"0.75rem 1rem",textAlign:"left",color:"#888",fontSize:"0.8rem",fontWeight:600}}>Area</th>
                <th style={{padding:"0.75rem 1rem",textAlign:"left",color:"#888",fontSize:"0.8rem",fontWeight:600}}>Fecha</th>
                <th style={{padding:"0.75rem 1rem",textAlign:"left",color:"#888",fontSize:"0.8rem",fontWeight:600}}>Hora</th>
                <th style={{padding:"0.75rem 1rem",width:100}}></th>
              </tr></thead>
              <tbody>
                {items.map((row:any) => {
                  const area = areas.find(a=>a.id===row.common_area_id);
                  return (<tr key={row.id} style={{borderBottom:"1px solid #f5f5f5"}}>
                    <td style={{padding:"0.75rem 1rem",fontSize:"0.9rem"}}>{row.resident_name ?? "-"}</td>
                    <td style={{padding:"0.75rem 1rem",fontSize:"0.9rem"}}>{row.apartment ?? "-"}</td>
                    <td style={{padding:"0.75rem 1rem",fontSize:"0.9rem"}}>{area?.name ?? "-"}</td>
                    <td style={{padding:"0.75rem 1rem",fontSize:"0.9rem"}}>{row.date?new Date(row.date).toLocaleDateString():"-"}</td>
                    <td style={{padding:"0.75rem 1rem",fontSize:"0.9rem"}}>{row.start_time?.slice(0,5)??"-"} - {row.end_time?.slice(0,5)??"-"}</td>
                    <td style={{padding:"0.75rem 1rem"}}>
                      <button onClick={()=>{setEdit(row);setModal(true);}} style={{...btnSmall,marginRight:"0.3rem"}}>Editar</button>
                      <button onClick={()=>handleDelete(row.id)} style={{...btnSmall,background:"#e74c3c"}}>Eliminar</button>
                    </td>
                  </tr>);
                })}
                {items.length===0 && <tr><td colSpan={6} style={{padding:"2rem",textAlign:"center",color:"#999"}}>Sin reservas</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && <ModalAreas tab={tab} edit={edit} areas={areas} onSave={handleSave} onClose={()=>{setModal(false);setEdit(null);}} />}
    </Layout>
  );
}

function ModalAreas({tab,edit,areas,onSave,onClose}:{tab:"areas"|"reservas";edit?:any;areas:any[];onSave:(f:any)=>void;onClose:()=>void}) {
  const [form,setForm] = useState(edit ?? {});
  const campos = tab==="areas"
    ? [{key:"name",label:"Nombre"}]
    : [{key:"resident_name",label:"Residente"},{key:"apartment",label:"Apartamento"},{key:"common_area_id",label:"Area"},{key:"date",label:"Fecha",type:"date"},{key:"start_time",label:"Hora inicio",type:"time"},{key:"end_time",label:"Hora fin",type:"time"},{key:"email",label:"Email"},{key:"phone",label:"Telefono"}];
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}}>
      <div style={{background:"white",borderRadius:16,padding:"2rem",width:"90%",maxWidth:500}}>
        <h2 style={{margin:"0 0 1.5rem",fontSize:"1.2rem",color:"#1a1a2e"}}>{edit?"Editar":"Nuevo"} {tab==="areas"?"Area":"Reserva"}</h2>
        {campos.map(c => (
          <div key={c.key} style={{marginBottom:"1rem"}}>
            <label style={{display:"block",marginBottom:"0.3rem",fontSize:"0.85rem",color:"#555"}}>{c.label}</label>
            {c.key === "common_area_id" ? (
              <select value={form[c.key]??""} onChange={e=>setForm({...form,[c.key]:e.target.value})} style={{width:"100%",padding:"0.6rem 0.8rem",border:"1px solid #ddd",borderRadius:8,fontSize:"0.9rem"}}>
                <option value="">Seleccionar</option>
                {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
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
