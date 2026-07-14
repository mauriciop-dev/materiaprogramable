import type { NextApiRequest, NextApiResponse } from "next";
import { adminInsforge } from "@/lib/insforge";

const db = () => adminInsforge!.database;

const now = new Date().toISOString();

async function seed() {
  const report: string[] = [];

  const { data: existing } = await db().from("conjuntos").select("*").limit(1);
  if (existing && existing.length > 0) {
    report.push("Ya existen datos de ejemplo. Para reseedear, vacía las tablas primero.");
    return report;
  }

  const { data: conjunto, error: e1 } = await db()
    .from("conjuntos")
    .insert([{ nombre: "Copropiedad PAIC", direccion: "Carrera 45 # 67-89", ciudad: "Bogotá", torres: 2, unidades: 16 }])
    .select();
  if (e1) throw new Error(`conjuntos: ${e1.message}`);
  const cid = conjunto![0].id;
  report.push("Conjunto creado");

  const { data: userProf } = await db().from("user_profiles").select("*").limit(1);
  const uid = userProf?.[0]?.id ?? "demo-user";

  await db().from("usuario_copropiedad").insert([{ usuario_id: uid, copropiedad_id: cid }]);
  report.push("Usuario vinculado a copropiedad");

  const unidades = [
    { codigo: "A-101", torre: "Torre A", piso: 1, area: 68, tipo: "apartamento", propietario: "Carlos Martínez" },
    { codigo: "A-201", torre: "Torre A", piso: 2, area: 72, tipo: "apartamento", propietario: "María Rodríguez" },
    { codigo: "A-301", torre: "Torre A", piso: 3, area: 85, tipo: "apartamento", propietario: "Pedro López" },
    { codigo: "A-401", torre: "Torre A", piso: 4, area: 70, tipo: "apartamento", propietario: "Ana Gómez" },
    { codigo: "A-501", torre: "Torre A", piso: 5, area: 90, tipo: "apartamento", propietario: "Jorge Ramírez" },
    { codigo: "A-601", torre: "Torre A", piso: 6, area: 100, tipo: "apartamento", propietario: "Lucía Fernández" },
    { codigo: "B-102", torre: "Torre B", piso: 1, area: 65, tipo: "apartamento", propietario: "Diego Torres" },
    { codigo: "B-202", torre: "Torre B", piso: 2, area: 75, tipo: "apartamento", propietario: "Sofía Herrera" },
    { codigo: "B-302", torre: "Torre B", piso: 3, area: 80, tipo: "apartamento", propietario: "Andrés Castro" },
    { codigo: "B-402", torre: "Torre B", piso: 4, area: 70, tipo: "apartamento", propietario: "Valentina Ortiz" },
    { codigo: "B-502", torre: "Torre B", piso: 5, area: 88, tipo: "apartamento", propietario: "Felipe Morales" },
    { codigo: "B-602", torre: "Torre B", piso: 6, area: 95, tipo: "apartamento", propietario: "Camila Rojas" },
    { codigo: "LC-01", torre: "Local Comercial", piso: 1, area: 120, tipo: "comercial", propietario: "Comercial del Sur SAS" },
    { codigo: "LC-02", torre: "Local Comercial", piso: 1, area: 85, tipo: "comercial", propietario: "Droguería PAIC" },
    { codigo: "LC-03", torre: "Local Comercial", piso: 1, area: 60, tipo: "comercial", propietario: "Lavandería Eco" },
    { codigo: "OF-201", torre: "Oficinas", piso: 2, area: 150, tipo: "oficina", propietario: "Consultora ABC" },
    { codigo: "OF-202", torre: "Oficinas", piso: 2, area: 100, tipo: "oficina", propietario: "Estudio Jurídico Mora" },
    { codigo: "OF-203", torre: "Oficinas", piso: 2, area: 80, tipo: "oficina", propietario: "Arquidiseño" },
    { codigo: "P-01", torre: "Parqueadero", piso: -1, area: 15, tipo: "parqueadero", propietario: "Carlos Martínez" },
    { codigo: "P-02", torre: "Parqueadero", piso: -1, area: 15, tipo: "parqueadero", propietario: "María Rodríguez" },
    { codigo: "P-03", torre: "Parqueadero", piso: -1, area: 15, tipo: "parqueadero", propietario: "Visitantes" },
    { codigo: "P-04", torre: "Parqueadero", piso: -1, area: 15, tipo: "parqueadero", propietario: "Visitantes" },
  ];

  const { error: e2 } = await db().from("unidades").insert(unidades.map((u) => ({ ...u, copropiedad_id: cid })));
  if (e2) throw new Error(`unidades: ${e2.message}`);
  report.push(`${unidades.length} unidades creadas`);

  const residents = [
    { nombre: "Carlos Martínez", unidad: "A-101", telefono: "3001112233", email: "carlos@email.com", tipo: "propietario" },
    { nombre: "Elena Martínez", unidad: "A-101", telefono: "3001112234", email: "elena@email.com", tipo: "familiar" },
    { nombre: "María Rodríguez", unidad: "A-201", telefono: "3002223344", email: "maria@email.com", tipo: "propietario" },
    { nombre: "Pedro López", unidad: "A-301", telefono: "3003334455", email: "pedro@email.com", tipo: "propietario" },
    { nombre: "Ana Gómez", unidad: "A-401", telefono: "3004445566", email: "ana@email.com", tipo: "propietario" },
    { nombre: "Jorge Ramírez", unidad: "A-501", telefono: "3005556677", email: "jorge@email.com", tipo: "propietario" },
    { nombre: "Lucía Fernández", unidad: "A-601", telefono: "3006667788", email: "lucia@email.com", tipo: "propietario" },
    { nombre: "Diego Torres", unidad: "B-102", telefono: "3007778899", email: "diego@email.com", tipo: "propietario" },
    { nombre: "Sofía Herrera", unidad: "B-202", telefono: "3008889900", email: "sofia@email.com", tipo: "propietario" },
    { nombre: "Andrés Castro", unidad: "B-302", telefono: "3009990011", email: "andres@email.com", tipo: "propietario" },
    { nombre: "Valentina Ortiz", unidad: "B-402", telefono: "3010001122", email: "valentina@email.com", tipo: "propietario" },
    { nombre: "Felipe Morales", unidad: "B-502", telefono: "3011112233", email: "felipe@email.com", tipo: "propietario" },
    { nombre: "Camila Rojas", unidad: "B-602", telefono: "3012223344", email: "camila@email.com", tipo: "propietario" },
    { nombre: "Pedro Sánchez", unidad: "LC-01", telefono: "3013334455", email: "pedro.sanchez@email.com", tipo: "representante" },
    { nombre: "Martha Ríos", unidad: "LC-03", telefono: "3014445566", email: "martha@email.com", tipo: "representante" },
    { nombre: "Roberto Mora", unidad: "OF-202", telefono: "3015556677", email: "roberto@email.com", tipo: "representante" },
  ];
  const { error: e3 } = await db().from("residents").insert(residents.map((r) => ({ ...r, conjunto_id: cid })));
  if (e3) throw new Error(`residents: ${e3.message}`);
  report.push(`${residents.length} residentes creados`);

  const providers = [
    { nombre: "Aseo Total SAS", servicio: "Limpieza", contacto: "Carlos Mera", telefono: "3111000011", email: "contacto@aseototal.com", conjunto_id: cid },
    { nombre: "Seguridad Omega Ltda", servicio: "Vigilancia", contacto: "Coronel Rojas", telefono: "3111000022", email: "omega@seguridad.com", conjunto_id: cid },
    { nombre: "Ascensores Columbia", servicio: "Mantenimiento ascensores", contacto: "Ing. Pérez", telefono: "3111000033", email: "service@columbia.com", conjunto_id: cid },
    { nombre: "Jardinería Verde", servicio: "Jardinería", contacto: "Luis Campo", telefono: "3111000044", email: "info@jardineriaverde.com", conjunto_id: cid },
    { nombre: "ServiPlagas", servicio: "Control de plagas", contacto: "Dr. Rueda", telefono: "3111000055", email: "agenda@serviplagas.com", conjunto_id: cid },
    { nombre: "MantenTech", servicio: "Mantenimiento general", contacto: "Jorge Arango", telefono: "3111000066", email: "manten@mantentech.com", conjunto_id: cid },
    { nombre: "Claro Colombia", servicio: "Internet y telefonía", contacto: "Ejecutivo", telefono: "3111000077", email: "empresas@claro.com", conjunto_id: cid },
    { nombre: "Codensa", servicio: "Energía eléctrica", contacto: "Atención", telefono: "3111000088", email: "servicio@codensa.com", conjunto_id: cid },
  ];
  const { error: e4 } = await db().from("providers").insert(providers.map((p) => ({ ...p, conjunto_id: cid })));
  if (e4) throw new Error(`providers: ${e4.message}`);
  report.push(`${providers.length} proveedores creados`);

  const staff = [
    { nombre: "Jorge Mendoza", cargo: "Administrador", telefono: "3120000001", email: "admin@copropiedadpaic.com", horario: "Lun-Vie 8am-5pm", conjunto_id: cid },
    { nombre: "Alberto Rincón", cargo: "Portero", telefono: "3120000002", email: "porteria@copropiedadpaic.com", horario: "Lun-Dom 6am-2pm", conjunto_id: cid },
    { nombre: "Manuel Suárez", cargo: "Portero", telefono: "3120000003", email: "porteria2@copropiedadpaic.com", horario: "Lun-Dom 2pm-10pm", conjunto_id: cid },
    { nombre: "Rosa Martínez", cargo: "Conserje", telefono: "3120000004", email: "aseo@copropiedadpaic.com", horario: "Lun-Sab 7am-3pm", conjunto_id: cid },
    { nombre: "Pedro Aguirre", cargo: "Jardinero", telefono: "3120000005", email: "jardin@copropiedadpaic.com", horario: "Lun-Vie 6am-12pm", conjunto_id: cid },
  ];
  const { error: e5 } = await db().from("internal_staff").insert(staff);
  if (e5) throw new Error(`internal_staff: ${e5.message}`);
  report.push(`${staff.length} empleados creados`);

  const incomes = [
    { concepto: "Expensas enero - A-101", monto: 320000, fecha: "2026-01-10", categoria: "expensas", estado: "pagado", conjunto_id: cid },
    { concepto: "Expensas enero - A-201", monto: 340000, fecha: "2026-01-10", categoria: "expensas", estado: "pagado", conjunto_id: cid },
    { concepto: "Expensas enero - A-301", monto: 380000, fecha: "2026-01-12", categoria: "expensas", estado: "pagado", conjunto_id: cid },
    { concepto: "Expensas enero - A-401", monto: 330000, fecha: "2026-01-10", categoria: "expensas", estado: "pagado", conjunto_id: cid },
    { concepto: "Expensas enero - A-501", monto: 400000, fecha: "2026-01-11", categoria: "expensas", estado: "pagado", conjunto_id: cid },
    { concepto: "Expensas enero - A-601", monto: 420000, fecha: "2026-01-10", categoria: "expensas", estado: "pagado", conjunto_id: cid },
    { concepto: "Expensas enero - B-102", monto: 310000, fecha: "2026-01-10", categoria: "expensas", estado: "pagado", conjunto_id: cid },
    { concepto: "Expensas enero - B-202", monto: 350000, fecha: "2026-01-13", categoria: "expensas", estado: "pagado", conjunto_id: cid },
    { concepto: "Expensas enero - B-302", monto: 370000, fecha: "2026-01-10", categoria: "expensas", estado: "pagado", conjunto_id: cid },
    { concepto: "Expensas enero - B-402", monto: 330000, fecha: "2026-01-14", categoria: "expensas", estado: "pagado", conjunto_id: cid },
    { concepto: "Expensas enero - B-502", monto: 390000, fecha: "2026-01-10", categoria: "expensas", estado: "pagado", conjunto_id: cid },
    { concepto: "Expensas enero - B-602", monto: 410000, fecha: "2026-01-11", categoria: "expensas", estado: "pagado", conjunto_id: cid },
    { concepto: "Arriendo Local LC-01", monto: 1500000, fecha: "2026-01-05", categoria: "arriendo", estado: "pagado", conjunto_id: cid },
    { concepto: "Arriendo Local LC-02", monto: 1200000, fecha: "2026-01-05", categoria: "arriendo", estado: "pagado", conjunto_id: cid },
    { concepto: "Multa mal parqueo", monto: 100000, fecha: "2026-01-20", categoria: "multa", estado: "pagado", conjunto_id: cid },
    { concepto: "Expensas febrero - A-101", monto: 320000, fecha: "2026-02-10", categoria: "expensas", estado: "pagado", conjunto_id: cid },
    { concepto: "Expensas febrero - A-201", monto: 340000, fecha: "2026-02-10", categoria: "expensas", estado: "pagado", conjunto_id: cid },
    { concepto: "Expensas febrero - A-301", monto: 380000, fecha: "2026-02-12", categoria: "expensas", estado: "pagado", conjunto_id: cid },
    { concepto: "Expensas febrero - A-401", monto: 330000, fecha: "2026-02-10", categoria: "expensas", estado: "pagado", conjunto_id: cid },
    { concepto: "Expensas febrero - A-501", monto: 400000, fecha: "2026-02-11", categoria: "expensas", estado: "pagado", conjunto_id: cid },
    { concepto: "Expensas febrero - A-601", monto: 420000, fecha: "2026-02-10", categoria: "expensas", estado: "pagado", conjunto_id: cid },
    { concepto: "Expensas febrero - B-102", monto: 310000, fecha: "2026-02-10", categoria: "expensas", estado: "pagado", conjunto_id: cid },
    { concepto: "Expensas febrero - B-202", monto: 350000, fecha: "2026-02-13", categoria: "expensas", estado: "pagado", conjunto_id: cid },
    { concepto: "Expensas febrero - B-302", monto: 370000, fecha: "2026-02-10", categoria: "expensas", estado: "pagado", conjunto_id: cid },
    { concepto: "Expensas febrero - B-402", monto: 330000, fecha: "2026-02-14", categoria: "expensas", estado: "pagado", conjunto_id: cid },
    { concepto: "Expensas febrero - B-502", monto: 390000, fecha: "2026-02-10", categoria: "expensas", estado: "pagado", conjunto_id: cid },
    { concepto: "Expensas febrero - B-602", monto: 410000, fecha: "2026-02-11", categoria: "expensas", estado: "pagado", conjunto_id: cid },
  ];
  const { error: e6 } = await db().from("incomes").insert(incomes.map((r) => ({ ...r, created_at: now })));
  if (e6) throw new Error(`incomes: ${e6.message}`);
  report.push(`${incomes.length} ingresos creados`);

  const expenses = [
    { concepto: "Nómina empleados enero", monto: 4500000, fecha: "2026-01-30", categoria: "nomina", proveedor: "Interno", conjunto_id: cid },
    { concepto: "Servicio de agua enero", monto: 850000, fecha: "2026-01-15", categoria: "servicios", proveedor: "EAAB", conjunto_id: cid },
    { concepto: "Servicio de luz enero", monto: 1200000, fecha: "2026-01-15", categoria: "servicios", proveedor: "Codensa", conjunto_id: cid },
    { concepto: "Internet enero", monto: 240000, fecha: "2026-01-10", categoria: "servicios", proveedor: "Claro", conjunto_id: cid },
    { concepto: "Mantenimiento ascensor", monto: 650000, fecha: "2026-01-20", categoria: "mantenimiento", proveedor: "Ascensores Columbia", conjunto_id: cid },
    { concepto: "Control de plagas mensual", monto: 180000, fecha: "2026-01-05", categoria: "mantenimiento", proveedor: "ServiPlagas", conjunto_id: cid },
    { concepto: "Jardinería enero", monto: 350000, fecha: "2026-01-25", categoria: "mantenimiento", proveedor: "Jardinería Verde", conjunto_id: cid },
    { concepto: "Productos de limpieza", monto: 120000, fecha: "2026-01-08", categoria: "insumos", proveedor: "Aseo Total", conjunto_id: cid },
    { concepto: "Nómina empleados febrero", monto: 4500000, fecha: "2026-02-28", categoria: "nomina", proveedor: "Interno", conjunto_id: cid },
    { concepto: "Servicio de agua febrero", monto: 780000, fecha: "2026-02-15", categoria: "servicios", proveedor: "EAAB", conjunto_id: cid },
    { concepto: "Servicio de luz febrero", monto: 1100000, fecha: "2026-02-15", categoria: "servicios", proveedor: "Codensa", conjunto_id: cid },
    { concepto: "Internet febrero", monto: 240000, fecha: "2026-02-10", categoria: "servicios", proveedor: "Claro", conjunto_id: cid },
    { concepto: "Seguro de la copropiedad", monto: 1200000, fecha: "2026-02-01", categoria: "seguros", proveedor: "Seguros Suramericana", conjunto_id: cid },
    { concepto: "Mantenimiento bombas de agua", monto: 450000, fecha: "2026-02-18", categoria: "mantenimiento", proveedor: "MantenTech", conjunto_id: cid },
  ];
  const { error: e7 } = await db().from("expenses").insert(expenses.map((r) => ({ ...r, created_at: now })));
  if (e7) throw new Error(`expenses: ${e7.message}`);
  report.push(`${expenses.length} gastos creados`);

  const tasks = [
    { titulo: "Revisar bombas de agua", descripcion: "Inspección mensual del cuarto de bombas", prioridad: "alta", fecha_limite: "2026-07-20", responsable: "MantenTech", estado: "pendiente", conjunto_id: cid },
    { titulo: "Podar jardines frontales", descripcion: "Mantenimiento de zonas verdes entrada principal", prioridad: "media", fecha_limite: "2026-07-18", responsable: "Pedro Aguirre", estado: "pendiente", conjunto_id: cid },
    { titulo: "Cambio de bombillos pasillos", descripcion: "Reemplazar 5 bombillos fundidos en pasillo Torre A", prioridad: "baja", fecha_limite: "2026-07-25", responsable: "MantenTech", estado: "pendiente", conjunto_id: cid },
    { titulo: "Revisión extintores", descripcion: "Verificar fecha de vencimiento de todos los extintores", prioridad: "alta", fecha_limite: "2026-08-01", responsable: "Jorge Mendoza", estado: "pendiente", conjunto_id: cid },
    { titulo: "Limpieza tanques de agua", descripcion: "Limpieza semestral de tanques de almacenamiento", prioridad: "alta", fecha_limite: "2026-07-30", responsable: "Aseo Total SAS", estado: "pendiente", conjunto_id: cid },
    { titulo: "Cobrar expensas atrasadas", descripcion: "Enviar recordatorios a unidades morosas", prioridad: "alta", fecha_limite: "2026-07-15", responsable: "Jorge Mendoza", estado: "pendiente", conjunto_id: cid },
  ];
  const { error: e8 } = await db().from("tasks").insert(tasks.map((r) => ({ ...r, created_at: now })));
  if (e8) throw new Error(`tasks: ${e8.message}`);
  report.push(`${tasks.length} tareas creadas`);

  const visitorLogs = [
    { nombre: "Luis Torres", documento: "CC 79456231", unidad: "A-101", motivo: "Visita familiar", fecha: "2026-07-10", hora_ingreso: "10:30", hora_salida: "13:45", estado: "completada", conjunto_id: cid },
    { nombre: "Ana Rivera", documento: "CC 52874196", unidad: "B-302", motivo: "Amigos", fecha: "2026-07-10", hora_ingreso: "14:00", hora_salida: "18:30", estado: "completada", conjunto_id: cid },
    { nombre: "Técnico Claro", documento: "CC 11234567", unidad: "A-501", motivo: "Instalación internet", fecha: "2026-07-11", hora_ingreso: "09:00", hora_salida: "10:15", estado: "completada", conjunto_id: cid },
    { nombre: "Carlos Mera", documento: "CC 33456789", unidad: "General", motivo: "Supervisión limpieza", fecha: "2026-07-12", hora_ingreso: "08:00", hora_salida: "11:00", estado: "completada", conjunto_id: cid },
    { nombre: "Mensajería Rappi", documento: "CC 98765432", unidad: "A-201", motivo: "Entrega domicilio", fecha: "2026-07-13", hora_ingreso: "12:15", hora_salida: "12:20", estado: "completada", conjunto_id: cid },
    { nombre: "Marta Jiménez", documento: "CC 45678912", unidad: "B-102", motivo: "Visita familiar", fecha: now.slice(0, 10), hora_ingreso: "15:00", estado: "activa", conjunto_id: cid },
  ];
  const { error: e9 } = await db().from("visitor_logs").insert(visitorLogs);
  if (e9) throw new Error(`visitor_logs: ${e9.message}`);
  report.push(`${visitorLogs.length} visitas creadas`);

  const packages = [
    { descripcion: "Caja grande Amazon", destinatario: "Carlos Martínez", unidad: "A-101", fecha: "2026-07-10", estado: "entregado", conjunto_id: cid },
    { descripcion: "Sobre Mercado Libre", destinatario: "Ana Gómez", unidad: "A-401", fecha: "2026-07-11", estado: "entregado", conjunto_id: cid },
    { descripcion: "Paquete Falabella", destinatario: "Diego Torres", unidad: "B-102", fecha: "2026-07-12", estado: "entregado", conjunto_id: cid },
    { descripcion: "Caja mediana (electrodoméstico)", destinatario: "Felipe Morales", unidad: "B-502", fecha: now.slice(0, 10), estado: "recibido", conjunto_id: cid },
    { descripcion: "Sobre documentos legales", destinatario: "Estudio Jurídico Mora", unidad: "OF-202", fecha: now.slice(0, 10), estado: "recibido", conjunto_id: cid },
  ];
  const { error: e10 } = await db().from("package_logs").insert(packages);
  if (e10) throw new Error(`package_logs: ${e10.message}`);
  report.push(`${packages.length} paquetes creados`);

  const dueDates = [
    { concepto: "Declaración de renta", fecha_vencimiento: "2026-08-15", monto: 0, estado: "pendiente", conjunto_id: cid },
    { concepto: "Renovación seguro copropiedad", fecha_vencimiento: "2026-09-01", monto: 1200000, estado: "pendiente", conjunto_id: cid },
    { concepto: "Pago impuesto predial", fecha_vencimiento: "2026-10-20", monto: 3800000, estado: "pendiente", conjunto_id: cid },
    { concepto: "Asamblea anual de propietarios", fecha_vencimiento: "2027-03-15", monto: 0, estado: "pendiente", conjunto_id: cid },
    { concepto: "Licencia de bomberos", fecha_vencimiento: "2026-12-31", monto: 450000, estado: "pendiente", conjunto_id: cid },
    { concepto: "Certificado uso del suelo", fecha_vencimiento: "2026-11-30", monto: 280000, estado: "pendiente", conjunto_id: cid },
    { concepto: "Expensas febrero", fecha_vencimiento: "2026-02-15", monto: 0, estado: "completado", conjunto_id: cid },
    { concepto: "Expensas enero", fecha_vencimiento: "2026-01-15", monto: 0, estado: "completado", conjunto_id: cid },
    { concepto: "Revisión técnica ascensores", fecha_vencimiento: "2026-06-30", monto: 0, estado: "completado", conjunto_id: cid },
  ];
  const { error: e11 } = await db().from("due_dates").insert(dueDates.map((r) => ({ ...r, created_at: now })));
  if (e11) throw new Error(`due_dates: ${e11.message}`);
  report.push(`${dueDates.length} vencimientos creados`);

  const areas = [
    { nombre: "Salón Social", descripcion: "Salón principal para eventos y reuniones", capacidad: 80, horario: "8:00 - 22:00", estado: "disponible", conjunto_id: cid },
    { nombre: "Piscina", descripcion: "Piscina para adultos y niños", capacidad: 40, horario: "6:00 - 20:00", estado: "disponible", conjunto_id: cid },
    { nombre: "Gimnasio", descripcion: "Equipado con máquinas de cardio y pesas", capacidad: 15, horario: "5:00 - 22:00", estado: "disponible", conjunto_id: cid },
    { nombre: "Parque Infantil", descripcion: "Zona de juegos para niños", capacidad: 20, horario: "7:00 - 19:00", estado: "disponible", conjunto_id: cid },
    { nombre: "Cancha Múltiple", descripcion: "Cancha de baloncesto, fútbol y voleibol", capacidad: 30, horario: "6:00 - 21:00", estado: "disponible", conjunto_id: cid },
  ];
  const { error: e12 } = await db().from("common_areas").insert(areas.map((r) => ({ ...r, created_at: now })));
  if (e12) throw new Error(`common_areas: ${e12.message}`);
  report.push(`${areas.length} áreas comunes creadas`);

  const reservations = [
    { residente: "Carlos Martínez", unidad: "A-101", area_id: "Salón Social", fecha: "2026-07-20", hora_inicio: "14:00", hora_fin: "18:00", estado: "confirmada", conjunto_id: cid },
    { residente: "María Rodríguez", unidad: "A-201", area_id: "Piscina", fecha: "2026-07-15", hora_inicio: "10:00", hora_fin: "12:00", estado: "confirmada", conjunto_id: cid },
    { residente: "Lucía Fernández", unidad: "A-601", area_id: "Salón Social", fecha: "2026-07-25", hora_inicio: "16:00", hora_fin: "22:00", estado: "pendiente", conjunto_id: cid },
    { residente: "Diego Torres", unidad: "B-102", area_id: "Cancha Múltiple", fecha: "2026-07-16", hora_inicio: "08:00", hora_fin: "10:00", estado: "confirmada", conjunto_id: cid },
    { residente: "Andrés Castro", unidad: "B-302", area_id: "Gimnasio", fecha: "2026-07-14", hora_inicio: "06:00", hora_fin: "07:30", estado: "completada", conjunto_id: cid },
  ];
  const { error: e13 } = await db().from("reservations").insert(reservations.map((r) => ({ ...r, created_at: now })));
  if (e13) throw new Error(`reservations: ${e13.message}`);
  report.push(`${reservations.length} reservaciones creadas`);

  const camaras = [
    { nombre: "Entrada Principal", ubicacion: "Portal de acceso vehicular", tipo: "exterior", url_rtsp: "rtsp://camera-entrada.local/stream", estado: "activa", conjunto_id: cid },
    { nombre: "Hall Torre A", ubicacion: "Lobby torre A", tipo: "interior", url_rtsp: "rtsp://camera-hall-a.local/stream", estado: "activa", conjunto_id: cid },
    { nombre: "Hall Torre B", ubicacion: "Lobby torre B", tipo: "interior", url_rtsp: "rtsp://camera-hall-b.local/stream", estado: "activa", conjunto_id: cid },
    { nombre: "Parqueadero", ubicacion: "Sótano parqueadero", tipo: "interior", url_rtsp: "rtsp://camera-parking.local/stream", estado: "activa", conjunto_id: cid },
    { nombre: "Zona de piscina", ubicacion: "Área de piscina", tipo: "exterior", url_rtsp: "rtsp://camera-pool.local/stream", estado: "mantenimiento", conjunto_id: cid },
    { nombre: "Salón Social", ubicacion: "Interior del salón comunal", tipo: "interior", url_rtsp: "rtsp://camera-salona.local/stream", estado: "activa", conjunto_id: cid },
  ];
  const { error: e14 } = await db().from("camaras").insert(camaras.map((r) => ({ ...r, created_at: now })));
  if (e14) throw new Error(`camaras: ${e14.message}`);
  report.push(`${camaras.length} cámaras creadas`);

  const contenidos = [
    { titulo: "Bienvenidos al nuevo año", cuerpo: "La administración les desea un feliz año 2026 a todos los residentes. Recordamos mantener las zonas comunes limpias.", tipo: "informativo", estado: "publicado", autor: "Administración", fecha_publicacion: "2026-01-01", conjunto_id: cid },
    { titulo: "Mantenimiento de piscina", cuerpo: "La piscina estará cerrada el 15 y 16 de julio por mantenimiento general. Disculpen las molestias.", tipo: "alerta", estado: "publicado", autor: "Jorge Mendoza", fecha_publicacion: "2026-07-10", conjunto_id: cid },
    { titulo: "Feria de emprendimiento", cuerpo: "Los invitamos a la feria de emprendimiento el sábado 25 de julio en el Salón Social. Habrá productos artesanales, comida y música.", tipo: "evento", estado: "publicado", autor: "Consejo", fecha_publicacion: "2026-07-05", conjunto_id: cid },
    { titulo: "Recordatorio cuota extraordinaria", cuerpo: "Se recuerda a los propietarios que el plazo para pagar la cuota extraordinaria de pintura de fachadas vence el 31 de julio.", tipo: "aviso", estado: "publicado", autor: "Administración", fecha_publicacion: "2026-07-01", conjunto_id: cid },
    { titulo: "Informativo: Nueva empresa de aseo", cuerpo: "A partir de agosto, la empresa Aseo Total SAS asumirá el servicio de limpieza de zonas comunes.", tipo: "informativo", estado: "borrador", autor: "Administración", fecha_publicacion: null, conjunto_id: cid },
  ];
  const { error: e15 } = await db().from("carteleria_contenidos").insert(contenidos.map((r) => ({ ...r, created_at: now })));
  if (e15) throw new Error(`carteleria_contenidos: ${e15.message}`);
  report.push(`${contenidos.length} contenidos de cartelera creados`);

  return report;
}

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const report = await seed();
    res.status(200).json({ success: true, report });
  } catch (error: any) {
    res.status(500).json({ error: error?.message ?? "Error al sembrar datos" });
  }
}
