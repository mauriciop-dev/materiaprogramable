# Update existing articles with animation parameters
import os
import json

# Sample animation params for existing articles (based on topic)
ARTICLE_ANIMATIONS = {
    "la-materia-como-software-realidad-reconfigurable": {
        "theme": "sci-fi",
        "primaryColor": "#00ffff",
        "secondaryColor": "#8b5cf6",
        "particleCount": 2000,
        "shape": "spheres",
        "movement": "orbiting",
        "speed": 1.0,
        "interaction": "mouse",
        "cameraMode": "auto-rotate",
        "specialEffects": "glow",
    },
    "de-los-laboratorios-al-mundo-real-avances": {
        "theme": "geometric",
        "primaryColor": "#06b6d4",
        "secondaryColor": "#7c3aed",
        "particleCount": 1500,
        "shape": "cubes",
        "movement": "pulsing",
        "speed": 0.8,
        "interaction": "mouse",
        "cameraMode": "orbit",
        "specialEffects": "wireframe",
    },
    "economia-bits-atomos-impacto-vida-cotidiana": {
        "theme": "geometric",
        "primaryColor": "#22d3ee",
        "secondaryColor": "#a78bfa",
        "particleCount": 1800,
        "shape": "particles",
        "movement": "flowing",
        "speed": 1.2,
        "interaction": "mouse-scroll",
        "cameraMode": "auto-rotate",
        "specialEffects": "trails",
    },
    "la-evolucion-de-la-materia-programable-2026": {
        "theme": "molecular",
        "primaryColor": "#14b8a6",
        "secondaryColor": "#8b5cf6",
        "particleCount": 2500,
        "shape": "helix",
        "movement": "orbiting",
        "speed": 0.6,
        "interaction": "mouse",
        "cameraMode": "auto-rotate",
        "specialEffects": "glow",
    },
    "materia-programable-convergencia-ia-nanotecnologia-2026": {
        "theme": "neural",
        "primaryColor": "#ec4899",
        "secondaryColor": "#8b5cf6",
        "particleCount": 2000,
        "shape": "network",
        "movement": "pulsing",
        "speed": 1.5,
        "interaction": "mouse",
        "cameraMode": "orbit",
        "specialEffects": "glow",
    },
    "pensamiento-fisico-digital-latinoamerica": {
        "theme": "organic",
        "primaryColor": "#22d3ee",
        "secondaryColor": "#a78bfa",
        "particleCount": 1200,
        "shape": "network",
        "movement": "floating",
        "speed": 0.7,
        "interaction": "mouse",
        "cameraMode": "static",
        "specialEffects": "solid",
    },
    "materia-programable-diseno-sustentable-morphing-matter-lab": {
        "theme": "organic",
        "primaryColor": "#22d3ee",
        "secondaryColor": "#a78bfa",
        "particleCount": 1500,
        "shape": "waves",
        "movement": "pulsing",
        "speed": 1.0,
        "interaction": "mouse",
        "cameraMode": "auto-rotate",
        "specialEffects": "glow",
    },
    "materia-programable-robotica-blanda-sistema-xprint": {
        "theme": "sci-fi",
        "primaryColor": "#0ea5e9",
        "secondaryColor": "#6366f1",
        "particleCount": 1800,
        "shape": "particles",
        "movement": "flowing",
        "speed": 1.2,
        "interaction": "mouse",
        "cameraMode": "orbit",
        "specialEffects": "trails",
    },
    "materia-programable-frontera-auto-ensamblaje-mit": {
        "theme": "organic",
        "primaryColor": "#0ea5e9",
        "secondaryColor": "#6366f1",
        "particleCount": 2000,
        "shape": "network",
        "movement": "flowing",
        "speed": 0.9,
        "interaction": "mouse",
        "cameraMode": "auto-rotate",
        "specialEffects": "trails",
    },
    "materiales-roboticos-convergencia-materia-computacion": {
        "theme": "mechanical",
        "primaryColor": "#64748b",
        "secondaryColor": "#475569",
        "particleCount": 1500,
        "shape": "cubes",
        "movement": "static",
        "speed": 0.5,
        "interaction": "mouse",
        "cameraMode": "orbit",
        "specialEffects": "wireframe",
    },
    "materia-robotica-enfoque-correll-lab": {
        "theme": "mechanical",
        "primaryColor": "#64748b",
        "secondaryColor": "#475569",
        "particleCount": 1800,
        "shape": "cubes",
        "movement": "orbiting",
        "speed": 0.8,
        "interaction": "mouse",
        "cameraMode": "orbit",
        "specialEffects": "wireframe",
    },
    "materia-programable-robotica-blanda-impresion-3d-wyss": {
        "theme": "molecular",
        "primaryColor": "#14b8a6",
        "secondaryColor": "#8b5cf6",
        "particleCount": 2000,
        "shape": "helix",
        "movement": "floating",
        "speed": 0.7,
        "interaction": "mouse",
        "cameraMode": "auto-rotate",
        "specialEffects": "transparent",
    },
    "nanofabricacion-adn-nueva-frontera-materia-programable": {
        "theme": "molecular",
        "primaryColor": "#14b8a6",
        "secondaryColor": "#8b5cf6",
        "particleCount": 2500,
        "shape": "helix",
        "movement": "swarming",
        "speed": 1.0,
        "interaction": "mouse",
        "cameraMode": "auto-rotate",
        "specialEffects": "glow",
    },
    "materia-programable-cuantica-disenando-realidad": {
        "theme": "sci-fi",
        "primaryColor": "#00ffff",
        "secondaryColor": "#8b5cf6",
        "particleCount": 3000,
        "shape": "custom-shader-wave",
        "movement": "quantum-swarm",
        "speed": 1.2,
        "interaction": "mouse",
        "cameraMode": "auto-rotate",
        "specialEffects": "custom-shader-glow",
    },
    "materia-programable-convergencia-global-2026": {
        "theme": "sci-fi",
        "primaryColor": "#0ea5e9",
        "secondaryColor": "#6366f1",
        "particleCount": 2000,
        "shape": "instanced-nodes",
        "movement": "quantum-swarm",
        "speed": 0.9,
        "interaction": "mouse",
        "cameraMode": "orbit",
        "specialEffects": "custom-shader-glow",
    },
    "2026-despertar-materia-programable": {
        "theme": "molecular",
        "primaryColor": "#14b8a6",
        "secondaryColor": "#8b5cf6",
        "particleCount": 2500,
        "shape": "fluid-atoms",
        "movement": "flowing",
        "speed": 1.0,
        "interaction": "mouse",
        "cameraMode": "auto-rotate",
        "specialEffects": "transparent-glass",
    },
    "harbin-vs-correll-lab-duelo-materia-programable": {
        "theme": "mechanical",
        "primaryColor": "#64748b",
        "secondaryColor": "#475569",
        "particleCount": 800,
        "shape": "instanced-cubes",
        "movement": "self-assembly",
        "speed": 1.0,
        "interaction": "mouse",
        "cameraMode": "orbit",
        "specialEffects": "wireframe-instanced",
    },
    "inteligencia-fisica-computacion-neuromorfica-materia": {
        "theme": "neural",
        "primaryColor": "#ec4899",
        "secondaryColor": "#8b5cf6",
        "particleCount": 800,
        "shape": "instanced-nodes",
        "movement": "quantum-swarm",
        "speed": 1.2,
        "interaction": "mouse",
        "cameraMode": "auto-rotate",
        "specialEffects": "custom-shader-glow",
    },
    "actuadores-biestables-robotica-multimodal-eficiencia": {
        "theme": "mechanical",
        "primaryColor": "#06b6d4",
        "secondaryColor": "#7c3aed",
        "particleCount": 800,
        "shape": "instanced-cubes",
        "movement": "self-assembly",
        "speed": 0.8,
        "interaction": "mouse",
        "cameraMode": "orbit",
        "specialEffects": "wireframe-instanced",
    },
    "motores-moleculares-autonomos-dirigidos-por-luz": {
        "theme": "molecular",
        "primaryColor": "#14b8a6",
        "secondaryColor": "#8b5cf6",
        "particleCount": 3000,
        "shape": "fluid-atoms",
        "movement": "quantum-swarm",
        "speed": 1.5,
        "interaction": "mouse",
        "cameraMode": "auto-rotate",
        "specialEffects": "custom-shader-glow",
    },
    "naves-mutantes-limpieza-espacial-materia-programable": {
        "theme": "sci-fi",
        "primaryColor": "#00ffff",
        "secondaryColor": "#8b5cf6",
        "particleCount": 3000,
        "shape": "magnetic-field",
        "movement": "morphing",
        "speed": 1.0,
        "interaction": "mouse",
        "cameraMode": "auto-rotate",
        "specialEffects": "custom-shader-glow",
    },
    "materia-programable-robotica-enjambre-correll-lab": {
        "theme": "mechanical",
        "primaryColor": "#64748b",
        "secondaryColor": "#475569",
        "particleCount": 800,
        "shape": "instanced-nodes",
        "movement": "quantum-swarm",
        "speed": 1.0,
        "interaction": "mouse",
        "cameraMode": "orbit",
        "specialEffects": "wireframe-instanced",
    },
}


