import { adminInsforge } from "@/lib/insforge";

export type PlanSlug = "prueba" | "basico" | "full" | "total" | "multi";

export type PlanInfo = {
  slug: PlanSlug;
  nombre: string;
  precio: number;
  periodo: string;
  destacado?: boolean;
  descripcion: string;
};

export const PLANES: PlanInfo[] = [
  { slug: "prueba", nombre: "PAIC PRUEBA", precio: 0, periodo: "30 días", descripcion: "Todas las funcionalidades por 30 días gratis" },
  { slug: "basico", nombre: "PAIC BÁSICO", precio: 49000, periodo: "/mes", descripcion: "Módulos esenciales + asistente IA básico" },
  { slug: "full", nombre: "PAIC FULL", precio: 99000, periodo: "/mes", descripcion: "Todos los módulos + IA avanzado + onboarding" },
  { slug: "total", nombre: "PAIC TOTAL", precio: 149000, periodo: "/mes", descripcion: "Todo FULL + app móvil PWA para residentes", destacado: true },
  { slug: "multi", nombre: "PAIC MULTI", precio: 249000, periodo: "/mes", descripcion: "Administra múltiples copropiedades" },
];

export async function getPlanActivo(conjuntoId: string): Promise<PlanSlug> {
  const { data } = await adminInsforge!.database
    .from("suscripciones")
    .select("*")
    .eq("copropiedad_id", conjuntoId)
    .eq("estado", "activa")
    .order("created_at", { ascending: false })
    .limit(1);

  if (data && data.length > 0) {
    const sub = data[0];
    const fin = sub.fecha_fin ? new Date(sub.fecha_fin) : null;
    if (fin && fin < new Date()) {
      return "basico";
    }
    return (sub.plan as PlanSlug) ?? "basico";
  }

  return "basico";
}

export async function getModulosDelPlan(plan: PlanSlug): Promise<string[]> {
  const { data } = await adminInsforge!.database
    .from("modulos_plan")
    .select("modulo")
    .eq("plan", plan);

  return (data ?? []).map((r: any) => r.modulo);
}

export async function conjuntoTieneModulo(conjuntoId: string, modulo: string): Promise<boolean> {
  const plan = await getPlanActivo(conjuntoId);
  const modulos = await getModulosDelPlan(plan);
  return modulos.includes(modulo);
}

const MAPA_MODULOS: Record<string, string> = {
  "/dashboard": "dashboard",
  "/dashboard/base-datos": "base_datos",
  "/dashboard/areas-comunes": "areas_comunes",
  "/dashboard/comunicaciones": "comunicaciones",
  "/dashboard/archivos": "archivos",
  "/dashboard/finanzas": "finanzas",
  "/dashboard/seguridad": "seguridad",
  "/dashboard/vencimientos": "vencimientos",
  "/dashboard/tareas": "tareas",
  "/dashboard/camaras": "camaras",
  "/dashboard/cartelera": "cartelera",
};

export function rutaAModulo(ruta: string): string | undefined {
  return MAPA_MODULOS[ruta];
}

export async function getPlanesConModulos(): Promise<Record<string, string[]>> {
  const { data } = await adminInsforge!.database.from("modulos_plan").select("*");
  const planes: Record<string, string[]> = {};
  for (const row of data ?? []) {
    if (!planes[row.plan]) planes[row.plan] = [];
    planes[row.plan].push(row.modulo);
  }
  return planes;
}

export const MODULOS_INFO: Record<string, string> = {
  dashboard: "Centro de Control",
  base_datos: "Base de Datos",
  areas_comunes: "Áreas Comunes",
  comunicaciones: "Comunicaciones",
  archivos: "Archivos",
  finanzas: "Finanzas",
  seguridad: "Seguridad",
  vencimientos: "Vencimientos",
  tareas: "Tareas",
  camaras: "Cámaras",
  cartelera: "Cartelera",
  asistente_ia_basico: "Asistente IA Básico",
  asistente_ia_avanzado: "Asistente IA Avanzado",
  onboarding_audiovisual: "Onboarding Audiovisual",
  app_movil_pwa: "App Móvil PWA",
  dashboard_multi: "Dashboard Multi",
};
