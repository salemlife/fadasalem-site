import type { VercelRequest, VercelResponse } from "@vercel/node";
import { del } from "@vercel/blob";

// fix — companion to rpsd-upload.ts: replaces the DELETE branch of the old
// rpsd_upload.php with a call to Vercel Blob's del(). Same shared-secret
// check as before (X-Api-Key header), just no PHP host required.
//
// This runs as a plain Node.js Function (NOT Edge, unlike rpsd-upload.ts)
// because @vercel/blob's del() depends on Node-only built-ins (node:http,
// node:stream, node:tls, etc.) that the Edge runtime doesn't support —
// confirmed by Vercel's own deploy-time error the first time this shipped
// as an Edge function: "The Edge Function api/rpsd-delete is referencing
// unsupported modules: node:stream, node:net, node:tls, ...". The upload
// side (api/rpsd-upload.ts) only touches @vercel/blob/client, which is
// Edge-safe, so that one is unaffected.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "DELETE") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKeyHeader = req.headers["x-api-key"];
  const apiKey = Array.isArray(apiKeyHeader) ? apiKeyHeader[0] : apiKeyHeader;
  if (!apiKey || apiKey !== process.env.RPSD_API_KEY) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const { url } = (req.body || {}) as { url?: string };
    if (!url || !/^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//.test(url)) {
      res.status(400).json({ error: "Invalid URL" });
      return;
    }
    await del(url);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Delete failed",
    });
  }
}
