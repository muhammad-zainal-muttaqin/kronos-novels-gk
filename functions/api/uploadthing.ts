import { createUploadthing } from "uploadthing/server";
import type { PagesFunction } from "@cloudflare/workers-types";

interface Env {
  UPLOADTHING_TOKEN: string;
}

const f = createUploadthing({
  errorFormatter: (err) => {
    console.error("[Kronos] UploadThing error:", err);
    return {
      message: err.message,
    };
  },
});

const uploadRouter = {
  novelCover: f({
    image: {
      maxFileSize: "2MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      console.log("[Kronos] Processing novelCover upload");
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      console.log("[Kronos] novelCover upload complete:", file.url);
    }),

  chapterIllustration: f({
    image: {
      maxFileSize: "5MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      console.log("[Kronos] Processing chapterIllustration upload");
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      console.log("[Kronos] chapterIllustration upload complete:", file.url);
    }),

  generalImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 5,
    },
  })
    .middleware(async () => {
      console.log("[Kronos] Processing generalImage upload");
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      console.log("[Kronos] generalImage upload complete:", file.url);
    }),
};

type UploadRouter = typeof uploadRouter;

let cachedHandler: ((request: Request) => Promise<Response>) | null = null;
let cachedToken: string | null = null;

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  // TEMPORARY HARDCODE FOR DEBUG - REVOKE AFTER TESTING
  const token =
    "eyJhcGlLZXkiOiJza19saXZlXzlhNjQ2MWFlYTZhNTkyYTQ5ZGVmMTAwZTZmYzBiNzdiZDE3NzVlMTY2M2U3MzIwYTU0NjI2MjdjOGU0MWE3MzciLCJhcHBJZCI6ImdrdzV5MHM0MmUiLCJyZWdpb25zIjpbInNlYTEiXX0=";

  console.log("[Kronos] Using hardcoded token for debug");

  if (!token) {
    console.error("[Kronos] Missing UPLOADTHING_TOKEN");
    return new Response(JSON.stringify({ error: "Server misconfigured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!cachedHandler || cachedToken !== token) {
    console.log("[Kronos] Initializing UploadThing handler");

    try {
      const { createRouteHandler } = await import("uploadthing/server");

      cachedHandler = createRouteHandler({
        router: uploadRouter,
        config: {
          token,
          logLevel: "Info",
          callbackUrl: `${new URL(request.url).origin}/api/uploadthing`,
        },
      });

      cachedToken = token;
      console.log("[Kronos] Handler initialized successfully");
    } catch (error) {
      console.error("[Kronos] Failed to initialize handler:", error);
      return new Response(
        JSON.stringify({
          error: "Handler initialization failed",
          details: error instanceof Error ? error.message : "Unknown error",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  }

  try {
    console.log("[Kronos] Processing request:", request.method, request.url);
    const response = await cachedHandler(request);
    console.log(
      "[Kronos] Request processed successfully, status:",
      response.status,
    );
    return response;
  } catch (error) {
    console.error("[Kronos] Request handler error:", error);
    return new Response(
      JSON.stringify({
        error: "Upload failed",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
