Test server for development

This lightweight test server proxies the main backend inventory endpoint and exposes a /test/search endpoint.

Requirements

- Node 18+ (for global fetch)

Run

```bash
node server-test/index.js
```

You can change the backend address with the `BACKEND_BASE` env var, and the server port with `PORT`.

Example:

```bash
BACKEND_BASE=http://localhost:5000 PORT=5001 node server-test/index.js
```
