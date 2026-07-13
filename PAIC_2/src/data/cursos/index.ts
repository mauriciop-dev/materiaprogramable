import { modulo1 } from "./modulo-1";
import { modulo2 } from "./modulo-2";
import { modulo3 } from "./modulo-3";

export interface Leccion {
  titulo: string;
  contenido: string;
}

export interface Modulo {
  titulo: string;
  lecciones: Leccion[];
}

export const cursos: Modulo[] = [modulo1, modulo2, modulo3];

export function buscarEnCursos(query: string): string {
  const q = query.toLowerCase();
  const resultados: string[] = [];

  for (const modulo of cursos) {
    for (const leccion of modulo.lecciones) {
      if (
        leccion.titulo.toLowerCase().includes(q) ||
        leccion.contenido.toLowerCase().includes(q)
      ) {
        resultados.push(
          `Módulo: ${modulo.titulo}\nLección: ${leccion.titulo}\n${leccion.contenido}`
        );
      }
    }
  }

  if (resultados.length === 0) {
    return cursos
      .flatMap((m) =>
        m.lecciones.map(
          (l) => `Módulo: ${m.titulo}\nLección: ${l.titulo}\n${l.contenido}`
        )
      )
      .join("\n\n");
  }

  return resultados.join("\n\n");
}

export function obtenerCursoCompleto(): string {
  return cursos
    .map(
      (m) =>
        `## ${m.titulo}\n\n${m.lecciones
          .map(
            (l, i) =>
              `### ${i + 1}. ${l.titulo}\n\n${l.contenido}`
          )
          .join("\n\n")}`
    )
    .join("\n\n");
}
