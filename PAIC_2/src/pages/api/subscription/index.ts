import type { NextApiRequest, NextApiResponse } from "next";
import { adminInsforge } from "@/lib/insforge";
import { getPlanActivo, getPlanesConModulos, PLANES } from "@/services/subscription";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies["insforge-auth-token"];
  if (!token) return res.status(401).json({ error: "No autorizado" });

  const { data: vinculos } = await adminInsforge!.database
    .from("usuario_copropiedad")
    .select("copropiedad_id")
    .eq("activo", true)
    .limit(1);

  const conjuntoId = req.body?.conjunto_id ?? vinculos?.[0]?.copropiedad_id;
  if (!conjuntoId) return res.status(400).json({ error: "Sin copropiedad vinculada" });

  switch (req.method) {
    case "GET": {
      const [plan, planesModulos] = await Promise.all([
        getPlanActivo(conjuntoId),
        getPlanesConModulos(),
      ]);

      const { data: sub } = await adminInsforge!.database
        .from("suscripciones")
        .select("*")
        .eq("copropiedad_id", conjuntoId)
        .eq("estado", "activa")
        .order("created_at", { ascending: false })
        .limit(1);

      const info = PLANES.find((p) => p.slug === plan);

      return res.status(200).json({
        plan_actual: plan,
        suscripcion: sub?.[0] ?? null,
        info_plan: info ?? null,
        planes: PLANES,
        modulos_por_plan: planesModulos,
      });
    }

    case "POST": {
      const { plan } = req.body;
      if (!plan) return res.status(400).json({ error: "Plan requerido" });

      const dias: Record<string, number> = { prueba: 30 };
      const fechaFin = dias[plan]
        ? new Date(Date.now() + dias[plan] * 86400000).toISOString()
        : null;

      await adminInsforge!.database
        .from("suscripciones")
        .update({ estado: "expirada" })
        .eq("copropiedad_id", conjuntoId)
        .eq("estado", "activa");

      const { data, error: e2 } = await adminInsforge!.database
        .from("suscripciones")
        .insert([{
          copropiedad_id: conjuntoId,
          plan,
          estado: "activa",
          fecha_inicio: new Date().toISOString(),
          fecha_fin: fechaFin,
        }])
        .select();

      if (e2) return res.status(400).json({ error: e2.message });

      if (plan !== "prueba") {
        await adminInsforge!.database
          .from("conjuntos")
          .update({ subscription_plan: plan })
          .eq("id", conjuntoId);
      }

      return res.status(200).json({ success: true, suscripcion: data?.[0] });
    }

    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}
