import type { NextApiRequest, NextApiResponse } from "next";
import { adminInsforge } from "@/lib/insforge";

async function count(tabla: string, filter?: { col: string; val: string }) {
  const query = adminInsforge!.database.from(tabla).select("*");
  if (filter) query.eq(filter.col, filter.val);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return Array.isArray(data) ? data.length : 0;
}

async function sum(tabla: string, col: string) {
  const { data, error } = await adminInsforge!.database.from(tabla).select(col);
  if (error) throw new Error(error.message);
  const rows = Array.isArray(data) ? data : [];
  return rows.reduce((a: number, b: any) => a + Number(b[col] ?? 0), 0);
}

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const [
      residentes, unidades, tareasPend, tareasTotal,
      proveedores, personal, visitasHoy, paquetesHoy,
      ingresosTotal, gastosTotal, vencimientos, camaras,
      cartelera,
    ] = await Promise.allSettled([
      count("residents"),
      count("unidades"),
      count("tasks", { col: "completed", val: "false" }),
      count("tasks"),
      count("providers"),
      count("internal_staff"),
      count("visitor_logs"),
      count("package_logs"),
      sum("incomes", "amount"),
      sum("expenses", "amount"),
      count("due_dates"),
      count("camaras"),
      count("carteleria_contenidos"),
    ]);

    const val = (p: PromiseSettledResult<number>) => p.status === "fulfilled" ? p.value : 0;

    res.status(200).json({
      data: {
        residentes: val(residentes),
        unidades: val(unidades),
        tareas_pendientes: val(tareasPend),
        tareas_total: val(tareasTotal),
        proveedores: val(proveedores),
        personal: val(personal),
        visitas_hoy: val(visitasHoy),
        paquetes_hoy: val(paquetesHoy),
        ingresos_mes: val(ingresosTotal),
        gastos_mes: val(gastosTotal),
        vencimientos: val(vencimientos),
        camaras: val(camaras),
        cartelera: val(cartelera),
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message ?? "Error al conectar con el health check" });
  }
}
