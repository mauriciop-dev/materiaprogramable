import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";

export default function TareasPage() {
  const [items, setItems] = useState<any[]>([]);
  const [text, setText] = useState("");

  useEffect(() => { fetch("/api/database/tasks").then(r=>r.json()).then(j => setItems(j.data ?? [])); }, []);

  const refresh = async () => {
    const r = await fetch("/api/database/tasks"); const j = await r.json(); setItems(j.data ?? []);
  };

  const addTask = async () => {
    if (!text.trim()) return;
    await fetch("/api/database/tasks", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ text: text.trim() }) });
    setText(""); refresh();
  };

  const toggle = async (item: any) => {
    await fetch("/api/database/tasks", { method:"PUT", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ id: item.id, completed: !item.completed }) });
    refresh();
  };

  const del = async (id: string) => {
    if (!confirm("Eliminar tarea?")) return;
    await fetch("/api/database/tasks", { method:"DELETE", headers:{"Content-Type":"application/json"}, body: JSON.stringify({id}) });
    refresh();
  };

  const pending = items.filter(i => !i.completed);
  const done = items.filter(i => i.completed);

  return (
    <Layout>
      <div style={{maxWidth:800,margin:"0 auto"}}>
        <h1 style={{margin:"0 0 1rem",fontSize:"1.5rem",color:"#1a1a2e"}}>Tareas</h1>

        <div style={{display:"flex",gap:"0.5rem",marginBottom:"1.5rem"}}>
          <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addTask()}
            placeholder="Nueva tarea..." style={{flex:1,padding:"0.7rem 1rem",border:"1px solid #ddd",borderRadius:8,fontSize:"0.9rem"}} />
          <button onClick={addTask} style={{padding:"0.7rem 1.2rem",background:"#1a1a2e",color:"white",border:"none",borderRadius:8,cursor:"pointer",fontWeight:500}}>Agregar</button>
        </div>

        <div style={{display:"flex",gap:"1rem",marginBottom:"1rem",fontSize:"0.85rem",color:"#888"}}>
          <span>Pendientes: <strong style={{color:"#e74c3c"}}>{pending.length}</strong></span>
          <span>Completadas: <strong style={{color:"#27ae60"}}>{done.length}</strong></span>
        </div>

        <div style={{background:"white",borderRadius:12,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
          {pending.map(item => (
            <div key={item.id} style={{display:"flex",alignItems:"center",gap:"0.75rem",padding:"0.75rem 1rem",borderBottom:"1px solid #f5f5f5"}}>
              <input type="checkbox" checked={false} onChange={()=>toggle(item)} style={{width:18,height:18,cursor:"pointer"}} />
              <span style={{flex:1,fontSize:"0.9rem"}}>{item.text}</span>
              {item.due_date && <span style={{fontSize:"0.75rem",color:"#999"}}>{new Date(item.due_date).toLocaleDateString()}</span>}
              <button onClick={()=>del(item.id)} style={{background:"none",border:"none",color:"#e74c3c",cursor:"pointer",fontSize:"0.8rem"}}>Eliminar</button>
            </div>
          ))}
          {pending.length===0 && <div style={{padding:"1.5rem",textAlign:"center",color:"#999"}}>No hay tareas pendientes</div>}
        </div>

        {done.length > 0 && (
          <>
            <h3 style={{margin:"1.5rem 0 0.5rem",fontSize:"1rem",color:"#888"}}>Completadas ({done.length})</h3>
            <div style={{background:"white",borderRadius:12,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
              {done.map(item => (
                <div key={item.id} style={{display:"flex",alignItems:"center",gap:"0.75rem",padding:"0.75rem 1rem",borderBottom:"1px solid #f5f5f5",opacity:0.6}}>
                  <input type="checkbox" checked onChange={()=>toggle(item)} style={{width:18,height:18,cursor:"pointer"}} />
                  <span style={{flex:1,fontSize:"0.9rem",textDecoration:"line-through"}}>{item.text}</span>
                  <button onClick={()=>del(item.id)} style={{background:"none",border:"none",color:"#e74c3c",cursor:"pointer",fontSize:"0.8rem"}}>Eliminar</button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
