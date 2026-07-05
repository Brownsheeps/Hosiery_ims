// Lightweight test server (no package.json) that proxies inventory and provides a /test/search endpoint.
// Run with: `node server-test/index.js`

const http = require("http");
const { URL } = require("url");

const PORT = process.env.PORT ? Number(process.env.PORT) : 5001;
// Adjust this to point to your main backend if needed
const BACKEND_BASE = process.env.BACKEND_BASE || "http://localhost:5000";

async function fetchInventory() {
  const res = await fetch(`${BACKEND_BASE}/api/inventory?page=1&pageSize=100`);
  return res.json();
}

function sendJson(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

const server = http.createServer(async (req, res) => {
  try {
    const u = new URL(req.url, `http://localhost:${PORT}`);

    if (u.pathname === "/test/search") {
      const q = (u.searchParams.get("q") || "").toLowerCase();

      const json = await fetchInventory();
      const items = (json?.data?.items || []).filter((it) => {
        if (!q) return true;
        return (
          String(it.sku).toLowerCase().includes(q) ||
          String(it.product).toLowerCase().includes(q)
        );
      });

      // Return similar shape as inventory endpoint
      return sendJson(res, 200, {
        success: true,
        message: "OK",
        data: { items },
      });
    }

    // default info
    if (u.pathname === "/") {
      return sendJson(res, 200, {
        success: true,
        message: "Test server running",
      });
    }

    sendJson(res, 404, { success: false, message: "Not found" });
  } catch (err) {
    console.error(err);
    sendJson(res, 500, { success: false, message: String(err) });
  }
});

server.listen(PORT, () => {
  console.log(`Test server listening on http://0.0.0.0:${PORT}`);
  console.log(`Proxying inventory from ${BACKEND_BASE}`);
});
