import { del } from "@vercel/blob";

// fix — companion to rpsd-upload.ts: replaces the DELETE branch of the old
// rpsd_upload.php with a call to Vercel Blob's del(). Same shared-secret
// check as before (X-Api-Key header), just no PHP host required.
export const config = { runtime: "edge" };

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "DELETE") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apiKey = request.headers.get("x-api-key");
  if (!apiKey || apiKey !== process.env.RPSD_API_KEY) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { url } = (await request.json()) as { url?: string };
    if (!url || !/^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//.test(url)) {
      return new Response(JSON.stringify({ error: "Invalid URL" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    await del(url);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Delete failed",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}
