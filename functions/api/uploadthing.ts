import { createRouteHandler } from "uploadthing/server";
import type { PagesFunction } from "@cloudflare/workers-types";

interface Env {
  UPLOADTHING_TOKEN: string;
}

const router = {
  novelCover: {
    image: {
      maxFileSize: "2MB",
      maxFileCount: 1,
    },
  },
  chapterIllustration: {
    image: {
      maxFileSize: "5MB",
      maxFileCount: 1,
    },
  },
  generalImage: {
    image: {
      maxFileSize: "4MB",
      maxFileCount: 5,
    },
  },
};

let cachedToken: string | null = null;
let cachedHandler: ((request: Request) => Promise<Response>) | null = null;

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  const token = env.UPLOADTHING_TOKEN;

  if (!token) {
    console.error("[Kronos] Missing UPLOADTHING_TOKEN");
    return new Response(JSON.stringify({ error: "Server misconfigured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  console.log("[Kronos] Token available (length: " + token.length + ")");

  if (!cachedHandler || cachedToken !== token) {
    try {
      cachedHandler = createRouteHandler({
        config: {
          token,
        },
        router,
      });
      cachedToken = token;
      console.log("[Kronos] Handler created successfully");
    } catch (createError) {
      console.error("[Kronos] Handler creation failed:", createError);
      return new Response(JSON.stringify({ error: "Handler setup failed" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  console.log(
    "[Kronos] Calling handler for slug: " +
      new URL(request.url).searchParams.get("slug"),
  );

  try {
    const response = await cachedHandler(request);
    console.log("[Kronos] UploadThing request processed");
    return response;
  } catch (error) {
    console.error("[Kronos] UploadThing error:", error);
    return new Response(
      JSON.stringify({
        error: "Upload failed",
        details: error?.message || "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
