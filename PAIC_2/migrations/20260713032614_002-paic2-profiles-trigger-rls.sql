-- 002-paic2-profiles-trigger-rls
-- Trigger para crear perfil al registrarse + RLS multiinquilino

-- 1. Tabla de perfiles de app (vinculada a auth.users de InsForge)
CREATE TABLE IF NOT EXISTS public.profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  role VARCHAR(20) NOT NULL DEFAULT 'admin' CHECK (role IN ('admin','portero','residente','soporte')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Tabla de asignación usuario ↔ copropiedad
CREATE TABLE IF NOT EXISTS public.usuario_copropiedad (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  copropiedad_id UUID NOT NULL REFERENCES public.conjuntos(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL DEFAULT 'admin' CHECK (role IN ('admin','portero','residente','soporte')),
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, copropiedad_id)
);

ALTER TABLE public.usuario_copropiedad ENABLE ROW LEVEL SECURITY;

-- 3. Función para obtener el copropiedad_id del usuario actual
CREATE OR REPLACE FUNCTION public.usuario_copropiedad_activa()
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT copropiedad_id
  FROM public.usuario_copropiedad
  WHERE user_id = auth.uid()
    AND activo = true
  LIMIT 1;
$$;

-- 4. Trigger: al crear usuario en auth.users, crear profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO profiles (user_id, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- 5. RLS policies para profiles
CREATE POLICY profiles_owner_select ON public.profiles
FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY profiles_owner_update ON public.profiles
FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 6. RLS policies para usuario_copropiedad
CREATE POLICY uc_owner_select ON public.usuario_copropiedad
FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY uc_admin_select ON public.usuario_copropiedad
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.usuario_copropiedad uc
    WHERE uc.user_id = auth.uid()
      AND uc.role IN ('admin','soporte')
      AND uc.activo = true
  )
);

-- 7. RLS policies para conjuntos
CREATE POLICY conjuntos_owner_select ON public.conjuntos
FOR SELECT TO authenticated
USING (
  id IN (
    SELECT copropiedad_id FROM public.usuario_copropiedad
    WHERE user_id = auth.uid() AND activo = true
  )
);

-- 8. Reemplazar RLS de unidades y suscripciones con policies reales
DROP POLICY IF EXISTS unidades_copropiedad_select ON public.unidades;
CREATE POLICY unidades_copropiedad_select ON public.unidades
FOR SELECT TO authenticated
USING (
  copropiedad_id IN (
    SELECT copropiedad_id FROM public.usuario_copropiedad
    WHERE user_id = auth.uid() AND activo = true
  )
);

DROP POLICY IF EXISTS suscripciones_copropiedad_select ON public.suscripciones;
CREATE POLICY suscripciones_copropiedad_select ON public.suscripciones
FOR SELECT TO authenticated
USING (
  copropiedad_id IN (
    SELECT copropiedad_id FROM public.usuario_copropiedad
    WHERE user_id = auth.uid() AND activo = true
  )
);
