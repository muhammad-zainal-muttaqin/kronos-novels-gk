import type { PagesFunction } from "@cloudflare/workers-types"

interface Env {
  GITHUB_CLIENT_ID: string
  GITHUB_CLIENT_SECRET: string
}

const successPage = (payload: string) => `<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="utf-8" />
    <title>Kronos Novels - OAuth</title>
    <style>
      body {
        margin: 0;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fffbf0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        color: #2c3e50;
        text-align: center;
      }
      h1 {
        font-size: 1.75rem;
        margin-bottom: 0.5rem;
      }
      p {
        margin: 0;
      }
      .icon {
        font-size: 3rem;
        margin-bottom: 1.5rem;
        color: #7fcba4;
      }
    </style>
  </head>
  <body>
    <main>
      <div class="icon">&#x2705;</div>
      <h1>Autentikasi Berhasil</h1>
      <p>Anda akan diarahkan kembali ke CMS...</p>
    </main>
    <script>
      (function () {
        const message = 'authorization:github:success:${payload}';
        const origin = window.location.origin;

        function notifyParent() {
          if (!window.opener) return;
          window.opener.postMessage(message, origin);
          window.close();
        }

        notifyParent();
        setTimeout(notifyParent, 1000);
      })();
    </script>
  </body>
</html>`

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")

  if (!code) return new Response("Missing code parameter", { status: 400 })

  try {
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

    const tokenData = await tokenResponse.json<Record<string, unknown>>()

    if (tokenData.error) {
      return new Response(`OAuth error: ${tokenData.error}`, { status: 400 })
    }

    const payload = JSON.stringify(tokenData).replace(/</g, "\\u003c")

    return new Response(successPage(payload), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    })
  } catch (error) {
    console.error("OAuth exchange failed", error)
    return new Response("OAuth failed", { status: 500 })
  }
}