def add_animation_to_article(file_path, slug, anim_params):
    if slug not in ARTICLE_ANIMATIONS:
        return False

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    if "animation:" in content:
        print(f"Skipping {slug} - already has animation")
        return True

    # Insert animation block before ---
    anim_block = f"""animation:
  theme: '{anim_params["theme"]}'
  primaryColor: '{anim_params["primaryColor"]}'
  secondaryColor: '{anim_params["secondaryColor"]}'
  particleCount: {anim_params["particleCount"]}
  shape: '{anim_params["shape"]}'
  movement: '{anim_params["movement"]}'
  speed: {anim_params["speed"]}
  interaction: '{anim_params["interaction"]}'
  cameraMode: '{anim_params["cameraMode"]}'
  specialEffects: '{anim_params["specialEffects"]}'
"""
    if content.startswith("---"):
        parts = content.split("---", 2)
        if len(parts) >= 3:
            new_content = parts[0] + "---" + parts[1].rstrip() + "\n" + anim_block + "---" + parts[2]
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"Updated: {slug}")
            return True

    return False


def main():
    blog_dir = r"C:\Users\micnu\OneDrive\PROYECTOS\MateriaProgramable\materiaprogramable\src\content\blog"
    en_dir = os.path.join(blog_dir, "en")

    updated = 0

    # Spanish articles
    for slug, params in ARTICLE_ANIMATIONS.items():
        file_path = os.path.join(blog_dir, f"{slug}.md")
        if os.path.exists(file_path):
            if add_animation_to_article(file_path, slug, params):
                updated += 1

    # English articles - map to Spanish equivalents
    english_map = {
        "programmable-matter-convergence-ai-nanotechnology-2026": "materia-programable-convergencia-ia-nanotecnologia-2026",
        "programmable-matter-self-assembly-mit": "materia-programable-frontera-auto-ensamblaje-mit",
        "programmable-matter-soft-robotics-xprint-system": "materia-programable-robotica-blanda-sistema-xprint",
        "programmable-matter-sustainable-design-morphing-matter-lab": "materia-programable-diseno-sustentable-morphing-matter-lab",
        "robotic-materials-convergence-matter-computation": "materiales-roboticos-convergencia-materia-computacion",
        "robotic-materials-correll-lab-approach": "materia-robotica-enfoque-correll-lab",
        "programmable-matter-soft-robotics-advances-wyss": "materia-programable-robotica-blanda-impresion-3d-wyss",
        "dna-nanofabrication-new-frontier-programmable-matter": "nanofabricacion-adn-nueva-frontera-materia-programable",
        "quantum-programmable-matter-designing-reality": "materia-programable-cuantica-disenando-realidad",
        "programmable-matter-global-convergence-2026": "materia-programable-convergencia-global-2026",
        "programmable-matter-introduction": "la-materia-como-software-realidad-reconfigurable",
        "programmable-matter-swarm-robotics-correll-lab": "materia-programable-robotica-enjambre-correll-lab",
        "harbin-vs-correll-lab-duel-programmable-matter": "harbin-vs-correll-lab-duelo-materia-programable",
    }

    for en_slug, es_slug in english_map.items():
        file_path = os.path.join(en_dir, f"{en_slug}.md")
        if os.path.exists(file_path) and es_slug in ARTICLE_ANIMATIONS:
            if add_animation_to_article(
                file_path, en_slug, ARTICLE_ANIMATIONS[es_slug]
            ):
                updated += 1

    print(f"\nTotal updated: {updated} articles")


if __name__ == "__main__":
    main()
