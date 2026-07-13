export const modulo3 = {
  titulo: "Operación Diaria con PAIC",
  lecciones: [
    {
      titulo: "Registro de residentes",
      contenido: `En PAIC puedes gestionar la base de datos de residentes desde el módulo Base de Datos. Cada residente tiene: nombres, unidad, teléfono, email, y tipo (propietario o inquilino). Es importante mantener esta información actualizada para comunicación y seguridad. Los inquilinos deben estar registrados con los datos del propietario como referencia.`,
    },
    {
      titulo: "Control de visitas y paquetes",
      contenido: `El módulo Seguridad permite registrar cada visita que ingresa al conjunto: nombre, documento, unidad visitada, motivo y hora de ingreso. Al salir, se registra la hora de salida. Los paquetes recibidos se registran con descripción, destinatario y unidad, y se marcan como entregados cuando el residente los reclama. Esto mejora la seguridad y el control.`,
    },
    {
      titulo: "Gestión de tareas",
      contenido: `El módulo Tareas funciona como un checklist de pendientes de mantenimiento y gestión. Puedes crear tareas con: título, descripción, prioridad (alta/media/baja), fecha límite, y responsable. Al completar una tarea, se marca con un checkbox. Las tareas vencidas se resaltan visualmente. Es útil para dar seguimiento a reparaciones, inspecciones y obligaciones.`,
    },
  ],
};
