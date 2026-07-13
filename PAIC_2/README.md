# PAIC 2.0 - Plataforma de Administración Inteligente de Conjuntos

**Versión**: 2.0.0 (IAaaS - IA como Servicio)  
**Estado**: 🟡 Fase 1 - Blindaje de Seguridad e IA  
**Fecha Inicio**: 10 de junio de 2026

---

## 🎯 Visión

PAIC evoluciona de una plataforma de administración operativa a un **IAaaS (IA como Servicio) Omnipresente e Invisible**, donde:

- ✅ La IA **facilita tareas administrativas** (no entretiene)
- ✅ La **infraestructura física** se integra nativamente (cámaras, cartelería, citofonía)
- ✅ **Multi-tenancy estricto** asegura aislamiento por `conjunto_id`
- ✅ **Agentes en la sombra** mantienen la plataforma auto-sanada
- ✅ **Panel "Gran Hermano"** centraliza control operativo

---

## 📚 Documentación

- **[PLAN_IMPLEMENTACION_IAAS.md](./PLAN_IMPLEMENTACION_IAAS.md)** - Roadmap técnico completo (4 fases)
- **[DOCUMENTACION.md](./docs/DOCUMENTACION.md)** - Referencia técnica de funcionalidades
- **[GUIA_DE_USUARIO.md](./docs/GUIA_DE_USUARIO.md)** - Instrucciones de uso por módulo
- **[MANUAL_DE_TESTING.md](./docs/MANUAL_DE_TESTING.md)** - 50+ casos de prueba QA
- **[.env.example](./.env.example)** - Variables de entorno requeridas

---

## 🚀 Inicio Rápido

### 1. Clonar Repositorio
```bash
git clone https://github.com/mauriciop-dev/PAIC_2.git
cd PAIC_2
```

### 2. Instalar Dependencias
```bash
npm install
# o si usas yarn
yarn install
```

### 3. Configurar Variables de Entorno
```bash
cp .env.example .env.local
# Completar con tus credenciales (Supabase, Gemini, etc)
```

### 4. Iniciar Servidor de Desarrollo
```bash
npm run dev
# Abre http://localhost:3000
```

### 5. Conectar con Vercel
```bash
vercel link
# Seguir instrucciones en pantalla
```

---

## 📁 Estructura de Carpetas

