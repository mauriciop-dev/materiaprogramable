-- 001-paic2-copropiedades-view-unidades
-- Fase 0-1: View copropiedades + tabla unidades + suscripciones

-- 1. View de renombre: conjuntos -> copropiedades (sin romper 34 FK)
CREATE OR REPLACE VIEW public.copropiedades AS
SELECT
  id,
  name,
  nit,
  address,
  admin_name,
  admin_email,
  admin_phone,
  subscription_plan,
  plan_price,
  registration_date,
  created_at,
  updated_at
FROM public.conjuntos;

-- 2. Tabla unidades (torre, interior, apto, local, oficina, parqueadero)
CREATE TABLE IF NOT EXISTS public.unidades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  copropiedad_id UUID NOT NULL REFERENCES public.conjuntos(id) ON DELETE CASCADE,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('apartamento','local','oficina','parqueadero','bodega')),
  torre VARCHAR(10),
  interior VARCHAR(10),
  piso VARCHAR(5),
  numero VARCHAR(20) NOT NULL,
  area_m2 NUMERIC(10,2),
  propietario_nombre VARCHAR(200),
  propietario_documento VARCHAR(20),
  propietario_email VARCHAR(200),
  propietario_telefono VARCHAR(20),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.unidades ENABLE ROW LEVEL SECURITY;

-- 3. Tabla suscripciones (historial por copropiedad)
CREATE TABLE IF NOT EXISTS public.suscripciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  copropiedad_id UUID NOT NULL REFERENCES public.conjuntos(id) ON DELETE CASCADE,
  plan VARCHAR(20) NOT NULL CHECK (plan IN ('prueba','basico','full','total','multi')),
  estado VARCHAR(20) NOT NULL DEFAULT 'activa' CHECK (estado IN ('activa','cancelada','expirada','pendiente')),
  fecha_inicio TIMESTAMPTZ NOT NULL DEFAULT now(),
  fecha_fin TIMESTAMPTZ,
  pago_id VARCHAR(100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.suscripciones ENABLE ROW LEVEL SECURITY;

-- 4. Catálogo de módulos habilitados por plan
CREATE TABLE IF NOT EXISTS public.modulos_plan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan VARCHAR(20) NOT NULL,
  modulo VARCHAR(50) NOT NULL,
  UNIQUE (plan, modulo)
);

-- Insertar módulos por plan
INSERT INTO public.modulos_plan (plan, modulo) VALUES
  ('prueba', 'dashboard'),
  ('prueba', 'base_datos'),
  ('prueba', 'areas_comunes'),
  ('prueba', 'comunicaciones'),
  ('prueba', 'archivos'),
  ('prueba', 'finanzas'),
  ('prueba', 'seguridad'),
  ('prueba', 'vencimientos'),
  ('prueba', 'tareas'),
  ('prueba', 'camaras'),
  ('prueba', 'cartelera'),

  ('basico', 'dashboard'),
  ('basico', 'base_datos'),
  ('basico', 'areas_comunes'),
  ('basico', 'comunicaciones'),
  ('basico', 'archivos'),
  ('basico', 'finanzas'),
  ('basico', 'vencimientos'),
  ('basico', 'tareas'),
  ('basico', 'asistente_ia_basico'),

  ('full', 'dashboard'),
  ('full', 'base_datos'),
  ('full', 'areas_comunes'),
  ('full', 'comunicaciones'),
  ('full', 'archivos'),
  ('full', 'finanzas'),
  ('full', 'seguridad'),
  ('full', 'vencimientos'),
  ('full', 'tareas'),
  ('full', 'camaras'),
  ('full', 'cartelera'),
  ('full', 'asistente_ia_basico'),
  ('full', 'asistente_ia_avanzado'),
  ('full', 'onboarding_audiovisual'),

  ('total', 'dashboard'),
  ('total', 'base_datos'),
  ('total', 'areas_comunes'),
  ('total', 'comunicaciones'),
  ('total', 'archivos'),
  ('total', 'finanzas'),
  ('total', 'seguridad'),
  ('total', 'vencimientos'),
  ('total', 'tareas'),
  ('total', 'camaras'),
  ('total', 'cartelera'),
  ('total', 'asistente_ia_basico'),
  ('total', 'asistente_ia_avanzado'),
  ('total', 'onboarding_audiovisual'),
  ('total', 'app_movil_pwa'),

  ('multi', 'dashboard'),
  ('multi', 'dashboard_multi'),
  ('multi', 'base_datos'),
  ('multi', 'areas_comunes'),
  ('multi', 'comunicaciones'),
  ('multi', 'archivos'),
  ('multi', 'finanzas'),
  ('multi', 'seguridad'),
  ('multi', 'vencimientos'),
  ('multi', 'tareas'),
  ('multi', 'camaras'),
  ('multi', 'cartelera'),
  ('multi', 'asistente_ia_basico'),
  ('multi', 'asistente_ia_avanzado'),
  ('multi', 'onboarding_audiovisual'),
  ('multi', 'app_movil_pwa');

-- 5. Agregar columna tipo a conjuntos (residencial, comercial, mixto)
ALTER TABLE public.conjuntos ADD COLUMN IF NOT EXISTS tipo VARCHAR(20) DEFAULT 'residencial';

-- 6. RLS básica para las nuevas tablas
CREATE POLICY unidades_copropiedad_select ON public.unidades
FOR SELECT TO authenticated
USING (copropiedad_id = (SELECT id FROM public.conjuntos LIMIT 1));

CREATE POLICY suscripciones_copropiedad_select ON public.suscripciones
FOR SELECT TO authenticated
USING (copropiedad_id = (SELECT id FROM public.conjuntos LIMIT 1));
