export default function Page() {
  return (
    <div
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        maxWidth: "800px",
        margin: "0 auto",
        padding: "3rem 2rem",
        lineHeight: "1.6",
        color: "#2c3e50",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #a8d5ba 0%, #7fcba4 100%)",
          padding: "3rem",
          borderRadius: "12px",
          textAlign: "center",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ margin: "0 0 0.5rem 0", fontSize: "3rem", color: "#fff" }}>Kronos Novels</h1>
        <p style={{ margin: 0, fontSize: "1.5rem", opacity: 0.9, color: "#fff" }}>
          Perjalanan Cerita Tanpa Batas Waktu
        </p>
      </div>

      <div
        style={{
          background: "#f5fff9",
          padding: "2rem",
          borderRadius: "12px",
          border: "2px solid #a8d5ba",
        }}
      >
        <h2 style={{ marginTop: 0, color: "#2c3e50", textAlign: "center", fontSize: "2rem" }}>
          Jelajahi Dunia Penuh Imajinasi
        </h2>
        <p style={{ color: "#2c3e50", textAlign: "center", fontSize: "1.1rem" }}>
          Temukan berbagai novel menarik dan ikuti petualangan seru di setiap chapter. Kronos Novels
          menghadirkan pengalaman membaca yang nyaman dan interaktif.
        </p>
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
          <a
            href="/docs"
            style={{
              color: "#2c3e50",
              textDecoration: "none",
              fontSize: "1.2rem",
              fontWeight: "bold",
            }}
          >
            Mulai Membaca
          </a>
        </p>
      </div>
    </div>
  );
}