export default function handler(_req, res) {
  res.status(200).json({
    ok: true,
    name: "Kushwaha Store",
    driver: process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY ? "supabase" : "local-json",
    time: new Date().toISOString()
  });
}
