import type { NextApiRequest, NextApiResponse } from "next";

const TABLAS: Record<string, string> = {
  residentes: "residents",
  unidades: "unidades",
  proveedores: "providers",
  personal: "internal_staff",
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { recurso } = req.query as { recurso: string };
  const tabla = TABLAS[recurso];

  if (!tabla) return res.status(404).json({ error: "Recurso no encontrado" });

  const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL;
  const apiKey = process.env.INSFORGE_API_KEY;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    apikey: apiKey!,
    Authorization: `Bearer ${apiKey}`,
  };

  try {
    switch (req.method) {
      case "GET": {
        const url = `${baseUrl}/api/database/records/${tabla}?order=created_at.desc`;
        const response = await fetch(url, { headers });
        const data = await response.json();
        return res.status(200).json({ data });
      }
      case "POST": {
        const body = { ...req.body, conjunto_id: req.body.copropiedad_id ?? req.body.conjunto_id };
        const response = await fetch(`${baseUrl}/api/database/records/${tabla}`, {
          method: "POST",
          headers: { ...headers, Prefer: "return=representation" },
          body: JSON.stringify(body),
        });
        const data = await response.json();
        return res.status(201).json({ data });
      }
      case "PUT": {
        const { id, ...update } = req.body;
        const response = await fetch(`${baseUrl}/api/database/records/${tabla}?id=eq.${id}`, {
          method: "PATCH",
          headers,
          body: JSON.stringify(update),
        });
        return res.status(200).json({ success: true });
      }
      case "DELETE": {
        const { id } = req.body;
        await fetch(`${baseUrl}/api/database/records/${tabla}?id=eq.${id}`, {
          method: "DELETE",
          headers,
        });
        return res.status(200).json({ success: true });
      }
      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Error en la operacion" });
  }
}
