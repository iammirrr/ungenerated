// Serves the repo for the screenshot board, and keeps the owner's edits:
//   node <skill>/scripts/serve.mjs [port=5199]      (run from the repo root)
// Static files with no caching (a reload always shows the latest), plus:
//   GET  /__edits?dir=<folder>          that folder's edits.json ({} when none)
//   POST /__edits {dir, key, value}     set one edit (value null removes it); only in a folder holding screens.json
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, existsSync, statSync, renameSync } from 'node:fs';
import { join, normalize, extname, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const PORT = +(process.argv[2] || 5199);
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.woff2': 'font/woff2' };
const inside = (p) => { const full = normalize(join(ROOT, p)); return full.startsWith(ROOT) ? full : null; };
const folder = (dir) => { const full = inside(dir || ''); return full && existsSync(join(full, 'screens.json')) ? full : null; };

createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  const send = (code, body, type = 'application/json') => { res.writeHead(code, { 'Content-Type': type, 'Cache-Control': 'no-store' }); res.end(body); };
  if (url.pathname === '/__edits') {
    if (req.method === 'GET') {
      const f = folder(url.searchParams.get('dir'));
      return send(200, f && existsSync(join(f, 'edits.json')) ? readFileSync(join(f, 'edits.json')) : '{}');
    }
    let body = '';
    req.on('data', (c) => { body += c; if (body.length > 1e6) req.destroy(); });
    req.on('end', () => {
      try {
        const { dir, key, value } = JSON.parse(body);
        const f = folder(dir);
        if (!f || typeof key !== 'string' || key.length > 200) return send(400, '{"error":"bad request"}');
        const file = join(f, 'edits.json');
        const all = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {};
        if (value == null) delete all[key]; else all[key] = value;
        writeFileSync(file + '.tmp', JSON.stringify(all, null, 1) + '\n');
        renameSync(file + '.tmp', file);
        send(200, '{"ok":true}');
      } catch { send(400, '{"error":"bad json"}'); }
    });
    return;
  }
  let p = inside(decodeURIComponent(url.pathname));
  if (p && existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html');
  if (!p || !existsSync(p)) return send(404, 'not found', 'text/plain');
  send(200, readFileSync(p), TYPES[extname(p)] || 'application/octet-stream');
}).listen(PORT, '127.0.0.1', () => console.log(`Screenshot board: http://127.0.0.1:${PORT}/  (serving ${ROOT})`));
