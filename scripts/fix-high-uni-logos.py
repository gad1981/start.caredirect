import io
import os

import pymupdf
from PIL import Image

logo_dir = r"C:\Users\gad.g\OneDrive - Care Direct S.A\Desktop\Start Branding\Logos"
assets = r"C:\Users\gad.g\Documents\start-caredirect\assets\brand"
public = r"C:\Users\gad.g\Documents\start-caredirect\public\assets\brand"
os.makedirs(assets, exist_ok=True)
os.makedirs(public, exist_ok=True)


def knockout_white(im: Image.Image, thr: int = 250) -> Image.Image:
    im = im.convert("RGBA")
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if r >= thr and g >= thr and b >= thr:
                px[x, y] = (0, 0, 0, 0)
    bbox = im.getbbox()
    if not bbox:
        return im
    pad = 16
    l, t, r2, b2 = bbox
    return im.crop(
        (max(0, l - pad), max(0, t - pad), min(w, r2 + pad), min(h, b2 + pad))
    )


def export_page(pdf_name: str, key: str) -> None:
    doc = pymupdf.open(os.path.join(logo_dir, pdf_name))
    page = doc[0]
    pix = page.get_pixmap(matrix=pymupdf.Matrix(3.5, 3.5), alpha=False)
    im = Image.open(io.BytesIO(pix.tobytes("png")))
    im = knockout_white(im)
    name = f"logo-st-{key}.webp"
    im.save(os.path.join(assets, name), "WEBP", quality=95)
    im.save(os.path.join(public, name), "WEBP", quality=95)
    print(key, "saved", im.size, im.mode)


# Dump a few wide HighSchool embeds for visual QA
doc = pymupdf.open(os.path.join(logo_dir, "Start_HighSchool.pdf"))
page = doc[0]
for j, img in enumerate(page.get_images(full=True)):
    xref = img[0]
    base = doc.extract_image(xref)
    w, h = base["width"], base["height"]
    if w >= 1000 and w / max(h, 1) >= 1.6:
        ext = base["ext"]
        path = os.path.join(assets, f"_emb-high-{j}.{ext}")
        with open(path, "wb") as f:
            f.write(base["image"])
        print("embed", j, w, h, ext)

export_page("Start_HighSchool.pdf", "high")
export_page("Start_University.pdf", "uni")