```
PAIC_2/
├── /public/                 # Assets estáticos
│   ├── /icons/              # Icons PWA
│   ├── /sounds/             # Audio (citofonía)
│   └── manifest.json        # PWA manifest
├── /src/
│   ├── /pages/              # Next.js pages
│   │   ├── /api/            # API endpoints (Vercel Functions)
│   │   │   ├── /chat/       # Chat seguro (NUEVA - Fase 1)
│   │   │   ├── /citofonia/  # WebRTC (NUEVA - Fase 2)
│   │   │   └── ...
│   │   ├── /admin/          # Panel administrador
│   │   ├── /porteria/       # Interface portería (NUEVA - Fase 2)
│   │   └── /residente/      # PWA residente (NUEVA - Fase 2)
│   ├── /components/         # Componentes React
│   │   ├── /chat/           # Barra de comandos (NUEVA - Fase 1)
│   │   ├── /citofonia/      # WebRTC UI (NUEVA - Fase 2)
│   │   └── ...
│   ├── /services/           # Servicios (API clients)
│   │   ├── /ai/             # AI services (MODIFICADO - Fase 1)
│   │   └── ...
│   ├── /lib/                # Utilidades
│   │   ├── /ai/             # Builders de prompts (NUEVO - Fase 1)
│   │   ├── /auth/           # Validación multi-tenant (NUEVO - Fase 1)
│   │   └── ...
│   └── /utils/              # Helpers
├── /api/                    # Documentación de endpoints
├── /agents/                 # Microservicios de agentes (NUEVO - Fase 4)
│   ├── /sre-agent/
│   ├── /shadow-qa-agent/
│   ├── /shadow-security-agent/
│   ├── /user-habits-agent/
│   └── /gran-hermano/       # Orquestador central
├── /infrastructure/         # Docker, K8s configs (NUEVO - Fase 3)
│   ├── /docker/
│   └── /k8s/
├── /database/               # Migrations y schemas SQL
│   ├── /migrations/
│   └── /seeds/
├── /docs/                   # Documentación
├── .env.example             # Plantilla de variables
├── .env.local               # (NO commitear) Tu config local
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

---

## 🔄 Fases de Desarrollo

### **Fase 1: Blindaje de Seguridad e IA** (4 semanas)
- ✅ Endpoint `/api/chat` centralizado y seguro
- ✅ Migración de API keys al backend
- ✅ Multi-tenancy por `conjunto_id` en todas las consultas
- ✅ Tests de regresión

**Milestone**: Plataforma lista para vender sin riesgo de exposición de credenciales

---

### **Fase 2: Infraestructura de Tres Vistas** (6 semanas)
- ✅ PWA para residentes
- ✅ Citofonía Virtual (WebRTC)
- ✅ Web Push Notifications
- ✅ Interface optimizada para Portería

**Milestone**: Residentes autorizan visitantes desde celular, $0 en citofonía física

---

### **Fase 3: Módulos Físicos e IoT** (8 semanas)
- ✅ Hub de Cámaras (RTSP)
- ✅ LPR (Lectura de Placas) con YOLOv8
- ✅ Cartelería Digital Inteligente
- ✅ Detección de Anomalías en Video

**Milestone**: Automatización de seguridad, diferenciador clave vs competencia

---

### **Fase 4: Sistema de Agentes Aislados** (10 semanas)
- ✅ Agent SRE (auto-sanación)
- ✅ Shadow QA Agent (detección automática de bugs)
- ✅ Shadow Security Agent (pentesting continuo)
- ✅ User Habits Agent (análisis de comportamiento)
- ✅ Gran Hermano (Orquestador central)

**Milestone**: Plataforma auto-gestionada, ProDig puede operar con equipo mínimo

---

## 🛠️ Tecnologías

| Layer | Tecnología | Versión |
|-------|-----------|---------|
| Frontend | React + Next.js | 19 / 15 |
| Backend | Vercel Serverless | - |
| BD | Supabase (PostgreSQL + RLS) | 15 |
| IA | Gemini 2.0 Flash → Modelos Locales | - |
| Citofonía | WebRTC | Native |
| Video | MediaMTX + YOLOv8 | Latest |
| Agentes | LangGraph + CrewAI | Latest |
| PWA | Web Push + Service Worker | Native |
| Notificaciones | Supabase Realtime | - |

---

## 📋 Testing

```bash
# Correr tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# E2E
npm run test:e2e
```

Consulta [MANUAL_DE_TESTING.md](./docs/MANUAL_DE_TESTING.md) para los 50+ casos de prueba.

---

## 🚀 Deploy a Producción

```bash
# Preview
vercel --prod

# Con variables de entorno
vercel env pull .env.local
vercel --prod
```

---

## 🔐 Variables de Entorno Requeridas

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Gemini AI (Backend)
GEMINI_API_KEY=

# Otras APIs
RESEND_API_KEY=
TWILIO_ACCOUNT_SID= (Opcional - Fase 2)

# Vercel
VERCEL_ENV=
VERCEL_TOKEN=
```

Copiar `.env.example` a `.env.local` y completar.

---

## 📞 Contacto y Soporte

**Líder Técnico**: Mauricio Pineda (@mauriciop-dev)  
**Correo**: mauricio@prodig.co  
**Teléfono**: +57 300 xxx xxxx

---

## 📄 Licencia

Propietario © 2026 ProDig SAS. Todos los derechos reservados.

---

**Estado del Proyecto**: 🟡 **FASE 1 EN EJECUCIÓN**

Última actualización: 10 de junio de 2026
