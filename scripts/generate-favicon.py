#!/usr/bin/env python3
"""Generates the GlowJ favicon files from the OFFICIAL droplet (brand-assets/official/glowj-droplet-source.webp).

Only cropping, padding and resizing: the droplet is never redrawn, recoloured or altered.
  src/app/favicon.ico     16, 32 and 48 px (PNG frames, transparent): browser tabs, bookmarks
  src/app/apple-icon.png  180 px on the official air colour (iOS has no transparency)

Needs Pillow (a dev-only tool, not a project dependency). Output is committed; the build never runs this.
Run: python3 scripts/generate-favicon.py
"""
import io
import struct
from PIL import Image

SOURCE = "brand-assets/official/glowj-droplet-source.webp"
AIR = (0xF7, 0xFA, 0xF9, 255)  # official air, only behind the Apple touch icon

droplet = Image.open(SOURCE).convert("RGBA")
droplet = droplet.crop(droplet.getbbox())  # trim the transparent margin only


def square(pad: float, background=(0, 0, 0, 0)) -> Image.Image:
    """The droplet centred in a square, with `pad` of its height as margin on every side."""
    w, h = droplet.size
    side = round(h * (1 + 2 * pad))
    canvas = Image.new("RGBA", (side, side), background)
    canvas.alpha_composite(droplet, ((side - w) // 2, (side - h) // 2))
    return canvas


def frame(size: int, image: Image.Image) -> bytes:
    out = io.BytesIO()
    image.resize((size, size), Image.LANCZOS).save(out, format="PNG", optimize=True)
    return out.getvalue()


# favicon.ico: three PNG-compressed frames. Minimal padding so the drop is as large as it can be at 16 px.
tab = square(0.04)
frames = [(s, frame(s, tab)) for s in (16, 32, 48)]
header = struct.pack("<HHH", 0, 1, len(frames))
offset = 6 + 16 * len(frames)
entries, payload = b"", b""
for size, data in frames:
    entries += struct.pack("<BBBBHHII", size, size, 0, 0, 1, 32, len(data), offset + len(payload))
    payload += data
open("src/app/favicon.ico", "wb").write(header + entries + payload)

# apple-icon.png: iOS paints transparency black, so the drop sits on the official air colour.
open("src/app/apple-icon.png", "wb").write(frame(180, square(0.16, AIR)))
print("wrote src/app/favicon.ico (16, 32, 48) and src/app/apple-icon.png (180)")
