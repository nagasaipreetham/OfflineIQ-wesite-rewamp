"""Download hardware photos and punch studio backgrounds to real alpha."""

from __future__ import annotations

from collections import deque
from io import BytesIO
from pathlib import Path
from urllib.request import Request, urlopen

from PIL import Image

OUT = Path(__file__).resolve().parents[1] / "public"
UA = "OfflineIQRewamp/1.0 (local asset prep)"

SOURCES = {
    "ram-stick.png": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Memory6EZ.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/8/8c/Memory6EZ.jpg",
    ],
    "nvme-ssd.png": [
        "https://commons.wikimedia.org/wiki/Special:FilePath/Samsung_980_PRO_PCIe_4.0_NVMe_SSD_1TB-top_PNr%C2%B00915.jpg",
        "https://commons.wikimedia.org/wiki/Special:FilePath/128GB_2230_NVME_SSD.jpg",
    ],
}


def fetch(urls: list[str]) -> Image.Image:
    last_err = None
    for url in urls:
        try:
            req = Request(url, headers={"User-Agent": UA})
            with urlopen(req, timeout=40) as res:
                data = res.read()
            return Image.open(BytesIO(data)).convert("RGBA")
        except Exception as exc:  # noqa: BLE001
            last_err = exc
    raise RuntimeError(f"download failed: {last_err}")


def similar(a, b, tol: int) -> bool:
    return abs(a[0] - b[0]) <= tol and abs(a[1] - b[1]) <= tol and abs(a[2] - b[2]) <= tol


def punch(im: Image.Image, tol: int = 28) -> Image.Image:
    w, h = im.size
    px = im.load()
    seen = bytearray(w * h)
    q = deque()

    def seed(x: int, y: int) -> None:
        i = y * w + x
        if seen[i]:
            return
        seen[i] = 1
        q.append((x, y))

    step = max(1, min(w, h) // 80)
    for x in range(0, w, step):
        seed(x, 0)
        seed(x, h - 1)
    for y in range(0, h, step):
        seed(0, y)
        seed(w - 1, y)

    samples = [px[0, 0], px[w - 1, 0], px[0, h - 1], px[w - 1, h - 1]]
    while q:
        x, y = q.popleft()
        r, g, b, a = px[x, y]
        if a == 0:
            continue
        if not any(similar((r, g, b), (sr, sg, sb), tol) for sr, sg, sb, _ in samples):
            continue
        px[x, y] = (r, g, b, 0)
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < w and 0 <= ny < h and not seen[ny * w + nx]:
                seen[ny * w + nx] = 1
                q.append((nx, ny))

    # Soft-kill leftover near-white paper / checker leftovers.
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            mx, mn = max(r, g, b), min(r, g, b)
            if mx > 232 and mn > 214 and mx - mn < 16:
                px[x, y] = (r, g, b, 0)

    return im


def fit(im: Image.Image, max_w: int = 1400) -> Image.Image:
    bbox = im.getbbox()
    if bbox:
        im = im.crop(bbox)
    if im.width > max_w:
        h = int(im.height * (max_w / im.width))
        im = im.resize((max_w, h), Image.Resampling.LANCZOS)
    return im


def main() -> None:
    for name, urls in SOURCES.items():
        im = punch(fetch(urls))
        im = fit(im)
        dest = OUT / name
        im.save(dest, "PNG", optimize=True)
        print(f"wrote {dest} {im.size}")


if __name__ == "__main__":
    main()
