import { createServer } from 'http';
import { readFile } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = createServer((req, res) => {
  let filePath;

  // Handle all requests to files in /shedjs/
  if (req.url.startsWith('/shedjs/')) {
    filePath = path.join(__dirname, '../shedjs', req.url.replace('/shedjs/', ''));
  }
  // Handle all other requests
  else {
    filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  }

  // MIME type mapping
  const mimeTypes = {
    '.css': 'text/css',
    '.png': 'image/png',
    '.html': 'text/html',
    '.json': 'application/json',
    '.js': 'application/javascript'
  };

  const extname = path.extname(filePath);
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // File not found - serve index.html for SPA routing
        readFile(path.join(__dirname, 'index.html'), (err, data) => {
          res.writeHead(err ? 404 : 200, {
            'Content-Type': 'text/html',
          });
          res.end(err ? '404 Not Found' : data);
        });
      } else {
        // Server error
        res.writeHead(500);
        res.end('Server Error: ' + error.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
