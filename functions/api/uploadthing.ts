import { createRouteHandler } from "uploadthing/server"
import type { PagesFunction } from "@cloudflare/workers-types"

interface Env {
  UPLOADTHING_TOKEN: string
}

/**
 * UploadThing Handler for Cloudflare Workers
 * Handles file uploads for novel covers and chapter illustrations
 */

const uploadthingHandler = createRouteHandler({
  config: {
    token: process.env.UPLOADTHING_TOKEN,
  },
  router: {
    // Cover images for novels (max 2MB)
    novelCover: {
      image: {
        maxFileSize: "2MB",
        maxFileCount: 1,
      },
    },
    // Illustrations for chapters (max 5MB)
    chapterIllustration: {
      image: {
        maxFileSize: "5MB",
        maxFileCount: 1,
      },
    },
    // General images (max 4MB)
    generalImage: {
      image: {
        maxFileSize: "4MB",
        maxFileCount: 5,
      },
    },
  },
})

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context

  // Set UPLOADTHING_TOKEN from environment
  if (env.UPLOADTHING_TOKEN) {
    process.env.UPLOADTHING_TOKEN = env.UPLOADTHING_TOKEN
  }

  try {
    const response = await uploadthingHandler(request)
    console.log("[Kronos] UploadThing request processed")
    return response
  } catch (error) {
    console.error("[Kronos] UploadThing error:", error)
    return new Response(JSON.stringify({ error: "Upload failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
