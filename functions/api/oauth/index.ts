import type { PagesFunction } from "@cloudflare/workers-types"

interface Env {
  GITHUB_CLIENT_ID: string
}

export const onRequest: PagesFunction<Env> = async ({ env, request }) => {
  const redirectUri = new URL("/api/oauth/callback", request.url)
  const params = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID,
    redirect_uri: redirectUri.toString(),
    scope: "repo,user",
  })

  return Response.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`, 302)
}
