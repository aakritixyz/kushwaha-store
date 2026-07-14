export default async function handler(req, res) {
  try {
    req.url = "/api/bootstrap";
    const { default: appHandler } = await import("../server.js");
    return await appHandler(req, res);
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.end(JSON.stringify({
      error: error?.message || "Kushwaha Store bootstrap failed"
    }));
  }
}
