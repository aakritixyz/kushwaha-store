export default function handler(_req, res) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify({
    ok: true,
    name: "Kushwaha Store",
    driver: process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY ? "supabase" : "local-json",
    time: new Date().toISOString()
  }));
}
