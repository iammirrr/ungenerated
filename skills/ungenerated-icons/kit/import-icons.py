#!/usr/bin/env python3
"""Bring the image model's icons in by name: into the board's assets and, if given, an Xcode asset catalog.

  python3 kit/import-icons.py <folder of PNGs> <board icons dir> [options]
  python3 kit/import-icons.py ~/Desktop/MyApp-icons assets/icons --brief docs/icon-brief.md \
      --xcassets ios/MyApp/Assets.xcassets/Icons --px 288 --reuse emoji-bulb=core-idea --sheet

  --brief FILE       only import names the brief lists (`name` at the start of a table row, or "Next: `name`")
  --xcassets DIR     also write <DIR>/<name>.imageset/ for each icon (a folder inside an .xcassets catalog)
  --px N             resize to N x N (needs Pillow); 288 is 96 pt at 3x. Default: copy as is
  --reuse NEW=OLD    one approved file under a second name (repeatable); skipped when NEW was made itself
  --sheet            write <board icons dir>/sheet.html: every icon at 16, 24, 32, 48 and 72 pt, light and dark

A file whose corners aren't transparent is skipped with a note (needs Pillow; without it only the alpha channel is
checked). It overwrites what it imports and never deletes, so run it again whenever new files land.
"""
import argparse
import json
import pathlib
import re
import shutil

try:
    from PIL import Image
except ImportError:  # shortcut: no Pillow means no resize and only an alpha-channel check; install Pillow for both
    Image = None

ap = argparse.ArgumentParser()
ap.add_argument('src', type=pathlib.Path)
ap.add_argument('board', type=pathlib.Path)
ap.add_argument('--brief', type=pathlib.Path)
ap.add_argument('--xcassets', type=pathlib.Path)
ap.add_argument('--px', type=int)
ap.add_argument('--reuse', action='append', default=[])
ap.add_argument('--sheet', action='store_true')
a = ap.parse_args()
if a.px and not Image:
    ap.error('--px needs Pillow (pip install pillow)')

NAME = re.compile(r'^[a-z0-9][a-z0-9-]*$')
listed = None
if a.brief:
    text = a.brief.read_text()
    listed = set(re.findall(r'^\|\s*`([a-z0-9-]+)`', text, re.M)) | set(re.findall(r'Next:\s*`([a-z0-9-]+)`', text))


def transparent(path):
    if Image:
        im = Image.open(path).convert('RGBA')
        return max(im.getpixel(p)[3] for p in ((0, 0), (im.width - 1, 0), (0, im.height - 1), (im.width - 1, im.height - 1))) < 8
    head = path.read_bytes()[:26]  # PNG signature + IHDR: colour type 4 or 6 carries alpha
    return head[:8] == b'\x89PNG\r\n\x1a\n' and head[25] in (4, 6)


def put(src, dest):
    dest.parent.mkdir(parents=True, exist_ok=True)
    if a.px:
        Image.open(src).convert('RGBA').resize((a.px, a.px), Image.LANCZOS).save(dest, optimize=True)
    else:
        shutil.copyfile(src, dest)


def place(src, name):
    put(src, a.board / f'{name}.png')
    if a.xcassets:
        folder = a.xcassets / f'{name}.imageset'
        put(src, folder / f'{name}.png')
        (folder / 'Contents.json').write_text(json.dumps({'images': [{'filename': f'{name}.png', 'idiom': 'universal'}],
                                                           'info': {'author': 'xcode', 'version': 1}}, indent=2) + '\n')


a.board.mkdir(parents=True, exist_ok=True)
if a.xcassets:
    a.xcassets.mkdir(parents=True, exist_ok=True)
    if not (a.xcassets / 'Contents.json').exists() and a.xcassets.parent.suffix == '.xcassets':
        (a.xcassets / 'Contents.json').write_text(json.dumps({'info': {'author': 'xcode', 'version': 1}}, indent=2) + '\n')

made, skipped = [], []
for png in sorted(a.src.glob('*.png')):
    name = png.stem
    if not NAME.match(name):
        skipped.append(f'{png.name} (names are lower-case words and dashes)')
    elif listed is not None and name not in listed:
        skipped.append(f'{name} (not in {a.brief.name})')
    elif not transparent(png):
        skipped.append(f'{name} (not transparent)')
    else:
        place(png, name)
        made.append(name)

for pair in a.reuse:
    new, _, old = pair.partition('=')
    have = a.src / f'{old}.png'
    if new in made or not have.exists():
        continue
    place(have, new)
    made.append(f'{new} (from {old})')

if a.sheet:
    sizes = (16, 24, 32, 48, 72)
    names = sorted(p.stem for p in a.board.glob('*.png'))
    row = lambda n: f'<tr><th>{n}</th>' + ''.join(f'<td><img src="{n}.png" width="{s}" height="{s}" alt=""></td>' for s in sizes) + '</tr>'
    table = f'<table><tr><th></th>{"".join(f"<th>{s} pt</th>" for s in sizes)}</tr>{"".join(row(n) for n in names)}</table>'
    (a.board / 'sheet.html').write_text(
        '<!doctype html><meta charset="utf-8"><title>Icon sheet</title><style>'
        'body{margin:0;display:flex;font:12px system-ui}section{flex:1;padding:16px}'
        '.light{background:#f6f5f2;color:#222}.dark{background:#161618;color:#ddd}'
        'th{font-weight:500;text-align:left;padding:4px 8px}td{padding:4px 8px;vertical-align:middle}</style>'
        f'<section class="light">{table}</section><section class="dark">{table}</section>\n')

print(f'{len(made)} imported into {a.board}' + (f' and {a.xcassets}' if a.xcassets else ''))
if skipped:
    print('skipped: ' + '; '.join(skipped))
