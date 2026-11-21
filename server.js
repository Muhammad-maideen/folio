const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm'
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Handle /_next/image?url=...
  if (pathname === '/_next/image') {
    const targetUrl = parsedUrl.query.url;
    if (targetUrl) {
      let targetPath = targetUrl.replace(/^\//, '');
      const filePath = path.join(ROOT, targetPath);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, {
          'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
          'Cache-Control': 'public, max-age=31536000, immutable'
        });
        return fs.createReadStream(filePath).pipe(res);
      }
    }
  }

  // Normalize path
  if (pathname === '/') {
    pathname = '/index.html';
  }

  let filePath = path.join(ROOT, pathname);

  // Try direct file
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    // Try pathname/index.html
    const tryIndex = path.join(filePath, 'index.html');
    if (fs.existsSync(tryIndex) && fs.statSync(tryIndex).isFile()) {
      filePath = tryIndex;
    } else {
      // Try pathname + '.html'
      const tryHtml = filePath + '.html';
      if (fs.existsSync(tryHtml) && fs.statSync(tryHtml).isFile()) {
        filePath = tryHtml;
      }
    }
  }

  // If still not found, try 404
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    const notFoundPath = path.join(ROOT, 'not-found', 'index.html');
    if (fs.existsSync(notFoundPath)) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      return fs.createReadStream(notFoundPath).pipe(res);
    }
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('404 Not Found');
  }

  const ext = path.extname(filePath).toLowerCase();
  const stat = fs.statSync(filePath);

  // Video streaming support (Range headers)
  if (ext === '.mp4' || ext === '.webm') {
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
      const chunksize = (end - start) + 1;
      const fileStream = fs.createReadStream(filePath, { start, end });
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': MIME_TYPES[ext] || 'video/mp4'
      });
      return fileStream.pipe(res);
    }
  }

  res.writeHead(200, {
    'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
    'Content-Length': stat.size,
    'Accept-Ranges': 'bytes'
  });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
