# tile.py - a contact sheet of stills, labelled by frame: python3 tools/tile.py <out.jpg> <cols> <cell width> <png...>
import sys, re
from PIL import Image, ImageDraw
out, cols, cw, files = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), sys.argv[4:]
ims = [Image.open(f).convert('RGB') for f in files]
ch = round(cw * ims[0].height / ims[0].width)
rows = (len(ims) + cols - 1) // cols
sheet = Image.new('RGB', (cols * cw, rows * (ch + 18)), 'white')
d = ImageDraw.Draw(sheet)
for i, (im, f) in enumerate(zip(ims, files)):
    x, y = (i % cols) * cw, (i // cols) * (ch + 18)
    sheet.paste(im.resize((cw, ch)), (x, y + 18))
    d.text((x + 4, y + 3), re.sub(r'.*-f0*', 'f', f).replace('.png', ''), fill='black')
sheet.save(out, quality=88)
