import type { NextApiRequest, NextApiResponse } from "next";

const BASE = process.env.NEXT_PUBLIC_INSFORGE_URL!;
const KEY = process.env.INSFORGE_API_KEY!;
const H = { apikey: KEY, Authorization: `Bearer ${KEY}` };

async function count(tabla: string, filter = "") {
  const url = `${BASE}/api/database/records/${tabla}?limit=0${filter ? `&${filter}` : ""}`;
  const r = await fetch(url, { headers: H });
  const d = await r.json();
  return Array.isArray(d) ? d.length : 0;
}

async function sum(tabla: string, col: string) {
  const url = `${BASE}/api/database/records/${tabla}?select=${col}`;
  const r = await fetch(url, { headers: H });
  const d: any[] = await r.json();
  return d.reduce((a: number, b: any) => a + Number(b[col] ?? 0), 0);
}

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const [
      residentes, unidades, tareasPend, tareasTotal,
      proveedores, personal, visitasHoy, paquetesHoy,
      ingresosTotal, gastosTotal, vencimientos,
    ] = await Promise.all([
      count("residents"),
      count("unidades"),
      count("tasks", "completed=eq.false"),
      count("tasks"),
      count("providers"),
      count("internal_staff"),
      count("visitor_logs"),
      count("package_logs"),
      sum("incomes", "amount"),
      sum("expenses", "amount"),
      count("due_dates"),
    ]);

    res.status(200).json({
      data: {
        residentes, unidades, tareas_pendientes: tareasPend, tareas_total: tareasTotal,
        proveedores, personal, visitas_hoy: visitasHoy, paquetes_hoy: paquetesHoy,
        ingresos_mes: ingresosTotal, gastos_mes: gastosTotal, vencimientos,
      },
    });
  } catch {
    res.status(500).json({ error: "Error al conectar con el health check" });
  }
}
