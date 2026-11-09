// ungenerated-store screenshots: the editing layer of a hand-made screenshot (served by scripts/serve.mjs).
//   Shown: the screenshot fits the window and every piece of it can be adjusted:
//     click = select, Shift-click = add to the selection, drag on empty space = select everything in the box;
//     drag = move the selection, Option-drag = rotate, Cmd-drag = resize; the toolbar (and keys) for bigger / smaller
//     (+ -), opacity ([ ]), dim the screen inside a phone (, .), forward / back (F B), reset (0), arrows nudge.
//     An arrow (svg.arrow[data-pts]) shows three handles when selected: its start, its bend and its end.
//   Every change is kept by serve.mjs in edits.json next to the pages ("<page>:<piece>"), so it holds after a reload,
//   in the gallery and in the shots (shoot.mjs).
//   Shot (?shot): exact size, the changes applied, nothing to click.
(async () => {
  const d = document.documentElement;
  const shot = location.search.includes('shot');
  // embed: inside the gallery (the full panel), at exact size and editable there
  const embed = location.search.includes('embed');
  if (shot || embed) d.classList.add('shot');
  const fit = new URLSearchParams(location.search).get('fit'); // shoot.mjs: another iPhone size, the frame scaled to cover it
  if (fit) d.style.setProperty('--fit', +fit);
  else { const z = () => d.style.setProperty('--z', Math.min((innerHeight - 70) / 980, innerWidth / 460)); z(); addEventListener('resize', z); }
  d.classList.add('is-still');

  // HD: an image marked data-hd is replaced by hd/<its file name> when that file exists (drop full-size media there)
  await Promise.all([...document.querySelectorAll('img[data-hd]')].map((im) => {
    const hd = 'hd/' + im.getAttribute('src').split('/').pop().split('?')[0];
    return fetch(hd, { method: 'HEAD', cache: 'no-store' }).then((r) => { if (r.ok) im.src = hd; }).catch(() => {});
  }));
  const page = location.pathname.split('/').pop().replace('.html', '') || 'index';
  const f = document.querySelector('.f');
  if (!f) return;
  const NS = 'http://www.w3.org/2000/svg';

  // ------------------------------------------------------------------ arrows: drawn from their points, so they can be reshaped
  const drawArrow = (svg, pts) => {
    const [x1, y1, cx, cy, x2, y2] = pts;
    svg._pts = pts;
    const a = Math.atan2(y2 - cy, x2 - cx), L = 16, w = svg.dataset.w || 5, c = svg.dataset.c || '#ef7a45';
    svg.setAttribute('viewBox', '0 0 440 956');
    svg.innerHTML = `<path class="hit" d="M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}" fill="none" stroke="transparent" stroke-width="26"/>`
      + `<path d="M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`
      + `<path d="M${x2 - L * Math.cos(a - 0.55)} ${y2 - L * Math.sin(a - 0.55)} L${x2} ${y2} L${x2 - L * Math.cos(a + 0.55)} ${y2 - L * Math.sin(a + 0.55)}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  };
  f.querySelectorAll('svg.arrow[data-pts]').forEach((svg) => drawArrow(svg, svg.dataset.pts.split(',').map(Number)));

  // ------------------------------------------------------------------ the pieces and their saved changes
  // every piece placed on the frame, then pieces inside a group marked data-piece, so each can move on its own; the
  // group stays a piece too (click its edge). Added after, so the names of pieces already edited never change.
  const pieces = [...f.children].filter((el) => getComputedStyle(el).position === 'absolute' && !el.classList.contains('blob'));
  pieces.push(...f.querySelectorAll('[data-piece]')); // a piece inside a group (a card in a list): mark it data-piece
  pieces.forEach((el, i) => { el.dataset.e = `${i}-${(el.className.baseVal ?? el.className).split(' ')[0] || el.tagName.toLowerCase()}`; });
  pieces.filter((el) => el.classList.contains('phone')).forEach((el) => { const dim = document.createElement('div'); dim.className = 'dimmer'; el.append(dim); });
  const key = (el) => `${page}:${el.dataset.e}`;
  const dir = location.pathname.replace(/[^/]*$/, '').replace(/^\//, '');
  const edits = {};
  const apply = (el) => {
    const v = edits[el.dataset.e] || {};
    el.style.translate = `${v.x || 0}px ${v.y || 0}px`;
    el.style.rotate = `${v.r || 0}deg`;
    el.style.scale = String(v.s || 1);
    el.style.opacity = v.o ?? '';
    el.style.zIndex = v.z ?? '';
    const dim = el.querySelector(':scope > .dimmer');
    if (dim) dim.style.opacity = v.dim || 0;
    if (el.matches('svg.arrow[data-pts]')) drawArrow(el, v.pts || el.dataset.pts.split(',').map(Number));
  };
  try {
    const s = await (await fetch('/__edits?dir=' + encodeURIComponent(dir), { cache: 'no-store' })).json();
    pieces.forEach((el) => { const v = s[key(el)]; if (v) edits[el.dataset.e] = v; apply(el); });
  } catch {}
  const st = document.createElement('style');
  st.textContent = '.phone > .dimmer{position:absolute;inset:10px;border-radius:37px;background:#faf6ee;pointer-events:none;opacity:0}';
  document.head.append(st);
  // one line: a card's title and subtitle never wrap; their type shrinks until they fit
  await document.fonts.ready;
  f.querySelectorAll('.one').forEach((el) => {
    el.style.whiteSpace = 'nowrap';
    let px = parseFloat(getComputedStyle(el).fontSize);
    for (let i = 0; i < 40 && el.scrollWidth > el.clientWidth + 0.5; i++) { px *= 0.96; el.style.fontSize = px + 'px'; }
  });

  // ---- languages and wider canvases (after the edits, the base). ?lang=xx swaps the frame's words for those in
  // strings/xx.json (translate.mjs makes them): headlines and the app's interface. Content people wrote (scripts,
  // brain dumps, hooks, reel titles, captions) stays as it is: inside .said or [data-keep], @handles, numbers, and the
  // texts in keep.json; the app doesn't offer writing in other languages yet, so no screenshot promises it.
  const Q = new URLSearchParams(location.search);
  let keepList = [];
  try { keepList = await (await fetch('keep.json', { cache: 'no-store' })).json(); } catch {}
  const plain = /^.$|^[\s\d:.,·♥%+\-–KkMm#|⇄⇧⌫]*$|^@/;
  const kept = (n) => n.parentElement.closest('.said, [data-keep], .keep, h1, svg, style, script') || plain.test(n.nodeValue.trim()) || keepList.includes(n.nodeValue.trim());
  const texts = () => { const out = []; const w = document.createTreeWalker(f, NodeFilter.SHOW_TEXT); for (let n; (n = w.nextNode());) { const t = n.nodeValue.trim(); if (t && !kept(n)) out.push([n, t]); } return out; };
  const h1 = f.querySelector('h1');
  const h1text = () => (h1 ? [...h1.children].map((l) => [...l.childNodes].map((c) => (c.nodeType === 3 ? c.nodeValue : c.classList && c.classList.contains('box') ? `[${c.textContent}]` : c.textContent)).join('').replace(/\s+/g, ' ').trim()).join(' / ') : '');
  window.__collect = () => ({ h1: h1text(), texts: [...new Set(texts().map(([, t]) => t))] });
  const h0 = h1 ? h1.getBoundingClientRect().height : 0; // the English headline's height: a translation never takes more
  if (Q.get('z')) d.style.zoom = Q.get('z'); // shoot.mjs: the frame zoomed into an exact App Store canvas
  const lang = Q.get('lang');
  let tr = false; // the words were swapped for a translation
  if (lang && !/^en/.test(lang)) {
    try {
      const S = await (await fetch(`strings/${lang}.json`, { cache: 'no-store' })).json();
      // scripts the brand fonts don't have get good fonts per role: the headline a heavy rounded one, the app's sans text
      // Noto Sans, its serif titles Noto Serif, each with its own line height (Mir: "use good nice fonts where needed")
      const L2 = lang.split('-')[0];
      const zh = lang === 'zh-Hant' ? 'TC' : 'SC';
      const SANS = { ja: 'Noto Sans JP', zh: `Noto Sans ${zh}`, ko: 'Noto Sans KR', hi: 'Noto Sans Devanagari', mr: 'Noto Sans Devanagari', bn: 'Noto Sans Bengali', gu: 'Noto Sans Gujarati', pa: 'Noto Sans Gurmukhi', ta: 'Noto Sans Tamil', te: 'Noto Sans Telugu', kn: 'Noto Sans Kannada', ml: 'Noto Sans Malayalam', or: 'Noto Sans Oriya', th: 'Noto Sans Thai', ar: 'Noto Sans Arabic', ur: 'Noto Sans Arabic', he: 'Noto Sans Hebrew', el: 'Noto Sans' }[L2];
      const HEAD = { ja: 'M PLUS Rounded 1c', ko: 'Gothic A1', ar: 'Cairo', ur: 'Cairo', he: 'Rubik' }[L2] || SANS;
      const SERIF = { ja: 'Noto Serif JP', zh: `Noto Serif ${zh}`, ko: 'Noto Serif KR', el: 'Noto Serif' }[L2] || SANS;
      if (SANS) {
        const fams = [...new Set([HEAD, SANS, SERIF])];
        // one stylesheet per family, with weights every one of them has (one missing weight fails a whole request,
        // and the browser then fakes bold over a fallback font)
        await Promise.all(fams.map((n) => new Promise((r) => {
          const ln = document.createElement('link');
          ln.rel = 'stylesheet';
          ln.href = `https://fonts.googleapis.com/css2?family=${n.replace(/ /g, '+')}:wght@400;700;800;900&display=block`;
          ln.onload = ln.onerror = r;
          document.head.append(ln);
        })));
        const sample = Object.values(S).join('').slice(0, 300);
        await Promise.all(fams.flatMap((n) => ['400', '700', '900'].map((w) => document.fonts.load(`${w} 20px '${n}'`, sample).catch(() => 0))));
        // the script's font right after the brand's own, before any generic family (which would catch the letters first)
        const after = (fam, add) => { const [one, ...rest] = fam.split(','); return [one, add, ...rest].join(', '); };
        f.querySelectorAll('*').forEach((el) => {
          if (el.closest('svg, h1')) return;
          const fam = getComputedStyle(el).fontFamily;
          el.style.fontFamily = after(fam, `'${/(^|,)\s*['"]?[^,]*serif['"]?\s*(,|$)/i.test(fam) && !/sans-serif/i.test(fam) && !/Inter|Nunito|SF Pro|system-ui/i.test(fam.split(',')[0]) ? SERIF : SANS}'`);
        });
        const cjk = ['ja', 'zh', 'ko'].includes(L2);
        const fam = h1 ? getComputedStyle(h1).fontFamily : 'sans-serif';
        const css = document.createElement('style');
        // the boxed word keeps its whole glyphs inside the box: marks above Indic letters, full-height CJK
        css.textContent = `h1 { font-family: ${after(fam, `'${HEAD}'`)} !important; letter-spacing: 0 !important; line-height: ${cjk ? 1.18 : 1.38} !important; font-synthesis: none; } h1 .box { line-height: ${cjk ? 1.12 : 1.3} !important; padding: ${cjk ? '.1em .2em .12em' : '.16em .24em .1em'} !important; margin: ${cjk ? '.08em 0 0 .06em' : '.1em 0 0 .06em'} !important; } .f * { font-synthesis: none; }`;
        document.head.append(css);

      }
      const changed = new Set();
      const tall = new Map();
      const inkW = (el) => { const r = document.createRange(); r.selectNodeContents(el); return r.getBoundingClientRect().width; };
      const wideEn = new Map();
      texts().forEach(([n, t]) => { if (S[t]) { const el = n.parentElement; if (!tall.has(el)) { tall.set(el, el.getBoundingClientRect().height); wideEn.set(el, inkW(el)); } n.nodeValue = n.nodeValue.replace(t, S[t]); changed.add(el); } });
      // a longer translation shrinks its line to fit its box (the cards stay one line)
      [...changed, ...f.querySelectorAll('.one')].forEach((el) => {
        let px = parseFloat(getComputedStyle(el).fontSize);
        for (let i = 0; i < 30 && el.scrollWidth > el.clientWidth + 0.5; i++) { px *= 0.96; el.style.fontSize = px + 'px'; }
      });
      const ht = h1 && S[h1text()];
      if (ht) h1.innerHTML = ht.split(' / ').map((l) => `<span>${l.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]).replace(/\[([^\]]+)\]/, '<span class="box">$1</span>')}</span>`).join('');
      await document.fonts.ready;
      // a translated text that came out taller than the English (another script's line height) shrinks back to it
      tall.forEach((h, el) => { let px = parseFloat(getComputedStyle(el).fontSize); for (let k = 0; k < 15 && h > 0 && el.getBoundingClientRect().height > h * 1.06; k++) { px *= 0.95; el.style.fontSize = px + 'px'; } });
      // and a one-line label no wider than 115% of the English (the layout around it was made for the English)
      tall.forEach((h, el) => { const w = wideEn.get(el); if (!w || el.getBoundingClientRect().height > parseFloat(getComputedStyle(el).fontSize) * 1.9) return; let px = parseFloat(getComputedStyle(el).fontSize); for (let k = 0; k < 15 && inkW(el) > w * 1.15; k++) { px *= 0.95; el.style.fontSize = px + 'px'; } });
      if (h1 && /^(ar|he|ur|fa)/.test(lang)) h1.dir = 'rtl';
      d.lang = lang;
      tr = true;
    } catch {}
  }
  // a headline always fits: each of its lines stays on one line and the type shrinks until it does
  if (h1) {
    await document.fonts.ready;
    const lines = [...h1.children];
    lines.forEach((l) => { l.style.whiteSpace = 'nowrap'; });
    let px = parseFloat(getComputedStyle(h1).fontSize);
    if (!tr) for (let i = 0; i < 40 && lines.some((l) => l.scrollWidth > l.clientWidth + 1); i++) { px *= 0.96; h1.style.fontSize = px + 'px'; }
    // a translation: every line (its boxed word too) inside the frame's side margins, and no taller than the English
    const ink = (l) => { const r = document.createRange(); r.selectNodeContents(l); return r.getBoundingClientRect().width; };
    const maxW = f.clientWidth - 2 * 34;
    for (let i = 0; i < 50 && tr && (lines.some((l) => ink(l) > maxW) || h1.getBoundingClientRect().height > h0 + 1); i++) { px *= 0.97; h1.style.fontSize = px + 'px'; }
  }
  // the device in the picture follows the canvas (Mir: "IN IPAD SCREENSHOT USE IPADS, IN MAC USE MACBOOKS"; "I want the
  // phones to copy that as well"): ?dev=ipad13|ipad129 turns every phone into an iPad of the same height whose app screen
  // uses its width (the content bigger, ~80% of the width, the lower half kept to the bottom); iphone69/iphone63 get the
  // Dynamic Island, iphone65 and iphone55 the notch (an iPhone 12-style phone); mac a MacBook with the
  // app in its own window
  const dev = Q.get('dev') || '';
  // re-lay a redrawn app screen (.scr .in, 390 x 844 points) into a screen of iw x ih pixels at scale k: its content a
  // centred 390-wide column, and when the screen is shorter, everything in the lower half moves up with the bottom
  const relay = (el, k, iw, ih, top = 0) => {
    const Lw = iw / k, LH = ih / k;
    el.style.setProperty('--k', k);
    el.style.width = Lw + 'px';
    const col = document.createElement('div');
    col.className = 'col';
    Object.assign(col.style, { position: 'absolute', left: (Lw - 390) / 2 + 'px', top: top + 'px', width: '390px', height: '844px' });
    [...el.children].filter((c) => !c.matches('.sb, .dimmed')).forEach((c) => col.append(c));
    el.append(col);
    const box = (c) => ({ c, t: c.offsetTop, b: c.offsetTop + c.offsetHeight, l: c.offsetLeft, r: c.offsetLeft + c.offsetWidth });
    const before = [...col.children].map(box);
    el.style.height = LH + 'px';
    col.style.height = LH - top + 'px';
    const loss = 844 - (LH - top);
    const info = { k, top, colLeft: (Lw - 390) / 2, shift: 0 };
    if (loss > 0) {
      // the lower half (what isn't already kept to the bottom) moves up by the loss, but never onto what is above it;
      // whatever still doesn't fit is cropped, as the bottom of a phone already is
      // (pieces kept to the bottom already moved by the whole loss: they are held to the same shift)
      const parts = before.filter((x) => x.b - x.t < 844 * 0.6);
      const low = parts.filter((x) => x.t > 844 * 0.5), up = parts.filter((x) => x.t <= 844 * 0.5);
      let shift = loss;
      low.forEach((a) => up.forEach((u) => { if (a.l < u.r && u.l < a.r) shift = Math.min(shift, a.t - u.b - 10); }));
      shift = Math.max(0, shift);
      // a piece kept to the bottom ignores margin-top: it moves back down with margin-bottom
      low.forEach((x) => { if (x.c.offsetTop === x.t) x.c.style.marginTop = -shift + 'px'; else x.c.style.marginBottom = shift - loss + 'px'; });
      info.shift = shift;
      info.marks = parts.map((x) => [x.t, low.includes(x)]);
    }
    // what ends mostly below what can be seen (the screen's end, or the canvas's) is left out rather than cut in half
    const seeB = Math.min(innerHeight, el.getBoundingClientRect().bottom);
    [...col.children].forEach((c) => { const r = c.getBoundingClientRect(); if (r.height > 0 && r.height < 300 && r.bottom > seeB && (seeB - r.top) / r.height < 0.6) c.style.visibility = 'hidden'; });
    const sb = el.querySelector(':scope > .sb');
    if (sb && Lw > 391) { sb.style.width = '195px'; const r = document.createElement('div'); r.className = 'sb2'; r.style.background = getComputedStyle(sb).background; r.style.backgroundSize = '390px 50px'; el.append(r); }
    return info;
  };
  // what pops out over a phone's screen (frame pieces whose centre is on it) moves and scales with the content under it
  const follow = (box, k0, o0, o1, info) => {
    // positions follow the content exactly; sizes grow half as much (a pop-out was already drawn bigger than the app)
    const rr = 1 + (info.k / k0 - 1) * 0.5;
    // a pop-out moves as the app element right above it moved (a chip under the voice wave stays under it)
    const moves = (ly) => { const above = (info.marks || []).filter((m) => m[0] <= ly + 1).sort((p, q) => q[0] - p[0])[0]; return above ? above[1] : ly > 422; };
    const map = (x, y) => { let ly = (y - o0[1]) / k0; const low = moves(ly); if (low) ly -= info.shift; return [o1[0] + (info.colLeft + (x - o0[0]) / k0) * info.k, o1[1] + (ly + info.top) * info.k, low]; };
    const inside = (x, y) => x >= box.l && x <= box.r && y >= box.t && y <= box.b;
    const moved = [];
    [...f.children].filter((c) => c.matches('.pop') || c.dataset.piece !== undefined).forEach((c) => {
      const x = c.offsetLeft, y = c.offsetTop, w = c.offsetWidth, h = c.offsetHeight;
      if (c.classList.contains('phone') || x + w < box.l || x > box.r || y + h < box.t || y > box.b) return;
      const [nx, ny, low] = map(x, y);
      moved.push({ c, nx, ny, low, b: ny + h * rr, x, y, w, h });
    });
    // what moved below the canvas comes back up together (bubbles and their badges stay together)
    const dy = Math.min(0, 956 - 14 - Math.max(0, ...moved.filter((m) => m.low).map((m) => m.b)));
    // pop-outs in a column keep their spacing: none comes closer to the one above it than it was (rows of options)
    const col = [...moved].sort((p, q) => p.y - q.y);
    for (let i = 1; i < col.length; i++) for (let j = 0; j < i; j++) {
      const a = col[j], b = col[i];
      if (b.x >= a.x + a.w || a.x >= b.x + b.w || b.y < a.y + a.h * 0.5) continue;
      const want = a.ny + (a.h + Math.max(0, b.y - a.y - a.h)) * rr;
      if (b.ny < want) { b.ny = want; b.b = b.ny + b.h * rr; }
    }
    // where each card is seen (with the owner's moves and scales), in frame units, before and after it moves
    const fr = () => { const r = f.getBoundingClientRect(); return [r.left, r.top, r.width / f.offsetWidth]; };
    const seen = (c) => { const [fl, ft, sc] = fr(), r = c.getBoundingClientRect(); return { x: (r.left - fl) / sc, y: (r.top - ft) / sc, w: r.width / sc, h: r.height / sc }; };
    moved.forEach((m) => { m.v0 = seen(m.c); });
    // all of them come up together, as far as the lowest needs to end above the canvas (their arrangement kept)
    const lift = Math.min(0, 956 - 14 - Math.max(0, ...moved.map((m) => m.b)));
    // grown with a scale after the owner's own move and turn (a zoom multiplied their move: a card ran ahead of the mouse)
    // (around the card's own centre, as the owner's scale is: the card is placed so its corner lands where it should)
    moved.forEach((m) => { m.ny += lift; const own = getComputedStyle(m.c).transform; Object.assign(m.c.style, { left: m.nx + ((rr - 1) * m.w) / 2 + 'px', top: m.ny + ((rr - 1) * m.h) / 2 + 'px', transform: `${own === 'none' ? '' : own} scale(${rr})` }); });
    moved.forEach((m) => { m.v1 = seen(m.c); });
    // the app's words a pop-out now covers are hidden, so nothing shows through half-covered
    const covers = moved.map((m) => m.c.getBoundingClientRect());
    const said = moved.map((m) => m.c.textContent.replace(/\s+/g, ' '));
    f.querySelectorAll('.phone .col > *').forEach((el) => {
      const a = el.getBoundingClientRect(), t = el.textContent.replace(/\s+/g, ' ').trim().slice(0, 40);
      // covered by a pop-out, or the same words a pop-out already shows bigger
      if (covers.some((b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom && a.height < 200) || (t.length > 20 && said.some((x) => x.includes(t)))) el.style.visibility = 'hidden';
    });
    // arrows whose ends are on the screen follow their cards (drawn only: the owner's points stay as they are)
    f.querySelectorAll('svg.arrow').forEach((svg) => {
      // its points as seen, with the owner's move and scale (around its own middle), then drawn there plainly
      const st = svg.style, [tx, ty] = (st.translate || '0 0').split(' ').map((v) => parseFloat(v) || 0), sc = parseFloat(st.scale) || 1;
      const ox = svg.clientWidth / 2 || 220, oy = svg.clientHeight / 2 || 478; // scales around the frame's middle (the owner's edits were made so)
      const q = svg._pts && svg._pts.map((v, i) => (i % 2 ? oy + (v - oy) * sc + ty : ox + (v - ox) * sc + tx));
      if (!q || !(inside(q[0], q[1]) || inside(q[4], q[5]))) return;
      const out = [];
      // an end on a card moves with that card; the bend with the ends
      // the card an end sits on, or the nearest one within 100 units (an arrow usually starts just off its card)
      const gap = (v, px, py) => Math.hypot(Math.max(v.x - px, 0, px - v.x - v.w), Math.max(v.y - py, 0, py - v.y - v.h));
      const on = (px, py) => moved.filter((m) => gap(m.v0, px, py) < 100).sort((a, b) => gap(a.v0, px, py) - gap(b.v0, px, py))[0];
      const pt = (px, py) => { const m = on(px, py); if (m) { const k = m.v1.w / m.v0.w; return [m.v1.x + (px - m.v0.x) * k, m.v1.y + (py - m.v0.y) * k]; } const [mx, my] = map(px, py); return [mx, my + lift]; };
      // an arrow between two cards: its start on the nearer card, its end on another; each end keeps its place against
      // its card's edge (under the first, above the second), wherever the cards went
      const near = (px, py, not) => moved.filter((m) => m !== not && gap(m.v0, px, py) < 160).sort((u, v) => gap(u.v0, px, py) - gap(v.v0, px, py))[0];
      const A = near(q[0], q[1]), B = A && near(q[4], q[5], A);
      // (across: the same place along each card's width; down: the same share of the gap between the cards)
      const g0 = A && B ? [A.v0.y + A.v0.h, B.v0.y] : null, g1 = A && B ? [A.v1.y + A.v1.h, B.v1.y] : null;
      // an end in the gap keeps its share of the gap; an end on (or past) a card moves with that card
      const edge = (m, px, py) => {
        const fx = (px - m.v0.x) / m.v0.w;
        if (py >= g0[0] && py <= g0[1] && g0[1] > g0[0]) return [m.v1.x + fx * m.v1.w, g1[0] + ((py - g0[0]) / (g0[1] - g0[0])) * (g1[1] - g1[0])];
        return [m.v1.x + fx * m.v1.w, m.v1.y + (py - m.v0.y) * (m.v1.h / m.v0.h)];
      };
      const a = A && B ? edge(A, q[0], q[1]) : pt(q[0], q[1]), e = A && B ? edge(B, q[4], q[5]) : pt(q[4], q[5]);
      // the bend keeps its place relative to the line between the ends (along it and across it)
      const dx = q[4] - q[0], dy2 = q[5] - q[1], bx = q[2] - q[0], by = q[3] - q[1], n = dx * dx + dy2 * dy2 || 1;
      const along = (bx * dx + by * dy2) / n, across = (by * dx - bx * dy2) / n, Dx = e[0] - a[0], Dy = e[1] - a[1];
      out.push(a[0], a[1], a[0] + along * Dx - across * Dy, a[1] + along * Dy + across * Dx, e[0], e[1]);
      // drawn where, after the owner's own move and scale, it is seen at the mapped points (their edit stays live)
      for (let i = 0; i < 6; i += 2) { out[i] = ox + (out[i] - tx - ox) / sc; out[i + 1] = oy + (out[i + 1] - ty - oy) / sc; }
      drawArrow(svg, out);
    });
  };
  // an iPad canvas is wider: the headline grows into it (Mir: "iPad have a lot of [space] for the heading text, but it is
  // small"), up to 1.5x (a little higher), each line still on one line inside the canvas's side margins
  if (dev.startsWith('ipad') && f.querySelector('h1')) {
    const hd = f.querySelector('h1'), cwide = +Q.get('w') || f.offsetWidth, side = (cwide - f.offsetWidth) / 2 - 36;
    Object.assign(hd.style, { left: -side + 'px', right: -side + 'px', top: Math.min(parseFloat(getComputedStyle(hd).top), 44) + 'px' });
    // grows until its widest line fills ~72% of the width (a translation starts smaller, so it grows more), capped
    let px = parseFloat(getComputedStyle(hd).fontSize);
    const wide = () => Math.max(...[...hd.children].map((l) => { const r = document.createRange(); r.selectNodeContents(l); return r.getBoundingClientRect().width; }));
    for (let i = 0; i < 60 && px < 64 * 1.9 && wide() < 0.72 * hd.getBoundingClientRect().width && hd.offsetHeight < 270; i++) { px *= 1.03; hd.style.fontSize = px + 'px'; }
    const ink = (l) => { const r = document.createRange(); r.selectNodeContents(l); return r.getBoundingClientRect().width; };
    for (let i = 0; i < 40 && [...hd.children].some((l) => ink(l) > hd.getBoundingClientRect().width - 4); i++) { px *= 0.97; hd.style.fontSize = px + 'px'; }
    // it stops above the first thing under it that stays put: a page's own device (.tab) or any piece not on a phone
    // (phones move down with it, and what sits on them follows)
    const phones = [...f.querySelectorAll('.phone')].map((q) => [q.offsetLeft, q.offsetTop, q.offsetLeft + q.offsetWidth, q.offsetTop + q.offsetHeight]);
    const onPhone = (c) => phones.some(([l, t, r, b]) => c.offsetLeft + c.offsetWidth / 2 > l && c.offsetLeft + c.offsetWidth / 2 < r && c.offsetTop + c.offsetHeight / 2 > t && c.offsetTop + c.offsetHeight / 2 < b);
    // every text under it that stays put (where it is seen), however deep in the page it sits
    const fb0 = f.getBoundingClientRect(), fs0 = fb0.width / f.offsetWidth, top0 = hd.offsetTop + 20;
    const tops = [...f.querySelectorAll('*')].filter((el) => !el.closest('h1, .phone, svg') && [...el.childNodes].some((n) => n.nodeType === 3 && n.nodeValue.trim())).filter((el) => { let c = el; while (c.parentElement !== f) c = c.parentElement; return !onPhone(c); }).map((el) => (el.getBoundingClientRect().top - fb0.top) / fs0).filter((y) => y > top0);
    const limit = Math.min(...tops, 9999) - 16;
    for (let i = 0; i < 40 && hd.offsetTop + hd.offsetHeight > limit; i++) { px *= 0.97; hd.style.fontSize = px + 'px'; }
  }
  if (dev) {
    const ds = document.createElement('style');
    ds.textContent = `
.phone .sb2 { position: absolute; right: 0; top: 0; width: 195px; height: 50px; background-position: -195px 0 !important; z-index: 20; }
.phone .island { position: absolute; left: 50%; z-index: 25; background: #000; pointer-events: none; }
.phone.ipad { border-radius: 34px; padding: 13px; }
.phone.ipad .scr, .phone.ipad > .dimmer { inset: 13px; border-radius: 22px; }
.phone.ipad > img { border-radius: 22px; }
.phone.mac { background: none; padding: 0; border-radius: 0; box-shadow: none; }
.mac .lid { position: absolute; left: 0; right: 0; top: 0; bottom: var(--deck); background: #0d0d10; border-radius: 22px 22px 6px 6px; box-shadow: 0 0 0 2px #3c3c43, 0 0 0 3px #8a8a92, 0 30px 60px rgba(90, 30, 5, .3); }
.mac .notch { position: absolute; left: 50%; top: 0; width: 90px; height: 16px; margin-left: -45px; background: #0d0d10; border-radius: 0 0 9px 9px; z-index: 30; }
.mac .desk { position: absolute; inset: 12px 12px 14px; border-radius: 10px 10px 2px 2px; overflow: hidden; background: radial-gradient(120% 90% at 20% 10%, #ffb98a, #f07a3e 45%, #c9471b); }
.mac .deck { position: absolute; left: -7%; right: -7%; bottom: 0; height: var(--deck); background: linear-gradient(#d9d9de, #a9a9b0 70%, #7d7d85); border-radius: 3px 3px 22px 22px / 3px 3px 12px 12px; box-shadow: 0 24px 40px rgba(90, 30, 5, .28); }
.mac .deck::before { content: ''; position: absolute; left: 50%; top: 0; width: 16%; margin-left: -8%; height: 38%; background: #b4b4ba; border-radius: 0 0 10px 10px; }
.mac .win { position: absolute; top: 6%; bottom: 6%; left: 50%; border-radius: 12px; overflow: hidden; background: #f8f4ec; box-shadow: 0 0 0 1px rgba(0,0,0,.18), 0 20px 50px rgba(60, 20, 0, .35); }
.mac .bar { position: absolute; left: 0; right: 0; top: 0; height: 28px; background: #ece7de; display: flex; gap: 7px; align-items: center; padding-left: 11px; z-index: 40; }
.mac .bar i { width: 11px; height: 11px; border-radius: 50%; background: #ff5f57; } .mac .bar i + i { background: #febc2e; } .mac .bar i + i + i { background: #28c840; }
.mac .win .scr, .mac .win > .dimmer { inset: 28px 0 0 0; border-radius: 0; }
.mac .win > img { position: absolute; top: 28px; left: 0; width: 100%; height: calc(100% - 28px); border-radius: 0; }`;
    document.head.append(ds);
    f.querySelectorAll('.phone').forEach((ph) => {
      const l = ph.offsetLeft, t = ph.offsetTop, w = ph.offsetWidth, h = ph.offsetHeight, cx = l + w / 2;
      const ins = [...ph.querySelectorAll('.scr .in')];
      const iw0 = w - 20;
      if (dev.startsWith('ipad')) {
        const W = Math.round((h * 3) / 4), iw = W - 26, ih = h - 26;
        // a bigger headline pushes the iPad down rather than shrinking
        // (measured where it is seen: the owner's move and scale included)
        Object.assign(ph.style, { left: cx - W / 2 + 'px', width: W + 'px' });
        const hh = f.querySelector('h1'), fb = f.getBoundingClientRect(), fs = fb.width / f.offsetWidth;
        const seenTop = (ph.getBoundingClientRect().top - fb.top) / fs, need = hh ? hh.offsetTop + hh.offsetHeight + 26 : 0;
        const t2 = t + Math.max(0, need - seenTop);
        ph.style.top = t2 + 'px';
        ph.classList.add('ipad');
        const nl = cx - W / 2;
        ins.forEach((el) => follow({ l, t, r: l + w, b: t + h }, parseFloat(getComputedStyle(el).getPropertyValue('--k')) || iw0 / 390, [l + 10, t + 10], [nl + 13, t2 + 13], relay(el, (iw * 0.8) / 390, iw, ih)));
      } else if (dev.startsWith('iphone')) {
        // 6.9 and 6.3: the Dynamic Island; 6.5 and 5.5: the notch (5.5 an iPhone 12-style phone, not an old one: Mir)
        const notch = dev === 'iphone65' || dev === 'iphone55';
        if (dev === 'iphone55') ph.style.boxShadow = '0 0 0 3px #4a4a50, 0 0 0 4px #8a8a92, 0 30px 60px rgba(90, 30, 5, .32)'; // flat steel edge
        const isl = document.createElement('div');
        isl.className = 'island';
        const iwid = notch ? iw0 * 0.55 : iw0 * 0.29, ihgt = notch ? iw0 * 0.078 : iw0 * 0.085, itop = notch ? 10 : 10 + iw0 * 0.026;
        Object.assign(isl.style, { width: iwid + 'px', height: ihgt + 'px', marginLeft: -iwid / 2 + 'px', top: itop + 'px', borderRadius: notch ? `0 0 ${ihgt * 0.75}px ${ihgt * 0.75}px` : ihgt / 2 + 'px' });
        ph.append(isl);
      } else if (dev === 'mac') {
        const H = Math.min(h, 956 - 26 - t), deck = Math.round(H * 0.055), Ws = Math.round((H - deck) * 1.5);
        Object.assign(ph.style, { left: cx - Ws / 2 + 'px', width: Ws + 'px', height: H + 'px' });
        ph.style.setProperty('--deck', deck + 'px');
        ph.classList.add('mac');
        const kids = [...ph.childNodes];
        ph.innerHTML = '<div class="lid"><div class="notch"></div><div class="desk"><div class="win"><div class="bar"><i></i><i></i><i></i></div></div></div></div><div class="deck"></div>';
        const win = ph.querySelector('.win');
        kids.forEach((c) => win.append(c));
        const winH = (H - deck - 26) * 0.88, winW = ((winH - 28) * 390) / 844;
        Object.assign(win.style, { width: winW + 'px', marginLeft: -winW / 2 + 'px' });
        ins.forEach((el) => el.style.setProperty('--k', winW / 390));
      }
    });
  }
  // a wider canvas than the frame (iPad, ?w=): the frame keeps its proportions, centred, its field running edge to edge
  const cw = +Q.get('w'), fz = +(Q.get('fit') || 1);
  if (cw && cw > 440 * fz + 1) {
    d.style.background = getComputedStyle(f).background;
    document.body.style.cssText += ';background:transparent;display:flex;justify-content:center;min-height:100vh';
    f.style.background = 'transparent';
    f.style.overflow = 'visible'; // pieces that ran off the frame's edge continue onto the wider field
  }
  // on every size: the app's own words that a lifted card already shows bigger are hidden, so they don't show through
  // under it (Mir: "FIX ARROW AND STUFF ON ALL SCREENS")
  {
    const lifted = [...f.children].filter((c) => !c.classList.contains('phone') && c.tagName !== 'svg' && c.tagName !== 'H1').map((c) => c.textContent.replace(/\s+/g, ' '));
    f.querySelectorAll('.phone .scr *').forEach((el) => {
      if (![...el.childNodes].some((n) => n.nodeType === 3 && n.nodeValue.trim())) return;
      const t = el.textContent.replace(/\s+/g, ' ').trim().slice(0, 40);
      if (t.length > 20 && lifted.some((x) => x.includes(t))) el.style.visibility = 'hidden';
    });
  }
  // the last fit, after every move, zoom and device: a one-line text or one that would end in an ellipsis shrinks until
  // it fits whole (zoomed text can come out a pixel wider than it measured)
  await document.fonts.ready;
  f.querySelectorAll('.one, *').forEach((el) => {
    if (!el.classList.contains('one') && getComputedStyle(el).textOverflow !== 'ellipsis') return;
    let px = parseFloat(getComputedStyle(el).fontSize);
    for (let i = 0; i < 20 && el.scrollWidth > el.clientWidth; i++) { px *= 0.97; el.style.fontSize = px + 'px'; }
  });
  d.dataset.ready = '1';
  if (shot) return;

  // ------------------------------------------------------------------ editing
  const save = (el) => fetch('/__edits', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ dir, key: key(el), value: Object.keys(edits[el.dataset.e] || {}).length ? edits[el.dataset.e] : null }) }).catch(() => {});
  const zoom = () => (embed ? 1 : parseFloat(getComputedStyle(d).getPropertyValue('--z')) || 1);
  const sel = new Set();
  st.textContent += '.f [data-e]{cursor:grab}.f svg.arrow{pointer-events:none}.f svg.arrow .hit{pointer-events:stroke;cursor:grab}'
    + '.f .sel{outline:2px solid #ef7a45!important;outline-offset:3px}.f svg.arrow.sel{outline:none!important}'
    + '.band{position:absolute;z-index:99;border:1.5px dashed #ef7a45;background:rgba(239,122,69,.08);pointer-events:none}'
    + '.hdl{position:absolute;z-index:100;width:16px;height:16px;margin:-8px 0 0 -8px;border-radius:50%;background:#fff;border:3px solid #ef7a45;cursor:move;box-shadow:0 2px 6px rgba(0,0,0,.3)}'
    + '.tools{position:fixed;left:50%;bottom:8px;transform:translateX(-50%);display:flex;flex-wrap:wrap;justify-content:center;max-width:96vw;gap:4px;align-items:center;font:600 12px/1 -apple-system,system-ui,sans-serif;color:#f4f1ea;background:#1c1c20;padding:6px;border-radius:12px;white-space:nowrap;z-index:200}'
    + '.tools button{font:inherit;color:inherit;background:#2a2a30;border:0;border-radius:8px;padding:7px 9px;cursor:pointer}.tools button:hover{background:#3a3a42}.tools button:disabled{opacity:.35;cursor:default}'
    + '.tools .info{color:#8d8a92;padding:0 6px}';
  const bar = document.createElement('div');
  bar.className = 'tools';
  document.body.append(bar);
  const each = (fn) => { sel.forEach((el) => { const v = (edits[el.dataset.e] ||= {}); fn(v, el); apply(el); save(el); }); };
  const round = (x) => Math.round(x * 100) / 100;
  const tools = [
    ['Bigger', '+', () => each((v) => { v.s = round((v.s || 1) * 1.06); })],
    ['Smaller', '−', () => each((v) => { v.s = round(Math.max(0.2, (v.s || 1) / 1.06)); })],
    ['Opacity −', '[', () => each((v) => { v.o = round(Math.max(0.05, (v.o ?? 1) - 0.1)); })],
    ['Opacity +', ']', () => each((v) => { v.o = round(Math.min(1, (v.o ?? 1) + 0.1)); if (v.o === 1) delete v.o; })],
    ['Dim screen −', ',', () => each((v, el) => { if (el.querySelector(':scope > .dimmer')) { v.dim = round(Math.max(0, (v.dim || 0) - 0.1)); if (!v.dim) delete v.dim; } }), 'phone'],
    ['Dim screen +', '.', () => each((v, el) => { if (el.querySelector(':scope > .dimmer')) v.dim = round(Math.min(0.95, (v.dim || 0) + 0.1)); }), 'phone'],
    ['Forward', 'F', () => each((v) => { v.z = (v.z ?? 10) + 5; })],
    ['Back', 'B', () => each((v) => { v.z = (v.z ?? 10) - 5; })],
    ['Reset', '0', () => { sel.forEach((el) => { delete edits[el.dataset.e]; apply(el); save(el); }); }],
  ];
  const draw = () => {
    pieces.forEach((el) => el.classList.toggle('sel', sel.has(el)));
    const phone = [...sel].some((el) => el.classList.contains('phone'));
    bar.replaceChildren();
    const info = document.createElement('span');
    info.className = 'info';
    info.textContent = sel.size ? `${sel.size} selected` : 'Click to select · Shift-click or drag a box for more · drag to move · Option rotate · Cmd resize';
    bar.style.display = embed && !sel.size ? 'none' : ''; // in the gallery the bar only shows while something is selected
    bar.append(info);
    if (sel.size) tools.forEach(([label, k, fn, only]) => { if (only === 'phone' && !phone) return; const b = document.createElement('button'); b.textContent = `${label}  ${k}`; b.onclick = (e) => { e.stopPropagation(); fn(); handles(); }; bar.append(b); });
    handles();
  };
  // an arrow alone in the selection gets handles for its start, bend and end
  let hdls = [];
  const handles = () => {
    hdls.forEach((h) => h.remove());
    hdls = [];
    const only = sel.size === 1 && [...sel][0];
    if (!only || !only.matches('svg.arrow[data-pts]')) return;
    const v = (edits[only.dataset.e] ||= {});
    const pts = v.pts || only.dataset.pts.split(',').map(Number);
    [0, 2, 4].forEach((i) => {
      const h = document.createElement('div');
      h.className = 'hdl';
      const place = () => { h.style.left = pts[i] + (v.x || 0) + 'px'; h.style.top = pts[i + 1] + (v.y || 0) + 'px'; };
      place();
      h.addEventListener('pointerdown', (e) => {
        e.preventDefault(); e.stopPropagation();
        h.setPointerCapture(e.pointerId);
        const x0 = e.clientX, y0 = e.clientY, b = [pts[i], pts[i + 1]];
        const mv = (m) => { pts[i] = Math.round(b[0] + (m.clientX - x0) / zoom()); pts[i + 1] = Math.round(b[1] + (m.clientY - y0) / zoom()); v.pts = pts; drawArrow(only, pts); place(); };
        const up = () => { h.removeEventListener('pointermove', mv); h.removeEventListener('pointerup', up); save(only); };
        h.addEventListener('pointermove', mv); h.addEventListener('pointerup', up);
      });
      f.append(h);
      hdls.push(h);
    });
  };
  pieces.forEach((el) => {
    el.addEventListener('pointerdown', (e) => {
      if (e.target.classList.contains('hdl')) return;
      e.preventDefault();
      e.stopPropagation();
      if (e.shiftKey) { sel.has(el) ? sel.delete(el) : sel.add(el); draw(); return; }
      if (!sel.has(el)) { sel.clear(); sel.add(el); draw(); }
      const x0 = e.clientX, y0 = e.clientY;
      const base = new Map([...sel].map((s) => [s, { ...(edits[s.dataset.e] || {}) }]));
      el.setPointerCapture(e.pointerId);
      const move = (m) => {
        const dx = (m.clientX - x0) / zoom(), dy = (m.clientY - y0) / zoom();
        sel.forEach((s) => {
          const b = base.get(s), v = (edits[s.dataset.e] ||= {});
          if (e.altKey) v.r = Math.round((b.r || 0) + dx / 3);
          else if (e.metaKey || e.ctrlKey) v.s = round(Math.max(0.2, (b.s || 1) * (1 - dy / 300)));
          else { v.x = Math.round((b.x || 0) + dx); v.y = Math.round((b.y || 0) + dy); }
          apply(s);
        });
        handles();
      };
      const up = () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', up); sel.forEach(save); };
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerup', up);
    });
  });
  // drag a box on empty space to select everything it touches; a click on empty space clears the selection
  f.addEventListener('pointerdown', (e) => {
    if (e.target !== f && !e.target.classList.contains('blob')) return;
    e.preventDefault();
    const r0 = f.getBoundingClientRect(), z = zoom();
    const sx = (e.clientX - r0.left) / z, sy = (e.clientY - r0.top) / z;
    const band = document.createElement('div');
    band.className = 'band';
    f.append(band);
    f.setPointerCapture(e.pointerId);
    let box = null;
    const move = (m) => {
      const x = (m.clientX - r0.left) / z, y = (m.clientY - r0.top) / z;
      box = { l: Math.min(sx, x), t: Math.min(sy, y), r: Math.max(sx, x), b: Math.max(sy, y) };
      Object.assign(band.style, { left: box.l + 'px', top: box.t + 'px', width: box.r - box.l + 'px', height: box.b - box.t + 'px' });
    };
    const up = () => {
      f.removeEventListener('pointermove', move); f.removeEventListener('pointerup', up); band.remove();
      if (!e.shiftKey) sel.clear();
      if (box && box.r - box.l > 4) pieces.forEach((el) => {
        const t = el.matches('svg.arrow') ? el.querySelector('path:not(.hit)') : el;
        const r = t.getBoundingClientRect();
        const p = { l: (r.left - r0.left) / z, t: (r.top - r0.top) / z, r: (r.right - r0.left) / z, b: (r.bottom - r0.top) / z };
        if (p.l < box.r && p.r > box.l && p.t < box.b && p.b > box.t) sel.add(el);
      });
      draw();
    };
    f.addEventListener('pointermove', move); f.addEventListener('pointerup', up);
  });
  addEventListener('keydown', (e) => {
    if (!sel.size || e.target.isContentEditable) return;
    const t = tools.find(([, k]) => k === e.key || (k === '−' && e.key === '-') || (k === '+' && e.key === '='));
    if (t) { e.preventDefault(); t[2](); handles(); return; }
    const n = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
    if (n) { e.preventDefault(); const k = e.shiftKey ? 10 : 1; each((v) => { v.x = (v.x || 0) + n[0] * k; v.y = (v.y || 0) + n[1] * k; }); handles(); }
    if (e.key === 'Escape') { sel.clear(); draw(); }
  });
  pieces.forEach((el) => el.addEventListener('dblclick', (e) => { e.stopPropagation(); delete edits[el.dataset.e]; apply(el); save(el); handles(); }));
  draw();
})();
