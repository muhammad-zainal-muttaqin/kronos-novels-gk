import type { PagesFunction } from "@cloudflare/workers-types"

/**
 * GitHub OAuth Handler for Decap CMS
 * Cloudflare Workers Function
 */

interface Env {
  GITHUB_CLIENT_ID: string
  GITHUB_CLIENT_SECRET: string
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context
  const url = new URL(request.url)

  // Handle OAuth callback
  if (url.pathname === "/api/oauth/callback") {
    const code = url.searchParams.get("code")

    if (!code) {
      return new Response("Missing code parameter", { status: 400 })
    }

    try {
      // Exchange code for access token
      const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
        }),
      })

      const tokenData = await tokenResponse.json()

      if (tokenData.error) {
        console.error("[Kronos] OAuth error:", tokenData.error)
        return new Response(`OAuth error: ${tokenData.error}`, { status: 400 })
      }

      // Return token to Decap CMS
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Kronos Novels - OAuth Success</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
                background: #fffbf0;
              }
              .message {
                text-align: center;
                color: #2c3e50;
              }
              .success {
                color: #a8d5ba;
                font-size: 3rem;
                margin-bottom: 1rem;
              }
            </style>
          </head>
          <body>
            <div class="message">
              <div class="success">✓</div>
              <h1>Autentikasi Berhasil</h1>
              <p>Anda akan diarahkan kembali ke CMS...</p>
            </div>
            <script>
              (function() {
                function receiveMessage(e) {
                  console.log("[Kronos] OAuth callback received");
                  window.opener.postMessage(
                    'authorization:github:success:${JSON.stringify(tokenData)}',
                    e.origin
                  );
                  window.close();
                }
                window.addEventListener("message", receiveMessage, false);
                window.opener.postMessage("authorizing:github", "*");
              })();
            </script>
          </body>
        </html>
      `

      return new Response(html, {
        headers: { "Content-Type": "text/html" },
      })
    } catch (error) {
      console.error("[Kronos] OAuth error:", error)
      return new Response("OAuth failed", { status: 500 })
    }
  }

  // Handle OAuth initiation
  if (url.pathname === "/api/oauth") {
    const redirectUri = `${url.origin}/api/oauth/callback`
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${env.GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=repo,user`

    return Response.redirect(githubAuthUrl, 302)
  }

  return new Response("Not found", { status: 404 })
}
