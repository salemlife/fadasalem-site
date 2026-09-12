import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

// fix — replaces rpsd_upload.php (which needed a PHP-capable server like
// o2switch). This site now deploys on Vercel like the rest of the SALEM
// web properties, and Vercel doesn't run PHP — so the RPSD weekly-bulletin
// upload feature moves to Vercel Blob storage instead, using the same
// "direct client upload, server only issues a short-lived token" pattern
// as the Podcasts upload feature on the main Salem School of Witnessing
// app. Runs as a Vercel Edge Function (no Next.js needed — /api/*.ts at
// the project root is a plain Vercel platform feature).
export const config = { runtime: "edge" };

const ALLOWED_CONTENT_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB — same cap as the old PHP script

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        // The RPSD admin UI (already gated behind Firebase admin login,
        // see firebase.ts's adminLogin/onAuthChange) sends a shared secret
        // in clientPayload. It must match the RPSD_API_KEY environment
        // variable set on this Vercel project — see the README for setup.
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

    return new Response(JSON.stringify(jsonResponse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Upload failed",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}
