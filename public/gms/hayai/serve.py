#!/usr/bin/env python3
import gzip
import http.server
import os
import sys

MIME_TYPES = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".wasm": "application/wasm",
    ".pck": "application/octet-stream",
    ".png": "image/png",
}

COMPRESS_EXTS = {".js", ".wasm", ".pck", ".html"}


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cross-Origin-Opener-Policy", "same-origin")
        self.send_header("Cross-Origin-Embedder-Policy", "require-corp")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        super().end_headers()

    def do_GET(self):
        path = self.translate_path(self.path)
        _, ext = os.path.splitext(path)
        if (
            ext in COMPRESS_EXTS
            and "gzip" in self.headers.get("Accept-Encoding", "")
            and os.path.isfile(path)
        ):
            with open(path, "rb") as f:
                data = gzip.compress(f.read())
            self.send_response(200)
            self.send_header("Content-Type", MIME_TYPES.get(ext, "application/octet-stream"))
            self.send_header("Content-Encoding", "gzip")
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)
            return
        super().do_GET()

    def guess_type(self, path):
        _, ext = os.path.splitext(path)
        return MIME_TYPES.get(ext, super().guess_type(path))


port = int(sys.argv[1]) if len(sys.argv) > 1 else 8061
print(f"Serving at http://localhost:{port}/index.html")
http.server.HTTPServer(("", port), Handler).serve_forever()
