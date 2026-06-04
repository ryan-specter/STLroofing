import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = path.join(__dirname, "site");
const PORT = Number(process.env.PORT) || 4173;
const HOST = process.env.HOST || "127.0.0.1";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".m3u8": "application/vnd.apple.mpegurl",
  ".ts": "video/mp2t",
  ".mp4": "video/mp4",
  ".txt": "text/plain; charset=utf-8",
};

function contentType(filePath) {
  return MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream";
}

function resolvePath(urlPathname) {
  const decoded = decodeURIComponent(urlPathname.split("?")[0]);
  let relative = decoded.replace(/^\/+/, "") || "index.html";

  if (relative.endsWith("/")) {
    relative += "index.html";
  }

  const filePath = path.normalize(path.join(SITE_ROOT, relative));
  if (!filePath.startsWith(SITE_ROOT)) {
    return null;
  }
  return filePath;
}

async function sendFile(res, filePath) {
  const body = await fs.readFile(filePath);
  res.writeHead(200, { "Content-Type": contentType(filePath) });
  res.end(body);
}

const server = http.createServer(async (req, res) => {
  try {
    const filePath = resolvePath(req.url || "/");
    if (!filePath) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    try {
      const stat = await fs.stat(filePath);
      if (stat.isDirectory()) {
        await sendFile(res, path.join(filePath, "index.html"));
        return;
      }
      await sendFile(res, filePath);
      return;
    } catch {
      // fall through
    }

    const htmlFallback = resolvePath("/index.html");
    if (htmlFallback) {
      await sendFile(res, htmlFallback);
      return;
    }

    res.writeHead(404);
    res.end("Not Found");
  } catch (error) {
    console.error(error);
    res.writeHead(500);
    res.end("Internal Server Error");
  }
});

server.listen(PORT, HOST, () => {
  console.log(`STLroofing preview: http://${HOST}:${PORT}/`);
  console.log(`Contact page:       http://${HOST}:${PORT}/contact.html`);
});
