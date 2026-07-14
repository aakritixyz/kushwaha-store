export default async function handler(req, res) {
  try {
    const { default: appHandler } = await import("../server.js");
    return await appHandler(req, res);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: error?.message || "Kushwaha Store API failed to start"
    });
  }
}
