"""Generate START favicon assets from brand colors."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
APP = ROOT / "src" / "app"
PUBLIC = ROOT / "public"

INK = (22, 22, 24, 255)
GOLD = (245, 178, 34, 255)

def make_icon(size: int) -> Image.Image:
    scale = 4
    s = size * scale
    im = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    pad = max(scale, s // 28)
    radius = int(s * 0.22)
    d.rounded_rectangle([pad, pad, s - 1 - pad, s - 1 - pad], radius=radius, fill=INK)

    font = ImageFont.truetype(r"C:\Windows\Fonts\arialbd.ttf", int(s * 0.58))
    text = "S"
    bbox = d.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x = (s - tw) / 2 - bbox[0]
    y = (s - th) / 2 - bbox[1] - s * 0.035
    d.text((x, y), text, font=font, fill=GOLD)
    return im.resize((size, size), Image.Resampling.LANCZOS)


def main() -> None:
    icons = {sz: make_icon(sz) for sz in (16, 32, 48, 180, 192, 512)}

    write_ico(APP / "favicon.ico", [icons[16], icons[32], icons[48]])
    write_ico(PUBLIC / "favicon.ico", [icons[16], icons[32], icons[48]])

    icons[180].save(APP / "apple-icon.png")
    icons[192].save(APP / "icon.png")
    icons[192].save(PUBLIC / "icon-192.png")
    icons[512].save(PUBLIC / "icon-512.png")
    print("wrote favicon.ico (16/32/48), icon.png, apple-icon.png")


def write_ico(path: Path, images: list[Image.Image]) -> None:
    """Write a multi-size PNG-compressed .ico (more reliable than Pillow alone)."""
    import io
    import struct

    pngs: list[bytes] = []
    for im in images:
        buf = io.BytesIO()
        im.save(buf, format="PNG")
        pngs.append(buf.getvalue())

    count = len(images)
    header = struct.pack("<HHH", 0, 1, count)
    offset = 6 + 16 * count
    entries = b""
    data = b""
    for im, png in zip(images, pngs):
        w, h = im.size
        entries += struct.pack(
            "<BBBBHHII",
            0 if w >= 256 else w,
            0 if h >= 256 else h,
            0,
            0,
            1,
            32,
            len(png),
            offset,
        )
        data += png
        offset += len(png)
    path.write_bytes(header + entries + data)


if __name__ == "__main__":
    main()
