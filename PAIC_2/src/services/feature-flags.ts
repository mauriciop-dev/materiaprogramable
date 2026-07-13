const planes = ["prueba", "basico", "full", "total", "multi"] as const;
type Plan = (typeof planes)[number];

const modulosPorPlan: Record<Plan, string[]> = {
  prueba: ["dashboard", "base_datos", "areas_comunes", "comunicaciones", "archivos", "finanzas", "seguridad", "vencimientos", "tareas", "camaras", "cartelera"],
  basico: ["dashboard", "base_datos", "areas_comunes", "comunicaciones", "archivos", "finanzas", "vencimientos", "tareas", "asistente_ia_basico"],
  full: ["dashboard", "base_datos", "areas_comunes", "comunicaciones", "archivos", "finanzas", "seguridad", "vencimientos", "tareas", "camaras", "cartelera", "asistente_ia_basico", "asistente_ia_avanzado", "onboarding_audiovisual"],
  total: ["dashboard", "base_datos", "areas_comunes", "comunicaciones", "archivos", "finanzas", "seguridad", "vencimientos", "tareas", "camaras", "cartelera", "asistente_ia_basico", "asistente_ia_avanzado", "onboarding_audiovisual", "app_movil_pwa"],
  multi: ["dashboard", "dashboard_multi", "base_datos", "areas_comunes", "comunicaciones", "archivos", "finanzas", "seguridad", "vencimientos", "tareas", "camaras", "cartelera", "asistente_ia_basico", "asistente_ia_avanzado", "onboarding_audiovisual", "app_movil_pwa"],
};

export function tieneModulo(plan: Plan, modulo: string): boolean {
  return modulosPorPlan[plan]?.includes(modulo) ?? false;
}

export function getModulos(plan: Plan): string[] {
  return modulosPorPlan[plan] ?? [];
}
