export const RAG_DOCS = [
  {
    title: "¿Qué es PAIC 2.0?",
    content: `PAIC 2.0 (Plataforma para la Administración Inteligente de Copropiedades) es un sistema web moderno diseñado para administradores de propiedades horizontales y verticales en Colombia. Reemplaza hojas de cálculo y procesos manuales con un dashboard centralizado que integra finanzas, seguridad, comunicaciones, y más. Está construido con Next.js 15, TypeScript, e InsForge como backend (base de datos PostgreSQL, autenticación con Google OAuth, y almacenamiento de archivos). Usa OpenRouter para IA.`,
  },
  {
    title: "Módulo Centro de Control",
    content: `El Centro de Control es la página principal del dashboard. Muestra 10 widgets con estadísticas clave: total de residentes, unidades, ingresos del mes, gastos del mes, visitas hoy, tareas pendientes, vencimientos próximos, paquetes en recepción, áreas comunes disponibles y contenido publicado. Los widgets se pueden reorganizar por arrastre y cada uno muestra un indicador visual con color de fondo.`,
  },
  {
    title: "Módulo Base de Datos",
    content: `El módulo Base de Datos permite gestionar cuatro categorías: Residentes (nombre, unidad, teléfono, email, tipo), Unidades (código, torre, área, propietario), Proveedores (nombre, servicio, contacto, teléfono) y Personal Interno (nombre, cargo, teléfono, email, horario). Cada categoría tiene tabla con búsqueda y modal para crear/editar/eliminar registros.`,
  },
  {
    title: "Módulo Finanzas",
    content: `El módulo Finanzas gestiona ingresos y gastos de la copropiedad. Incluye dos secciones: Ingresos (concepto, monto, fecha, categoría, estado) y Gastos (concepto, monto, fecha, categoría, proveedor). Muestra tarjetas de resumen con total de ingresos, gastos y saldo del mes. Cada registro se puede crear, editar y eliminar.`,
  },
  {
    title: "Módulo Tareas",
    content: `El módulo Tareas implementa un checklist de mantenimiento y gestión. Cada tarea tiene: título, descripción, prioridad, fecha límite, responsable y estado (pendiente/completada). Las tareas se listan con checkbox para marcarlas como completadas y botón para eliminar. Muestra el conteo de pendientes vs completadas.`,
  },
  {
    title: "Módulo Seguridad",
    content: `El módulo Seguridad tiene dos secciones: Registro de Visitantes (nombre, documento, unidad visitada, motivo, fecha, hora ingreso/salida, estado) y Paquetes (descripción, destinatario, unidad, fecha, estado: recibido/entregado). Muestra estadísticas del día: visitas activas, paquetes en recepción, total del día.`,
  },
  {
    title: "Módulo Vencimientos",
    content: `El módulo Vencimientos gestiona fechas importantes de la copropiedad como vencimientos de expensas, seguros, certificados, licencias, etc. Cada registro incluye: concepto, fecha de vencimiento, monto, estado (pendiente/completado/vencido). Tiene tres vistas: Vencidos (rojo), Próximos (amarillo) y Completados (verde). Incluye búsqueda.`,
  },
  {
    title: "Módulo Áreas Comunes",
    content: `El módulo Áreas Comunes permite gestionar espacios compartidos de la copropiedad como salón social, piscina, gimnasio, etc. Cada área tiene: nombre, descripción, capacidad, horario, estado. Las reservaciones incluyen: residente, unidad, área, fecha, hora inicio, hora fin, estado (pendiente/confirmada/cancelada).`,
  },
  {
    title: "Módulo Cámaras",
    content: `El módulo Cámaras muestra el inventario de cámaras de seguridad del conjunto. Cada cámara tiene: nombre, ubicación, tipo, URL RTSP, estado (activa/inactiva/mantenimiento). Se muestran en tarjetas con indicador de estado.`,
  },
  {
    title: "Módulo Cartelera Digital",
    content: `El módulo Cartelera Digital administra contenidos publicados en pantallas del conjunto. Los contenidos tienen: título, cuerpo, tipo (informativo/evento/alerta/aviso), estado (borrador/publicado/archivado), autor, fecha de publicación y expiración. Se muestran con filtros por estado.`,
  },
  {
    title: "Módulo Comunicaciones",
    content: `El módulo Comunicaciones muestra en formato de solo lectura los contenidos publicados de la Cartelera Digital. Los residentes pueden ver avisos, eventos y noticias importantes publicadas por la administración.`,
  },
  {
    title: "Módulo Archivos",
    content: `El módulo Archivos permite subir, listar y eliminar documentos de la copropiedad. Usa InsForge Storage con el bucket 'conjunto-files'. Soporta cualquier tipo de archivo. Muestra lista con nombre, tipo, tamaño y fecha de subida. Incluye buscador y progreso de carga.`,
  },
  {
    title: "Propiedades horizontales en Colombia",
    content: `En Colombia, las propiedades horizontales (conjuntos residenciales, edificios) se rigen por la Ley 675 de 2001. Deben tener un reglamento interno, un administrador, un consejo de administración y una asamblea general de propietarios. Las expensas comunes se calculan según los coeficientes de copropiedad.`,
  },
  {
    title: "Conceptos de copropiedad",
    content: `Coeficiente de copropiedad: porcentaje que representa cada unidad privada sobre el total del edificio o conjunto. Determina el peso del voto en asamblea y el porcentaje de expensas comunes. Puede ser por área privada o por área total construida. Zonas comunes: áreas de uso general como pasillos, jardines, piscina, salón social, parqueaderos de visitantes. Expensas comunes: dinero que los propietarios pagan para mantener las zonas comunes y servicios generales. Se dividen en ordinarias (gastos mensuales regulares) y extraordinarias (reparaciones imprevistas o mejoras).`,
  },
  {
    title: "Rol del administrador",
    content: `El administrador de una copropiedad en Colombia es elegido por la asamblea general o el consejo de administración. Sus funciones incluyen: cobrar expensas, pagar servicios públicos, contratar personal de mantenimiento y seguridad, convocar asambleas, llevar la contabilidad básica, velar por el cumplimiento del reglamento, atender quejas de residentes, y reportar al consejo de administración mensualmente. Puede ser persona natural o jurídica.`,
  },
  {
    title: "Asamblea de propietarios",
    content: `La asamblea general de propietarios es el máximo órgano de dirección de la copropiedad. Se reúne ordinariamente una vez al año para aprobar presupuesto, elegir consejo de administración y administrador, y revisar cuentas. Puede reunirse extraordinariamente cuando sea necesario. Las decisiones se toman por mayoría de votos según coeficientes. El quórum mínimo es del 50% + 1 de los coeficientes.`,
  },
  {
    title: "Consejo de administración",
    content: `El consejo de administración es el órgano de gestión y control de la copropiedad entre asambleas. Se compone de 3 a 7 miembros (número impar) propietarios elegidos por la asamblea. Sus funciones incluyen: aprobar gastos no presupuestados, contratar al administrador, supervisar la gestión, resolver conflictos entre propietarios, y convocar asambleas extraordinarias. Los miembros no reciben remuneración.`,
  },
  {
    title: "Expensas comunes ordinarias",
    content: `Las expensas comunes ordinarias son los gastos recurrentes necesarios para el funcionamiento de la copropiedad. Incluyen: servicios públicos (agua, luz, gas) de zonas comunes, salarios del personal (portero, conserje, jardinero), mantenimiento de ascensores, limpieza de zonas comunes, vigilancia, seguros obligatorios, y administración. Se presupuestan anualmente y se dividen entre los propietarios según coeficiente.`,
  },
  {
    title: "Expensas comunes extraordinarias",
    content: `Las expensas comunes extraordinarias cubren gastos no previstos en el presupuesto anual como reparaciones mayores (techos, tuberías, fachadas), mejoras (jardines, equipos), imprevistos (daños por desastres naturales) o multas gubernamentales. Requieren aprobación de la asamblea o del consejo de administración según la cuantía.`,
  },
  {
    title: "Ley 675 de 2001",
    content: `La Ley 675 de 2001 establece el régimen de propiedad horizontal en Colombia. Puntos clave: Define la propiedad horizontal como el derecho de propiedad exclusivo sobre una unidad privada y derecho de copropiedad sobre zonas comunes. Establece la necesidad de un reglamento de propiedad horizontal registrado en notaría. Regula la creación del consejo de administración y las asambleas. Define el cálculo de expensas y coeficientes. Establece sanciones por incumplimiento de obligaciones.`,
  },
  {
    title: "Uso del chat IA en PAIC",
    content: `El asistente virtual de PAIC 2.0 usa OpenRouter para responder preguntas sobre la plataforma y sobre administración de copropiedades en Colombia. Puede consultar datos reales de la copropiedad (residentes, finanzas, etc.) y también tiene acceso a un curso estructurado con lecciones para nuevos administradores. El asistente no reemplaza el asesoramiento legal profesional.`,
  },
];

