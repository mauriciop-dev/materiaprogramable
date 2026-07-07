# Article Analyzer for Programmable Matter Blog
# Hybrid system: tries API first, falls back to local keyword analysis

import os
import json
import requests
import re

OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY", "")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")

# Local keyword-based parameter mapping
KEYWORD_MAPPINGS = {
    "claytronics": {
        "theme": "sci-fi",
        "shape": "instanced-cubes",
        "movement": "self-assembly",
        "special_effects": "custom-shader-glow",
    },
    "nanobot": {
        "theme": "molecular",
        "shape": "instanced-nodes",
        "movement": "quantum-swarm",
        "special_effects": "custom-shader-glow",
    },
    "dna": {
        "theme": "molecular",
        "shape": "dna-helix",
        "movement": "orbiting",
        "special_effects": "custom-shader-glow",
    },
    "impresion 4d": {
        "theme": "geometric",
        "shape": "instanced-cubes",
        "movement": "self-assembly",
        "special_effects": "wireframe-instanced",
    },
    "4d printing": {
        "theme": "geometric",
        "shape": "instanced-cubes",
        "movement": "self-assembly",
        "special_effects": "wireframe-instanced",
    },
    "self-assembly": {
        "theme": "organic",
        "shape": "instanced-cubes",
        "movement": "self-assembly",
        "special_effects": "custom-shader-glow",
    },
    "morphing": {
        "theme": "sci-fi",
        "shape": "morphing-blob",
        "movement": "morphing",
        "special_effects": "custom-shader-glow",
    },
    "soft robotics": {
        "theme": "organic",
        "shape": "fluid-atoms",
        "movement": "flowing",
        "special_effects": "transparent-glass",
    },
    "robotics": {
        "theme": "mechanical",
        "shape": "instanced-cubes",
        "movement": "self-assembly",
        "special_effects": "wireframe-instanced",
    },
    "harvard": {
        "theme": "scientific",
        "shape": "instanced-nodes",
        "movement": "orbiting",
        "special_effects": "custom-shader-glow",
    },
    "mit": {
        "theme": "sci-fi",
        "shape": "particles",
        "movement": "flowing",
        "special_effects": "gpu-trails",
    },
    "berkeley": {
        "theme": "organic",
        "shape": "custom-shader-wave",
        "movement": "morphing",
        "special_effects": "custom-shader-glow",
    },
    "correll": {
        "theme": "mechanical",
        "shape": "instanced-cubes",
        "movement": "self-assembly",
        "special_effects": "wireframe-instanced",
    },
    "wyss": {
        "theme": "molecular",
        "shape": "fluid-atoms",
        "movement": "quantum-swarm",
        "special_effects": "custom-shader-glow",
    },
    "medical": {
        "theme": "organic",
        "shape": "fluid-atoms",
        "movement": "flowing",
        "special_effects": "transparent-glass",
    },
    "medicine": {
        "theme": "organic",
        "shape": "fluid-atoms",
        "movement": "flowing",
        "special_effects": "transparent-glass",
    },
    "ai": {
        "theme": "neural",
        "shape": "instanced-nodes",
        "movement": "quantum-swarm",
        "special_effects": "custom-shader-glow",
    },
    "inteligencia": {
        "theme": "neural",
        "shape": "instanced-nodes",
        "movement": "quantum-swarm",
        "special_effects": "custom-shader-glow",
    },
    "bit": {
        "theme": "geometric",
        "shape": "instanced-cubes",
        "movement": "self-assembly",
        "special_effects": "gpu-trails",
    },
    "atomo": {
        "theme": "molecular",
        "shape": "fluid-atoms",
        "movement": "quantum-swarm",
        "special_effects": "custom-shader-glow",
    },
    "latinoamerica": {
        "theme": "organic",
        "shape": "instanced-nodes",
        "movement": "floating",
        "special_effects": "transparent-glass",
    },
    "magnetic": {
        "theme": "sci-fi",
        "shape": "magnetic-field",
        "movement": "morphing",
        "special_effects": "custom-shader-glow",
    },
    "fluido": {
        "theme": "organic",
        "shape": "fluid-atoms",
        "movement": "flowing",
        "special_effects": "transparent-glass",
    },
    "quantum": {
        "theme": "sci-fi",
        "shape": "custom-shader-wave",
        "movement": "quantum-swarm",
        "special_effects": "custom-shader-glow",
    },
    "cristal": {
        "theme": "geometric",
        "shape": "instanced-cubes",
        "movement": "self-assembly",
        "special_effects": "wireframe-instanced",
    },
    "enjambre": {
        "theme": "molecular",
        "shape": "instanced-nodes",
        "movement": "quantum-swarm",
        "special_effects": "custom-shader-glow",
    },
    "swarm": {
        "theme": "molecular",
        "shape": "instanced-nodes",
        "movement": "quantum-swarm",
        "special_effects": "custom-shader-glow",
    },
    "metamaterial": {
        "theme": "geometric",
        "shape": "instanced-cubes",
        "movement": "self-assembly",
        "special_effects": "wireframe-instanced",
    },
}


