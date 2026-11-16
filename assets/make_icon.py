"""Generate the integration brand icon (PNG, no external deps beyond Pillow).

Run from the repo root:  python3 assets/make_icon.py
Writes custom_components/family_today/brand/icon.png (256)
and icon@2x.png (512).
"""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageOps

SIZE = 512          # design canvas, in pixels
SCALE = 4           # supersampling factor
S = SIZE * SCALE

TOP = (79, 195, 247)       # light blue
BOTTOM = (2, 119, 189)     # deep blue
WHITE = (255, 255, 255)
HEADER = (1, 87, 155)      # darker blue band
ACCENT = (255, 90, 95)     # warm coral for the child

OUT = Path(__file__).resolve().parent.parent / "custom_components/family_today/brand"


def px(*values: float) -> tuple[int, ...]:
    return tuple(round(v * SCALE) for v in values)


def rounded_gradient() -> Image.Image:
    """Rounded-square gradient tile used as the background."""
    gradient = Image.linear_gradient("L").resize((S, S), Image.LANCZOS)
    gradient = ImageOps.invert(gradient)  # light at the top
    bg = Image.composite(Image.new("RGB", (S, S), TOP), Image.new("RGB", (S, S), BOTTOM), gradient)

    mask = Image.new("L", (S, S), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, S - 1, S - 1), radius=px(116)[0], fill=255)
    bg.putalpha(mask)
    return bg


def draw_shadow(base: Image.Image, box: tuple[int, ...], radius: int) -> None:
    shadow = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle(
        (box[0], box[1] + px(10)[0], box[2], box[3] + px(10)[0]),
        radius=radius,
        fill=(0, 0, 0, 70),
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(px(12)[0]))
    base.alpha_composite(shadow)


def draw_icon() -> Image.Image:
    img = rounded_gradient().convert("RGBA")

    body = (*px(112, 140, 400, 404),)
    draw_shadow(img, body, px(32)[0])

    draw = ImageDraw.Draw(img)

    # Calendar body.
    draw.rounded_rectangle(px(112, 140, 400, 404), radius=px(32)[0], fill=WHITE)

    # Header band with rounded top corners and a square bottom.
    draw.rounded_rectangle(px(112, 140, 400, 204), radius=px(32)[0], fill=HEADER)
    draw.rectangle(px(112, 172, 400, 218), fill=HEADER)

    # Binder rings.
    for cx in (196, 316):
        draw.rounded_rectangle(
            px(cx - 14, 106, cx + 14, 158), radius=px(14)[0], fill=WHITE
        )

    # Family: two adults and a child. Heads are circles; torsos have rounded
    # shoulders and a flat bottom (rounded rect + rectangle).
    def person(cx: int, head_y: int, head_r: int, body_top: int, body_w: int,
               body_bottom: int, colour: tuple[int, int, int]) -> None:
        draw.ellipse(
            px(cx - head_r, head_y - head_r, cx + head_r, head_y + head_r),
            fill=colour,
        )
        left, right = cx - body_w // 2, cx + body_w // 2
        shoulder = body_w // 2
        draw.rounded_rectangle(
            px(left, body_top, right, body_top + body_w), radius=px(shoulder)[0],
            fill=colour,
        )
        draw.rectangle(px(left, body_top + shoulder, right, body_bottom), fill=colour)

    person(205, 268, 19, 290, 54, 370, HEADER)   # adult
    person(307, 268, 19, 290, 54, 370, HEADER)   # adult
    person(256, 292, 16, 310, 44, 366, ACCENT)   # child, in front

    return img


def main() -> None:
    icon = draw_icon()
    OUT.mkdir(parents=True, exist_ok=True)
    icon.resize((512, 512), Image.LANCZOS).save(OUT / "icon@2x.png")
    icon.resize((256, 256), Image.LANCZOS).save(OUT / "icon.png")
    print(f"wrote {OUT/'icon.png'} and {OUT/'icon@2x.png'}")


if __name__ == "__main__":
    main()