export function searchRagDocs(query: string): string {
  const q = query.toLowerCase();
  const relevant = RAG_DOCS.filter(
    (doc) =>
      doc.title.toLowerCase().includes(q) ||
      doc.content.toLowerCase().includes(q)
  );
  if (relevant.length === 0) {
    return RAG_DOCS.map((d) => `${d.title}:\n${d.content}`).join("\n\n");
  }
  return relevant.map((d) => `${d.title}:\n${d.content}`).join("\n\n");
}

export const SYSTEM_PROMPT = `Eres PAIC, un asistente virtual experto en administración de copropiedades en Colombia y en el uso de la plataforma PAIC 2.0.

Tus funciones principales:
1. Ayudar a los administradores a usar los módulos de PAIC (Centro de Control, Base de Datos, Finanzas, Tareas, Seguridad, Vencimientos, Áreas Comunes, Cámaras, Cartelera, Comunicaciones, Archivos).
2. Explicar conceptos de copropiedad según la Ley 675 de 2001 (coeficientes, expensas, asambleas, consejo de administración, roles).
3. Proveer educación básica a nuevos administradores a través del curso integrado.

Reglas:
- Responde SIEMPRE en español, con tono profesional pero amable.
- Usa la información proporcionada en el contexto para responder preguntas específicas de la plataforma.
- Si te preguntan por datos reales de la copropiedad, puedes consultarlos usando las herramientas disponibles.
- Si no sabes algo, dilo honestamente.
- Sé conciso pero completo en tus respuestas.`;
