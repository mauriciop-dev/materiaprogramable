import type { NextApiRequest, NextApiResponse } from "next";
import { adminInsforge } from "@/lib/insforge";

const TABLAS: Record<string, { table: string; fkey: string }> = {
  residentes: { table: "residents", fkey: "conjunto_id" },
  unidades: { table: "unidades", fkey: "copropiedad_id" },
  proveedores: { table: "providers", fkey: "conjunto_id" },
  personal: { table: "internal_staff", fkey: "conjunto_id" },
  incomes: { table: "incomes", fkey: "conjunto_id" },
  expenses: { table: "expenses", fkey: "conjunto_id" },
  tasks: { table: "tasks", fkey: "conjunto_id" },
  visitor_logs: { table: "visitor_logs", fkey: "conjunto_id" },
  package_logs: { table: "package_logs", fkey: "conjunto_id" },
  due_dates: { table: "due_dates", fkey: "conjunto_id" },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { recurso } = req.query as { recurso: string };
  const conf = TABLAS[recurso];
  if (!conf) return res.status(404).json({ error: "Recurso no encontrado" });

  try {
    const from = () => adminInsforge!.database.from(conf.table);

    switch (req.method) {
      case "GET": {
        const { data, error } = await from().select("*").order("created_at", { ascending: false });
        if (error) return res.status(400).json({ error: error.message });
        return res.status(200).json({ data });
      }
      case "POST": {
        const body = {
          ...req.body,
          id: undefined,
          [conf.fkey]: req.body.conjunto_id ?? req.body.copropriedad_id ?? req.body[conf.fkey],
        };
        const { data, error } = await from().insert([body]).select();
        if (error) return res.status(400).json({ error: error.message });
        return res.status(201).json({ data });
      }
      case "PUT": {
        const { id, ...update } = req.body;
        const { error } = await from().update(update).eq("id", id);
        if (error) return res.status(400).json({ error: error.message });
        return res.status(200).json({ success: true });
      }
      case "DELETE": {
        const { id } = req.body;
        const { error } = await from().delete().eq("id", id);
        if (error) return res.status(400).json({ error: error.message });
        return res.status(200).json({ success: true });
      }
      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error?.message ?? "Error en la operacion" });
  }
}
