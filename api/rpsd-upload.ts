import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

// fix — replaces rpsd_upload.php (which needed a PHP-capable server like
// o2switch). This site now deploys on Vercel like the rest of the SALEM
// web properties, and Vercel doesn't run PHP — so the RPSD weekly-bulletin
// upload feature moves to Vercel Blob storage instead, using the same
// "direct client upload, server only issues a short-lived token" pattern
// as the Podcasts upload feature on the main Salem School of Witnessing
// app.
//
// Runs as a plain Node.js Function, NOT Edge (this was tried as Edge
// first and rejected at deploy time: "The Edge Function api/rpsd-upload
// is referencing unsupported modules: @vercel: stream, crypto - undici:
// node:stream, node:net, ..." — handleUpload() needs Node's real crypto
// module to sign upload tokens, which the Edge runtime doesn't provide).
// handleUpload() itself expects a Fetch-standard Request object (that's
// how it reads headers for the upload-completed webhook signature), so
// this builds a minimal one from Vercel's Node-style req rather than
// switching upload() away from the direct-to-blob pattern — a plain
// multipart POST through this function would hit Vercel's ~4.5MB Node
// function payload limit and break uploads for anything near the 10MB
// cap, which is the whole reason the direct-to-blob flow exists.
const ALLOWED_CONTENT_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB — same cap as the old PHP script

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (typeof value === "string") headers.set(key, value);
    else if (Array.isArray(value)) headers.set(key, value.join(", "));
  }
  const host = req.headers.host ?? "localhost";
  const request = new Request(`https://${host}${req.url ?? "/api/rpsd-upload"}`, {
    method: "POST",
    headers,
  });

  try {
    const jsonResponse = await handleUpload({
      body: req.body as HandleUploadBody,
      request,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        // The RPSD admin UI (already gated behind Firebase admin login,
        // see firebase.ts's adminLogin/onAuthChange) sends a shared secret
        // in clientPayload. It must match the RPSD_API_KEY environment
        // variable set on this Vercel project — see DEPLOY.md for setup.
        let apiKey: string | undefined;
        try {
          apiKey = clientPayload ? JSON.parse(clientPayload).apiKey : undefined;
        } catch {
          apiKey = undefined;
        }
        if (!apiKey || apiKey !== process.env.RPSD_API_KEY) {
          throw new Error("Unauthorized");
        }
        return {
          allowedContentTypes: ALLOWED_CONTENT_TYPES,
          maximumSizeInBytes: MAX_SIZE,
          addRandomSuffix: false,
        };
      },
      onUploadCompleted: async () => {
        // No follow-up needed — the admin dashboard (RPSDSection.tsx)
        // saves the returned blob URL into Firestore itself once the
        // client-side upload() call resolves.
      },
    });

    res.status(200).json(jsonResponse);
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Upload failed",
    });
  }
}
