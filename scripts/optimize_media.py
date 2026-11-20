"""Make small, fast WebP copies of every photo in public/media.

Run after adding photos:  python scripts/optimize_media.py   (needs: pip install pillow)
The site works without this step; it just loads the originals instead.
"""
import json
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
MEDIA = ROOT / 'public' / 'media'
OUT = MEDIA / 'opt'
WIDTHS = [480, 1200]
OUT.mkdir(exist_ok=True)
manifest = {}
for f in sorted(MEDIA.iterdir()):
    if f.suffix.lower() not in ('.jpg', '.jpeg', '.png', '.webp') or not f.is_file():
        continue
    im = Image.open(f)
    im = im.convert('RGBA' if im.mode in ('RGBA', 'LA', 'P') else 'RGB')
    variants = []
    for w in WIDTHS:
        if variants and variants[-1][0] >= im.width:
            break
        w = min(w, im.width)
        h = round(im.height * w / im.width)
        name = f'{f.stem}-{w}.webp'
        im.resize((w, h), Image.LANCZOS).save(OUT / name, 'WEBP', quality=80, method=6)
        variants.append([w, f'media/opt/{name}'])
    manifest[f'media/{f.name}'] = variants
    print(f.name, '->', ', '.join(v[1] for v in variants))
(ROOT / 'src' / 'data' / 'media-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
