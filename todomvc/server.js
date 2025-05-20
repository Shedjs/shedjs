import { createServer } from 'http';
import { readFile } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = createServer((req, res) => {
  const filePath = path.join(
    __dirname,
    req.url === '/' ? 'index.html' : req.url
  );

  // MIME type mapping
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
  };

  const extname = path.extname(filePath);
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // Fallback to index.html for SPAs (e.g., React/Vue)
        readFile(path.join(__dirname, 'index.html'), (err, data) => {
          res.writeHead(err ? 404 : 200, {
            'Content-Type': 'text/html',
          });
          res.end(err ? '404 Not Found' : data);
        });
      } else {
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
