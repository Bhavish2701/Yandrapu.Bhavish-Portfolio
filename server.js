const http = require('http');
const fs = require('fs');
const path = require('path');

let PORT = parseInt(process.env.PORT || '5500', 10);
const BASE_DIR = __dirname;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    let reqPath = decodeURI(req.url.split('?')[0]);
    if (reqPath === '/' || reqPath === '') {
        reqPath = '/Portfolio.html';
    }

    const filePath = path.join(BASE_DIR, reqPath);

    // Prevent directory traversal
    if (!filePath.startsWith(BASE_DIR)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        return res.end('Forbidden');
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            return res.end('404 Not Found');
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, {
            'Content-Type': contentType,
            'Cache-Control': 'no-cache'
        });

        fs.createReadStream(filePath).pipe(res);
    });
});

function startServer(portToTry) {
    server.listen(portToTry, () => {
        console.log(`Portfolio live server running at http://localhost:${portToTry}`);
    });
}

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        PORT++;
        console.log(`Port busy, retrying on http://localhost:${PORT}...`);
        startServer(PORT);
    } else {
        console.error('Server error:', err);
    }
});

startServer(PORT);
