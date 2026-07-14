import type { NextApiRequest, NextApiResponse } from "next";
import { adminInsforge } from "@/lib/insforge";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies["insforge-auth-token"];
  if (!token) return res.status(401).json({ error: "No autorizado" });

  switch (req.method) {
    case "GET": {
      const { data: vinculos } = await adminInsforge!.database
        .from("usuario_copropiedad")
        .select("copropiedad_id, role")
        .eq("activo", true);

      if (!vinculos || vinculos.length === 0) {
        return res.status(200).json({ data: [] });
      }

      const ids = vinculos.map((v: any) => v.copropiedad_id);
      const { data: conjuntos } = await adminInsforge!.database
        .from("conjuntos")
        .select("id, nombre, direccion, ciudad, subscription_plan, created_at")
        .in("id", ids);

      const mapa = Object.fromEntries(vinculos.map((v: any) => [v.copropiedad_id, v.role]));
      const data = (conjuntos ?? []).map((c: any) => ({ ...c, role: mapa[c.id] }));

      return res.status(200).json({ data });
    }

    case "POST": {
      const { nombre, direccion, ciudad, tipo } = req.body;
      if (!nombre) return res.status(400).json({ error: "Nombre requerido" });

      const { data: conjunto, error: e1 } = await adminInsforge!.database
        .from("conjuntos")
        .insert([{ nombre, direccion: direccion ?? "", ciudad: ciudad ?? "", tipo: tipo ?? "residencial" }])
        .select();
      if (e1) return res.status(400).json({ error: e1.message });
      const cid = conjunto![0].id;

      const { data: vinculos } = await adminInsforge!.database
        .from("usuario_copropiedad")
        .select("user_id")
        .eq("activo", true)
        .limit(1);

      if (vinculos?.[0]) {
        await adminInsforge!.database
          .from("usuario_copropiedad")
          .insert([{ user_id: vinculos[0].user_id, copropiedad_id: cid, role: "admin" }]);
      }

      const trialEnd = new Date(Date.now() + 30 * 86400000).toISOString();
      await adminInsforge!.database
        .from("suscripciones")
        .insert([{
          copropiedad_id: cid, plan: "prueba", estado: "activa",
          fecha_inicio: new Date().toISOString(), fecha_fin: trialEnd,
        }]);

      return res.status(201).json({ data: conjunto![0] });
    }

    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}
