import os
import base64
import json
import sys
import requests
from pathlib import Path

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
HF_API_KEY = os.environ.get("HF_API_KEY")
GEMINI_MODEL = "gemini-2.0-flash-exp-image-generation"
HF_MODEL = "black-forest-labs/FLUX.1-schnell"
OUTPUT_DIR = Path(__file__).resolve().parent.parent / "public" / "media"


def build_prompt(title: str, description: str, content_preview: str) -> str:
    return (
        f"Professional blog header image for a science article. "
        f"Title: '{title}'. "
        f"Description: '{description}'. "
        f"Style: futuristic, sci-fi aesthetic, blue-purple-cyan neon colors, "
        f"glowing digital elements, sleek technology, professional blog quality, 16:9 aspect ratio. "
        f"No text or typography in the image."
    )


def generate_via_gemini(prompt: str, output_path: str) -> bool:
    if not GEMINI_API_KEY:
        print("[Gemini] No API key set")
        return False
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "responseModalities": ["TEXT", "IMAGE"],
                "temperature": 0.4,
                "maxOutputTokens": 8192,
            },
        }
        resp = requests.post(url, json=payload, timeout=60)
        if resp.status_code != 200:
            print(f"[Gemini] HTTP {resp.status_code}: {resp.text[:200]}")
            return False

        data = resp.json()
        candidates = data.get("candidates", [])
        if not candidates:
            print("[Gemini] No candidates in response")
            return False

        parts = candidates[0].get("content", {}).get("parts", [])
        for part in parts:
            inline_data = part.get("inlineData")
            if inline_data and inline_data.get("mimeType", "").startswith("image/"):
                img_bytes = base64.b64decode(inline_data["data"])
                with open(output_path, "wb") as f:
                    f.write(img_bytes)
                size = os.path.getsize(output_path)
                print(f"[Gemini] OK: {os.path.basename(output_path)} ({size} bytes)")
                return True

        print("[Gemini] No image data found in response")
        return False
    except Exception as e:
        print(f"[Gemini] Error: {e}")
        return False


def generate_via_huggingface(prompt: str, output_path: str) -> bool:
    if not HF_API_KEY:
        print("[HuggingFace] No API key set")
        return False
    try:
        url = f"https://api-inference.huggingface.co/models/{HF_MODEL}"
        headers = {"Authorization": f"Bearer {HF_API_KEY}"}
        resp = requests.post(url, headers=headers, json={"inputs": prompt}, timeout=120)
        if resp.status_code != 200:
            print(f"[HuggingFace] HTTP {resp.status_code}: {resp.text[:200]}")
            return False

        with open(output_path, "wb") as f:
            f.write(resp.content)

        size = os.path.getsize(output_path)
        if size > 10000:
            with open(output_path, "rb") as f:
                header = f.read(10)
            if header[:4] == b"\x89PNG":
                print(f"[HuggingFace] OK: {os.path.basename(output_path)} ({size} bytes)")
                return True
            else:
                print(f"[HuggingFace] BAD: not a PNG ({header[:20]})")
                os.remove(output_path)
                return False
        else:
            print(f"[HuggingFace] SMALL: {size} bytes")
            return False
    except Exception as e:
        print(f"[HuggingFace] Error: {e}")
        return False


def generate_article_image(title: str, description: str, content_preview: str, filename: str) -> str | None:
    prompt = build_prompt(title, description, content_preview)
    output_path = OUTPUT_DIR / filename
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    print(f"Generating image: {filename}")
    print(f"  Primary: Gemini")
    print(f"  Fallback: HuggingFace FLUX.1-schnell")

    if generate_via_gemini(prompt, str(output_path)):
        return filename

    print("  Gemini failed, trying HuggingFace fallback...")
    if generate_via_huggingface(prompt, str(output_path)):
        return filename

    print("  Both methods failed")
    return None


if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python tools/generate_article_image.py <title> <description> <content_preview> [filename]")
        sys.exit(1)

    title = sys.argv[1]
    description = sys.argv[2]
    content_preview = sys.argv[3]
    filename = sys.argv[4] if len(sys.argv) > 4 else f"hero_{title.lower().replace(' ', '_')[:50]}.png"
    if not filename.endswith(".png"):
        filename += ".png"

    result = generate_article_image(title, description, content_preview, filename)
    if result:
        print(f"RESULT:{result}")
        sys.exit(0)
    else:
        sys.exit(1)
