# Generates the app icons (run once: python make_icons.py). Needs Pillow.
from PIL import Image, ImageDraw
def icon(size):
    s = size / 180
    im = Image.new('RGB', (size, size), '#0f766e')
    d = ImageDraw.Draw(im)
    # stylised spine: stacked vertebrae, one highlighted
    for i in range(7):
        w = (46 - abs(i - 3) * 3) * s
        y = (24 + i * 19) * s
        col = '#ff6b6b' if i == 4 else '#ffffff'
        d.rounded_rectangle([90 * s - w / 2, y, 90 * s + w / 2, y + 13 * s], radius=6 * s, fill=col)
    return im
icon(180).save('icons/icon-180.png')
icon(512).save('icons/icon-512.png')
