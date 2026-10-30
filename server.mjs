import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const portArgument = process.argv.indexOf('--port');
const port = Number(portArgument >= 0 ? process.argv[portArgument + 1] : process.env.PORT || 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('Port tidak valid. Contoh: node server.mjs --port 3001');
  process.exit(1);
}
const types = {
  '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8',
  '.js':'text/javascript; charset=utf-8', '.png':'image/png',
  '.woff2':'font/woff2', '.woff':'font/woff', '.txt':'text/plain; charset=utf-8',
};
const server = http.createServer((request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, {'Allow':'GET, HEAD'}); response.end(); return;
  }
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
  catch { response.writeHead(400); response.end('Bad request'); return; }
  const filename = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  const relative = path.relative(root, filename);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    response.writeHead(403); response.end('Forbidden'); return;
  }
  fs.stat(filename, (error, stat) => {
    if (error || !stat.isFile()) { response.writeHead(404); response.end('Not found'); return; }
    response.writeHead(200, {
      'Content-Type': types[path.extname(filename)] || 'application/octet-stream',
      'Content-Length': stat.size,
      'X-Content-Type-Options':'nosniff',
      'Cache-Control':'no-cache',
    });
    if (request.method === 'HEAD') { response.end(); return; }
    const stream = fs.createReadStream(filename);
    stream.on('error', () => response.destroy()); stream.pipe(response);
  });
});
server.on('error', error => {
  console.error(error.code === 'EADDRINUSE'
    ? `Port ${port} sudah digunakan. Coba: node server.mjs --port ${port + 1}`
    : error.message);
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => console.log(`LakuLab berjalan di http://localhost:${port}`));
