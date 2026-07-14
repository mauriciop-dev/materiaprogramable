import type { NextApiRequest, NextApiResponse } from "next";
import { adminInsforge } from "@/lib/insforge";

const FK_MAP: Record<string, string> = {
  residents: "conjunto_id",
  unidades: "copropiedad_id",
  tasks: "conjunto_id",
  providers: "conjunto_id",
  internal_staff: "conjunto_id",
  visitor_logs: "conjunto_id",
  package_logs: "conjunto_id",
  incomes: "conjunto_id",
  expenses: "conjunto_id",
  due_dates: "conjunto_id",
  camaras: "conjunto_id",
  carteleria_contenidos: "conjunto_id",
};

async function count(tabla: string, conjuntoId?: string, filter?: { col: string; val: string }) {
  const query = adminInsforge!.database.from(tabla).select("*");
  if (conjuntoId) {
    const fk = FK_MAP[tabla] ?? "conjunto_id";
    query.eq(fk, conjuntoId);
  }
  if (filter) query.eq(filter.col, filter.val);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return Array.isArray(data) ? data.length : 0;
}

async function sum(tabla: string, col: string, conjuntoId?: string) {
  const query = adminInsforge!.database.from(tabla).select(col);
  if (conjuntoId) {
    const fk = FK_MAP[tabla] ?? "conjunto_id";
    query.eq(fk, conjuntoId);
  }
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  const rows = Array.isArray(data) ? data : [];
  return rows.reduce((a: number, b: any) => a + Number(b[col] ?? 0), 0);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const conjuntoId = (req.query.conjunto_id as string) || undefined;

  try {
    const [
      residentes, unidades, tareasPend, tareasTotal,
      proveedores, personal, visitasHoy, paquetesHoy,
      ingresosTotal, gastosTotal, vencimientos, camaras,
      cartelera,
    ] = await Promise.allSettled([
      count("residents", conjuntoId),
      count("unidades", conjuntoId),
      count("tasks", conjuntoId, { col: "completed", val: "false" }),
      count("tasks", conjuntoId),
      count("providers", conjuntoId),
      count("internal_staff", conjuntoId),
      count("visitor_logs", conjuntoId),
      count("package_logs", conjuntoId),
      sum("incomes", "amount", conjuntoId),
      sum("expenses", "amount", conjuntoId),
      count("due_dates", conjuntoId),
      count("camaras", conjuntoId),
      count("carteleria_contenidos", conjuntoId),
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
