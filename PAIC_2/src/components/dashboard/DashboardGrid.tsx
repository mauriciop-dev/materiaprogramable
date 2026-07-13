import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import WidgetStats from "./WidgetStats";

export type LayoutItem = { i: string; x: number; y: number; w: number; h: number };

const ALL_WIDGETS: Record<string, { title: string; w: number; h: number }> = {
  residentes: { title: "Residentes", w: 1, h: 1 },
  unidades: { title: "Unidades", w: 1, h: 1 },
  tareas: { title: "Tareas Pendientes", w: 1, h: 1 },
  proveedores: { title: "Proveedores", w: 1, h: 1 },
  personal: { title: "Personal", w: 1, h: 1 },
  visitas: { title: "Visitas Hoy", w: 1, h: 1 },
  paquetes: { title: "Paquetes Hoy", w: 1, h: 1 },
  ingresos: { title: "Ingresos", w: 1, h: 1 },
  gastos: { title: "Gastos", w: 1, h: 1 },
  vencimientos: { title: "Vencimientos", w: 1, h: 1 },
};

const WIDGET_IDS = Object.keys(ALL_WIDGETS);

function defaultLayout(): LayoutItem[] {
  return WIDGET_IDS.map((id, i) => ({
    i: id, x: i % 4, y: Math.floor(i / 4), w: ALL_WIDGETS[id].w, h: ALL_WIDGETS[id].h,
  }));
}

function getDefaultWidgets(): Record<string, boolean> {
  return WIDGET_IDS.reduce((acc, id) => ({ ...acc, [id]: true }), {} as Record<string, boolean>);
}

export { ALL_WIDGETS, WIDGET_IDS, defaultLayout, getDefaultWidgets };

export default function DashboardGrid({
  data, activeWidgets, layout, onLayoutChange,
}: {
  data: any;
  activeWidgets: Record<string, boolean>;
  layout: LayoutItem[];
  onLayoutChange: (l: LayoutItem[]) => void;
}) {
  const renderWidget = (id: string) => {
    const vals: Record<string, string | number> = {
      residentes: data?.residentes ?? 0,
      unidades: data?.unidades ?? 0,
      tareas: data?.tareas_pendientes ?? 0,
      proveedores: data?.proveedores ?? 0,
      personal: data?.personal ?? 0,
      visitas: data?.visitas_hoy ?? 0,
      paquetes: data?.paquetes_hoy ?? 0,
      ingresos: `$${(data?.ingresos_mes ?? 0).toLocaleString()}`,
      gastos: `$${(data?.gastos_mes ?? 0).toLocaleString()}`,
      vencimientos: data?.vencimientos ?? 0,
    };

    return (
      <div key={id} style={{ background: "white", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", height: "100%", overflow: "hidden" }}>
        <div className="drag-handle" style={{ height: "24px", cursor: "grab", background: "#f8f9fa", borderBottom: "1px solid #eee", borderRadius: "12px 12px 0 0" }} />
        <WidgetStats title={ALL_WIDGETS[id].title} value={vals[id] ?? 0} />
      </div>
    );
  };

  const visibleLayout = layout.filter((l) => activeWidgets[l.i]);

  return (
    <GridLayout
      layout={visibleLayout}
      gridConfig={{ cols: 4, rowHeight: 120 }}
      dragConfig={{ handle: ".drag-handle" }}
      resizeConfig={{ enabled: false }}
      width={1200}
      onLayoutChange={(l) => onLayoutChange(l as LayoutItem[])}
      autoSize
    >
      {visibleLayout.map((l) => renderWidget(l.i))}
    </GridLayout>
  );
}
