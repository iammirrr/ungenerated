// Serves the example board straight from source while you work on it: examples/ over the
// design-board template, with board.config.js and css/kits.css generated on each request.
// No build, so several people (or agents) can work on different apps at once.
//   node scripts/dev.mjs [port]      then open http://127.0.0.1:<port>/board/
//   /board/embed.html#<screen-id>    one screen, looping
//   /board/embed.html#flow=<flow-id> a whole flow, step by step
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readExamples, boardConfig, kitsCss } from './board-config.mjs';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const port = Number(process.argv[2] || 5310);
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const exists = async (p) => { try { return (await stat(p)).isFile(); } catch { return false; } };

createServer(async (req, res) => {
  try {
    let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (path === '/' || path === '/board') { res.writeHead(302, { location: '/board/' }); return res.end(); }
    if (!path.startsWith('/board/')) { res.writeHead(404); return res.end(); }
    let rel = normalize(path.slice('/board/'.length) || 'index.html').replace(/\\/g, '/');
    if (rel.endsWith('/')) rel += 'index.html';
    if (rel.startsWith('..')) throw new Error('bad path');
    const send = (body, type) => { res.writeHead(200, { 'content-type': type, 'cache-control': 'no-store' }); res.end(body); };
    if (rel === 'board.config.js') return send(boardConfig(readExamples(root)), TYPES['.js']);
    if (rel === 'css/kits.css') return send(kitsCss(readExamples(root)), TYPES['.css']);
    for (const base of [join(root, 'examples'), join(root, 'skills/design-board/template')]) {
      const f = join(base, rel);
      if (await exists(f)) return send(await readFile(f), TYPES[extname(f)] || 'application/octet-stream');
    }
    res.writeHead(404);
    res.end();
  } catch (e) {
    res.writeHead(500);
    res.end(String(e.message));
  }
}).listen(port, '127.0.0.1', () => console.log(`Example board: http://127.0.0.1:${port}/board/`));
