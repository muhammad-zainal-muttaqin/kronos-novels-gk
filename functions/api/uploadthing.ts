import type { PagesFunction } from "@cloudflare/workers-types";

interface Env {
  UPLOADTHING_TOKEN: string;
}

const UPLOADTHING_API_BASE = "https://api.uploadthing.com";

interface FileMetadata {
  name: string;
  size: number;
  type: string;
}

interface StartUploadPayload {
  appId: string;
  slug: string;
  files: FileMetadata[];
}

interface CompleteUploadPayload {
  appId: string;
  slug: string;
  serverId: string;
  files: { key: string }[];
}

const limits: Record<string, { maxSize: number; maxCount: 1 | 5 }> = {
  novelCover: { maxSize: 2 * 1024 * 1024, maxCount: 1 },
  chapterIllustration: { maxSize: 5 * 1024 * 1024, maxCount: 1 },
  generalImage: { maxSize: 4 * 1024 * 1024, maxCount: 5 },
};

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const url = new URL(request.url);
  const actionType = url.searchParams.get("actionType");
  const slug = url.searchParams.get("slug");

  if (
    !slug ||
    !["novelCover", "chapterIllustration", "generalImage"].includes(slug)
  ) {
    console.error("[Kronos] Invalid slug:", slug);
    return new Response(JSON.stringify({ error: "Invalid slug" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!env.UPLOADTHING_TOKEN) {
    console.error("[Kronos] Missing UPLOADTHING_TOKEN");
    return new Response(JSON.stringify({ error: "Server misconfigured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  console.log(`[Kronos] Processing ${actionType} for slug: ${slug}`);

  try {
    // TEMPORARY HARDCODE FOR DEBUG - REVOKE AFTER TESTING
    const HARDCODED_TOKEN =
      "eyJhcGlLZXkiOiJza19saXZlXzlhNjQ2MWFlYTZhNTkyYTQ5ZGVmMTAwZTZmYzBiNzdiZDE3NzVlMTY2M2U3MzIwYTU0NjI2MjdjOGU0MWE3MzciLCJhcHBJZCI6ImdrdzV5MHM0MmUiLCJyZWdpb25zIjpbInNlYTEiXX0=";

    console.log("[Kronos] Using hardcoded token for debug");
    const tokenPayload = JSON.parse(atob(HARDCODED_TOKEN));
    console.log("[Kronos] Token decoded, appId:", tokenPayload.appId);
    const { apiKey, appId } = tokenPayload;

    if (!apiKey || !appId) {
      console.error(
        "[Kronos] Invalid token payload, has apiKey:",
        !!apiKey,
        "has appId:",
        !!appId,
      );
      throw new Error("Invalid token");
    }

    console.log(
      "[Kronos] Using appId:",
      appId,
      "apiKey prefix:",
      apiKey.substring(0, 10),
    );

    const authHeader = { Authorization: `Bearer ${apiKey}` };
    const commonHeaders = {
      ...authHeader,
      "Content-Type": "application/json",
    };

    if (actionType === "upload") {
      // Start upload: Get presigned URLs for files
      const body = await request.json<{ files: FileMetadata[] }>();
      const { files } = body;

      if (!files || !Array.isArray(files) || files.length === 0) {
        return new Response(JSON.stringify({ error: "No files provided" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const limit = limits[slug];
      if (files.length > limit.maxCount) {
        return new Response(
          JSON.stringify({ error: `Max ${limit.maxCount} file(s) allowed` }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      if (
        files.some(
          (f) =>
            f.size > limit.maxSize ||
            !f.size ||
            !f.name ||
            !f.type ||
            !f.type.startsWith("image/"),
        )
      ) {
        return new Response(
          JSON.stringify({
            error:
              "Invalid file: Only images allowed, max size exceeded or missing metadata",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      const startPayload: StartUploadPayload = {
        appId,
        slug,
        files: files.map((f) => ({ name: f.name, size: f.size, type: f.type })),
      };

      const startRes = await fetch(`${UPLOADTHING_API_BASE}/v1/upload/start`, {
        method: "POST",
        headers: commonHeaders,
        body: JSON.stringify(startPayload),
      });

      if (!startRes.ok) {
        const errorText = await startRes.text();
        console.error("[Kronos] Start upload failed:", errorText);
        throw new Error(`Start upload failed: ${startRes.status} ${errorText}`);
      }

      const startData = await startRes.json();
      console.log(
        "[Kronos] Start upload successful, serverId:",
        startData.serverId,
      );
      return new Response(JSON.stringify(startData), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else if (actionType === "put" || actionType === "complete") {
      // Complete upload: Validate and get final URLs
      const body = await request.json<{
        serverId: string;
        files: { key: string; etag?: string; size?: number }[];
      }>();
      const { serverId, files } = body;

      if (!serverId || !files || files.length === 0) {
        return new Response(
          JSON.stringify({ error: "Invalid completion data" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      const completePayload: CompleteUploadPayload = {
        appId,
        slug,
        serverId,
        files: files.map((f) => ({ key: f.key })),
      };

      const completeRes = await fetch(
        `${UPLOADTHING_API_BASE}/v1/upload/complete`,
        {
          method: "POST",
          headers: commonHeaders,
          body: JSON.stringify(completePayload),
        },
      );

      if (!completeRes.ok) {
        const errorText = await completeRes.text();
        console.error("[Kronos] Complete upload failed:", errorText);
        throw new Error(
          `Complete upload failed: ${completeRes.status} ${errorText}`,
        );
      }

      const completeData = await completeRes.json();
      console.log("[Kronos] Complete upload successful");
      return new Response(
        JSON.stringify({
          serverId,
          files:
            completeData.files?.map((f: any) => ({
              url: `https://utfs.io/f/${f.key}`,
            })) || [],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    } else {
      console.error("[Kronos] Invalid actionType:", actionType);
      return new Response(JSON.stringify({ error: "Invalid action" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("[Kronos] Upload error:", error);
    return new Response(
      JSON.stringify({
        error: "Upload failed",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
