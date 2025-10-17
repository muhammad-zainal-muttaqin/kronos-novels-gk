import { createRouteHandler } from "uploadthing/server"
import type { PagesFunction } from "@cloudflare/workers-types"

interface Env {
  UPLOADTHING_TOKEN: string
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
}

let cachedToken: string | null = null
let cachedHandler: ((request: Request) => Promise<Response>) | null = null

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  const token = env.UPLOADTHING_TOKEN

  if (!token) {
    console.error("[Kronos] Missing UPLOADTHING_TOKEN")
    return new Response(JSON.stringify({ error: "Server misconfigured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }

  if (!cachedHandler || cachedToken !== token) {
    cachedHandler = createRouteHandler({
      config: {
        token,
      },
      router,
    })
    cachedToken = token
  }

  try {
    const response = await cachedHandler(request)
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