def get_local_params(article_text, title):
    """Generate params using local keyword analysis"""
    text_lower = (article_text + " " + title).lower()

    found_params = {}
    for keyword, params in KEYWORD_MAPPINGS.items():
        if keyword in text_lower:
            found_params.update(params)

    # Default params if nothing found
    if not found_params:
        found_params = {
            "theme": "sci-fi",
            "shape": "particles",
            "movement": "floating",
            "special_effects": "glow",
        }

    # Determine colors based on theme
    theme = found_params.get("theme", "sci-fi")
    color_schemes = {
        "sci-fi": {"primary": "#00ffff", "secondary": "#8b5cf6"},
        "organic": {"primary": "#22d3ee", "secondary": "#a78bfa"},
        "geometric": {"primary": "#06b6d4", "secondary": "#7c3aed"},
        "molecular": {"primary": "#14b8a6", "secondary": "#8b5cf6"},
        "mechanical": {"primary": "#64748b", "secondary": "#475569"},
        "neural": {"primary": "#ec4899", "secondary": "#8b5cf6"},
        "scientific": {"primary": "#0ea5e9", "secondary": "#6366f1"},
    }

    colors = color_schemes.get(theme, color_schemes["sci-fi"])

    # Adjust counts based on shape type
    shape = found_params.get("shape", "particles")
    if shape in ("instanced-cubes", "instanced-nodes", "dna-helix"):
        count = 800
    elif shape in ("custom-shader-wave", "magnetic-field", "fluid-atoms"):
        count = 3000
    else:
        count = 1500

    return {
        "theme": theme,
        "primary_color": colors["primary"],
        "secondary_color": colors["secondary"],
        "particle_count": count,
        "shape": shape,
        "movement": found_params.get("movement", "floating"),
        "speed": 1.0,
        "interaction": "mouse",
        "camera_mode": "auto-rotate",
        "special_effects": found_params.get("special_effects", "glow"),
        "description": f"Animation for {title}",
    }


def analyze_article(article_text, title, force_local=False):
    """Try API first, fallback to local"""

    if force_local:
        return get_local_params(article_text, title)

    prompt = """You are a visual design expert specializing in 3D generative graphics for scientific concepts. Generate animation params for this Programmable Matter article.

Title: TITLE
Content: CONTENT

Choose params that best illustrate the article's core concept visually. Match the shape to the subject:
- instanced-cubes: solid structures, metamaterials, modular robotics, self-assembly
- instanced-nodes: networks, neural, swarms, connected systems
- dna-helix: molecular structures, DNA, nanotech, biological
- custom-shader-wave: quantum, waves, energy fields, morphing
- magnetic-field: magnetic, forces, fields, invisible interactions
- fluid-atoms: fluids, liquids, soft robotics, organic, medical
- spheres/particles/cubes/helix/network/waves: fallback traditional shapes

Return JSON only:
{"theme": "sci-fi|organic|geometric|molecular|mechanical|neural|scientific",
"primary_color": "#HEX", "secondary_color": "#HEX",
"particle_count": 500-3000,
"shape": "instanced-cubes|instanced-nodes|dna-helix|custom-shader-wave|magnetic-field|fluid-atoms|spheres|cubes|helix|network|waves|particles",
"movement": "self-assembly|morphing|quantum-swarm|floating|pulsing|flowing|orbiting|swarming|static",
"speed": 0.5-2.0, "interaction": "mouse|none",
"camera_mode": "static|orbit|auto-rotate",
"special_effects": "custom-shader-glow|wireframe-instanced|transparent-glass|gpu-trails|glow|trails|wireframe|solid|transparent",
"description": "brief description"}
"""

    prompt = prompt.replace("TITLE", title).replace("CONTENT", article_text[:1500])

    # Try OpenRouter
    try:
        resp = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "google/gemini-2.0-flash-001",
                "max_tokens": 512,
                "messages": [{"role": "user", "content": prompt}],
            },
            timeout=20,
        )
        if resp.status_code == 200:
            text = resp.json()["choices"][0]["message"]["content"]
            start, end = text.find("{"), text.rfind("}")
            if start >= 0 and end > 0:
                params = json.loads(text[start : end + 1])
                print(f"API success: {title}")
                return params
    except Exception as e:
        print(f"API attempt failed: {str(e)[:50]}")

    # Fallback to local
    print(f"Using local analysis: {title}")
    return get_local_params(article_text, title)


def process_article(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    title = "Untitled"
    body = content

    if content.startswith("---"):
        parts = content.split("---", 2)
        if len(parts) >= 3:
            for line in parts[1].split("\n"):
                if line.startswith("title:"):
                    title = line.split("title:", 1)[1].strip().strip("'\"")
                    break
            body = parts[2]

    return title, body


if __name__ == "__main__":
    test_file = r"C:\Users\micnu\OneDrive\PROYECTOS\MateriaProgramable\materiaprogramable\_articulos_text_plano\Articulo 7 es en.txt"

    if os.path.exists(test_file):
        title, body = process_article(test_file)
        params = analyze_article(body, title)
        print("\n=== RESULT ===")
        print(json.dumps(params, indent=2))
