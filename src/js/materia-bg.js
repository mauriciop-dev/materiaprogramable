/**
 * Materia Background - Three.js visualization based on article content
 * Generated based on analysis of: La materia como software: Introducción a la realidad reconfigurable
 */

// Configuration based on article analysis
const materiaConfig = {
  // Forma: network (representing interconnected catoms/claytronic atoms)
  shape: 'network',
  
  // Movimiento: pulsing (representing biological-like emergent behavior and self-repair)
  movement: 'pulsing',
  
  // Paleta de Colores: Cian/Púrpura (ciencia ficción y tecnología avanzada)
  colors: {
    primary: '#00ffff', // Cian
    secondary: '#8a2be2', // Azul violeta/Púrpura
    accent: '#ff00ff'   // Magenta para destellos
  },
  
  // Parámetros específicos basado en el contenido
  particleCount: 150,   // Número de "catoms" en la visualización
  clusterSize: 8,       // Grupos que forman estructuras más grandes
  pulseSpeed: 1.5,      // Velocidad del pulso (emergente/biológico)
  connectionDistance: 40// Distancia para conexiones entre partículas
};

// Exportar configuración para uso en otros scripts
if (typeof window !== 'undefined') {
  window.materiaConfig = materiaConfig;
}

// Exportar para módulos ES (si se usa en otro contexto)
export { materiaConfig };