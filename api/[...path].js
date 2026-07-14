export default async function handler(req, res) {
  try {
    const originalUrl = req.url || "/";
    if (originalUrl === "/" || originalUrl === "/health" || originalUrl === "/api/health") {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      return res.end(JSON.stringify({
        ok: true,
        name: "Kushwaha Store",
        driver: process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY ? "supabase" : "local-json",
        time: new Date().toISOString()
      }));
    }
    if (!originalUrl.startsWith("/api/")) {
      req.url = `/api${originalUrl.startsWith("/") ? originalUrl : `/${originalUrl}`}`;
    }
    const { default: appHandler } = await import("../server.js");
    return await appHandler(req, res);
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.end(JSON.stringify({
      error: error?.message || "Kushwaha Store API failed to start"
    }));
  }
}
