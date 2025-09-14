from http.server import HTTPServer, SimpleHTTPRequestHandler


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


if __name__ == "__main__":
    try:
        print("Server started at http://0.0.0.0:8000/")
        HTTPServer(("0.0.0.0", 8000), NoCacheHandler).serve_forever()
    except KeyboardInterrupt:
        print("Server stopped.")
