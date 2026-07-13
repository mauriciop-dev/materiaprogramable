-- 003-paic2-add-resident-id
-- Agregar ID UUID a residents + nuevas columnas PAIC 2.0

-- 1. Agregar columna id UUID
ALTER TABLE public.residents ADD COLUMN IF NOT EXISTS id UUID;

-- 2. Poblar IDs para registros existentes
UPDATE public.residents SET id = gen_random_uuid() WHERE id IS NULL;

-- 3. Hacer id NOT NULL
ALTER TABLE public.residents ALTER COLUMN id SET NOT NULL;

-- 4. Agregar nuevas columnas
ALTER TABLE public.residents ADD COLUMN IF NOT EXISTS documento VARCHAR(20);
ALTER TABLE public.residents ADD COLUMN IF NOT EXISTS unidad_id UUID REFERENCES public.unidades(id);
ALTER TABLE public.residents ADD COLUMN IF NOT EXISTS telefono_alternativo VARCHAR(20);
ALTER TABLE public.residents ADD COLUMN IF NOT EXISTS es_propietario BOOLEAN DEFAULT true;
ALTER TABLE public.residents ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT true;

-- 5. Migrar datos de apartment a unidad_id si hay unidades existentes
-- (opcional, se hace manualmente)

-- 6. Crear nuevo PK
ALTER TABLE public.residents DROP CONSTRAINT IF EXISTS residents_pkey CASCADE;
ALTER TABLE public.residents ADD PRIMARY KEY (id);
