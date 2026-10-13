// Serves the board locally and keeps Picks and Notes in review/store.json, so a review done on
// this computer, or on a phone on the same Wi-Fi, lands in the repo where the next pass reads it.
// Usage: node tools/serve.mjs [port]
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { extname, join, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { networkInterfaces } from 'node:os';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const storeFile = join(root, 'review', 'store.json');
const port = Number(process.argv[2] || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.json': 'application/json', '.woff2': 'font/woff2' };
const readStore = async () => { try { return JSON.parse(await readFile(storeFile, 'utf8')); } catch { return { notes: {}, picks: {} }; } };
const body = (req) => new Promise((ok) => { let b = ''; req.on('data', (c) => (b += c)); req.on('end', () => ok(b)); });

createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (path === '/api/store') {
      if (req.method === 'POST') {
        const { coll, id, data } = JSON.parse(await body(req));
        if (!['notes', 'picks'].includes(coll) || !/^[\w.-]{1,80}$/.test(id)) throw new Error('bad request');
        const store = await readStore();
        store[coll] = store[coll] || {};
        if (data === null) delete store[coll][id]; else store[coll][id] = data;
        await mkdir(dirname(storeFile), { recursive: true });
        await writeFile(storeFile, JSON.stringify(store, null, 2));
      }
      res.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' });
      return res.end(JSON.stringify(await readStore()));
    }
    const file = normalize(join(root, path === '/' ? 'index.html' : path));
    if (!file.startsWith(root) || file.includes('/review/')) throw new Error('outside');
    const data = await readFile(file);
    res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' });
    res.end(data);
  } catch {
    if (!res.headersSent) res.writeHead(404);
    res.end('not found');
  }
}).listen(port, '0.0.0.0', () => {
  const lan = Object.values(networkInterfaces()).flat().filter((i) => i && i.family === 'IPv4' && !i.internal).map((i) => i.address);
  console.log(`Board on http://localhost:${port}/` + lan.map((ip) => `  ·  phone on this Wi-Fi: http://${ip}:${port}/`).join(''));
});
