import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";

export default function ArchivosPage() {
  const [items, setItems] = useState<{name:string;size:number;updated_at:string}[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("https://6vgumkqu.us-east.insforge.app/api/storage/buckets/conjunto-files/objects/list")
      .then(r => r.json()).then(d => setItems(Array.isArray(d) ? d : d?.data ?? [])).catch(() => {});
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    try {
      await fetch("https://6vgumkqu.us-east.insforge.app/api/storage/upload/conjunto-files/" + file.name, {
        method: "POST", body: file,
      });
      const r = await fetch("https://6vgumkqu.us-east.insforge.app/api/storage/buckets/conjunto-files/objects/list");
      const d = await r.json(); setItems(Array.isArray(d) ? d : d?.data ?? []);
    } catch {}
    setUploading(false);
  };

  const handleDelete = async (name: string) => {
    if (!confirm("Eliminar archivo?")) return;
    await fetch("https://6vgumkqu.us-east.insforge.app/api/storage/buckets/conjunto-files/objects/" + encodeURIComponent(name), {
      method: "DELETE",
    });
    setItems(prev => prev.filter(i => i.name !== name));
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024*1024) return (bytes/1024).toFixed(1) + " KB";
    return (bytes/(1024*1024)).toFixed(1) + " MB";
  };

  return (
    <Layout>
      <div style={{maxWidth:1000,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.5rem"}}>
          <h1 style={{margin:0,fontSize:"1.5rem",color:"#1a1a2e"}}>Archivos</h1>
          <label style={{padding:"0.5rem 1.2rem",background:uploading?"#999":"#1a1a2e",color:"white",borderRadius:8,cursor:uploading?"not-allowed":"pointer",fontWeight:500}}>
            {uploading ? "Subiendo..." : "Subir Archivo"}
            <input type="file" onChange={handleUpload} style={{display:"none"}} disabled={uploading} />
          </label>
        </div>

        <div style={{background:"white",borderRadius:12,boxShadow:"0 2px 8px rgba(0,0,0,0.06)",overflow:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead>
              <tr style={{borderBottom:"2px solid #f0f0f0"}}>
                <th style={{padding:"0.75rem 1rem",textAlign:"left",color:"#888",fontSize:"0.8rem",fontWeight:600}}>Nombre</th>
                <th style={{padding:"0.75rem 1rem",textAlign:"right",color:"#888",fontSize:"0.8rem",fontWeight:600}}>Tamaño</th>
                <th style={{padding:"0.75rem 1rem",textAlign:"left",color:"#888",fontSize:"0.8rem",fontWeight:600}}>Actualizado</th>
                <th style={{padding:"0.75rem 1rem",width:80}}></th>
              </tr>
            </thead>
            <tbody>
              {items.map((file:any) => (
                <tr key={file.name} style={{borderBottom:"1px solid #f5f5f5"}}>
                  <td style={{padding:"0.75rem 1rem",fontSize:"0.9rem"}}>{file.name}</td>
                  <td style={{padding:"0.75rem 1rem",fontSize:"0.9rem",textAlign:"right",color:"#666"}}>{formatSize(file.size ?? 0)}</td>
                  <td style={{padding:"0.75rem 1rem",fontSize:"0.9rem"}}>{file.updated_at ? new Date(file.updated_at).toLocaleDateString() : "-"}</td>
                  <td style={{padding:"0.75rem 1rem"}}>
                    <button onClick={() => window.open(`https://6vgumkqu.us-east.insforge.app/api/storage/files/conjunto-files/${encodeURIComponent(file.name)}`)} style={{...btnSmall,marginRight:"0.3rem",background:"#2196f3"}}>Ver</button>
                    <button onClick={() => handleDelete(file.name)} style={{...btnSmall,background:"#e74c3c"}}>X</button>
                  </td>
                </tr>
              ))}
              {items.length===0 && <tr><td colSpan={4} style={{padding:"2rem",textAlign:"center",color:"#999"}}>Sin archivos</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

const btnSmall: React.CSSProperties = { padding:"0.3rem 0.6rem",background:"#4fc3f7",color:"white",border:"none",borderRadius:4,cursor:"pointer",fontSize:"0.75rem" };
