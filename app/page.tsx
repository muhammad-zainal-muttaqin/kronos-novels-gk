export default function Page() {
  return (
    <div
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        maxWidth: "800px",
        margin: "0 auto",
        padding: "3rem 2rem",
        lineHeight: "1.6",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #a8d5ba 0%, #7fcba4 100%)",
          padding: "2rem",
          borderRadius: "12px",
          marginBottom: "2rem",
          color: "#2c3e50",
        }}
      >
        <h1 style={{ margin: "0 0 0.5rem 0", fontSize: "2.5rem" }}>Kronos Novels</h1>
        <p style={{ margin: 0, fontSize: "1.25rem", opacity: 0.9 }}>Perjalanan Cerita Tanpa Batas Waktu</p>
      </div>

      <div
        style={{
          background: "#fffbf0",
          padding: "2rem",
          borderRadius: "12px",
          border: "2px solid #a8d5ba",
          marginBottom: "2rem",
        }}
      >
        <h2 style={{ marginTop: 0, color: "#2c3e50" }}>VitePress Project</h2>
        <p style={{ color: "#2c3e50" }}>
          Ini adalah <strong>VitePress Static Site Generator</strong> project, bukan Next.js app. Preview ini tidak akan
          menampilkan situs yang sebenarnya.
        </p>
      </div>

      <div
        style={{
          background: "#f5fff9",
          padding: "2rem",
          borderRadius: "12px",
          marginBottom: "2rem",
        }}
      >
        <h2 style={{ color: "#2c3e50" }}>Cara Menjalankan Project</h2>

        <h3 style={{ color: "#7fcba4", fontSize: "1.25rem" }}>1. Clone Repository</h3>
        <pre
          style={{
            background: "#2c3e50",
            color: "#a8d5ba",
            padding: "1rem",
            borderRadius: "8px",
            overflow: "auto",
          }}
        >
          {`git clone https://github.com/muhammad-zainal-muttaqin/kronos-novels.git
cd kronos-novels`}
        </pre>

        <h3 style={{ color: "#7fcba4", fontSize: "1.25rem" }}>2. Install Dependencies</h3>
        <pre
          style={{
            background: "#2c3e50",
            color: "#a8d5ba",
            padding: "1rem",
            borderRadius: "8px",
            overflow: "auto",
          }}
        >
          {`npm install`}
        </pre>

        <h3 style={{ color: "#7fcba4", fontSize: "1.25rem" }}>3. Run Development Server</h3>
        <pre
          style={{
            background: "#2c3e50",
            color: "#a8d5ba",
            padding: "1rem",
            borderRadius: "8px",
            overflow: "auto",
          }}
        >
          {`npm run dev`}
        </pre>

        <p style={{ color: "#7fcba4", marginTop: "1rem" }}>
          Buka{" "}
          <code style={{ background: "#e8f5ed", padding: "0.25rem 0.5rem", borderRadius: "4px" }}>
            http://localhost:5173
          </code>
        </p>

        <h3 style={{ color: "#7fcba4", fontSize: "1.25rem" }}>4. Build for Production</h3>
        <pre
          style={{
            background: "#2c3e50",
            color: "#a8d5ba",
            padding: "1rem",
            borderRadius: "8px",
            overflow: "auto",
          }}
        >
          {`npm run build`}
        </pre>
      </div>

      <div
        style={{
          background: "#e8f5ed",
          padding: "2rem",
          borderRadius: "12px",
          marginBottom: "2rem",
        }}
      >
        <h2 style={{ color: "#2c3e50" }}>Deployment ke Cloudflare Pages</h2>
        <ol style={{ color: "#2c3e50" }}>
          <li>Push code ke GitHub repository</li>
          <li>Connect Cloudflare Pages ke repository</li>
          <li>
            Set build command:{" "}
            <code style={{ background: "#fff", padding: "0.25rem 0.5rem", borderRadius: "4px" }}>npm run build</code>
          </li>
          <li>
            Set output directory:{" "}
            <code style={{ background: "#fff", padding: "0.25rem 0.5rem", borderRadius: "4px" }}>
              docs/.vitepress/dist
            </code>
          </li>
          <li>Add environment variables (lihat DEPLOYMENT.md)</li>
        </ol>
        <p style={{ color: "#7fcba4", fontWeight: 600 }}>
          Baca panduan lengkap di file{" "}
          <code style={{ background: "#fff", padding: "0.25rem 0.5rem", borderRadius: "4px" }}>DEPLOYMENT.md</code>
        </p>
      </div>

      <div
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "12px",
          border: "2px solid #a8d5ba",
        }}
      >
        <h2 style={{ color: "#2c3e50" }}>Fitur Utama</h2>
        <ul style={{ color: "#2c3e50" }}>
          <li>
            <strong>VitePress SSG</strong> - Static site generation dengan Vue 3
          </li>
          <li>
            <strong>Decap CMS</strong> - Git-based content management di <code>/admin</code>
          </li>
          <li>
            <strong>UploadThing</strong> - Media storage untuk cover & ilustrasi di <code>/uploader</code>
          </li>
          <li>
            <strong>IndexedDB Bookmarks</strong> - Bookmark otomatis untuk setiap chapter
          </li>
          <li>
            <strong>Dark Mode</strong> - Tema hijau pastel dengan dark mode support
          </li>
          <li>
            <strong>Cloudflare Workers</strong> - OAuth & UploadThing handlers
          </li>
        </ul>
      </div>

      <div
        style={{
          marginTop: "2rem",
          padding: "1.5rem",
          background: "#a8d5ba",
          borderRadius: "12px",
          textAlign: "center",
        }}
      >
        <p style={{ margin: 0, color: "#2c3e50", fontWeight: 600 }}>
          GitHub:{" "}
          <a
            href="https://github.com/muhammad-zainal-muttaqin/kronos-novels"
            style={{ color: "#2c3e50", textDecoration: "underline" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            muhammad-zainal-muttaqin/kronos-novels
          </a>
        </p>
      </div>
    </div>
  )
}
