const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // Decode URI component to handle file names with spaces correctly
  let decodedUrl = decodeURIComponent(req.url);
  let filePath = decodedUrl === '/' ? './index.html' : '.' + decodedUrl;
  filePath = filePath.split('?')[0]; // Strip query parameters
  
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';
  
  // Resolve absolute path to restrict access to workspace
  const resolvedPath = path.resolve(filePath);
  const workspacePath = path.resolve('.');
  
  if (!resolvedPath.startsWith(workspacePath)) {
    res.writeHead(403, { 'Content-Type': 'text/html' });
    res.end('<h1>403 Forbidden</h1>', 'utf-8');
    return;
  }
  
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>', 'utf-8');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end(`<h1>500 Internal Server Error</h1><p>${error.code}</p>`, 'utf-8');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log('==================================================');
  console.log(`🚀 Portfolio local server is running!`);
  console.log(`👉 Open: http://localhost:${PORT}/ in your browser`);
  console.log(`⌨️  Press Ctrl+C to stop the server`);
  console.log('==================================================');
});
