---
layout: home

hero:
  name: Kronos Novels
  text: Perjalanan Cerita Tanpa Batas Waktu
  tagline: Baca dengan Ritme Anda Sendiri
  image:
    src: /logo.svg
    alt: Kronos Novels Logo
  actions:
    - theme: brand
      text: Jelajahi Novel
      link: /novels/
    - theme: alt
      text: Tentang Kami
      link: /about

features:
  - icon: 📚
    title: Koleksi Novel Original
    details: Nikmati berbagai cerita original dari penulis berbakat dengan genre yang beragam.
  
  - icon: 🔖
    title: Bookmark Otomatis
    details: Sistem bookmark pintar yang menyimpan posisi baca Anda secara otomatis di setiap chapter.
  
  - icon: 🌙
    title: Dark Mode
    details: Baca dengan nyaman kapan saja dengan dukungan dark mode yang elegan.
  
  - icon: ⚡
    title: Performa Cepat
    details: Dibangun dengan VitePress untuk pengalaman membaca yang super cepat dan responsif.
  
  - icon: 📝
    title: CMS Terintegrasi
    details: Kelola konten dengan mudah menggunakan Decap CMS yang powerful dan user-friendly.
  
  - icon: 🖼️
    title: Media Storage
    details: Upload cover dan ilustrasi dengan UploadThing untuk kualitas gambar terbaik.
---

<style>
.VPFeature {
  background: var(--vp-c-bg-soft);
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.VPFeature:hover {
  border-color: var(--kn-primary);
  transform: translateY(-4px);
}

.VPImage.image-src {
  max-width: 200px;
  margin: 0 auto;
}
</style>

## Cara Memulai

### Untuk Developer

1. Clone repository dari GitHub
2. Install dependencies: `npm install`
3. Jalankan dev server: `npm run dev`
4. Buka `http://localhost:5173`

### Untuk Content Creator

1. Akses `/admin` untuk Decap CMS
2. Login dengan GitHub
3. Buat novel atau chapter baru
4. Upload gambar di `/uploader`
5. Publish konten Anda

### Untuk Pembaca

1. Jelajahi koleksi novel di halaman [Novel](/novels/)
2. Pilih novel yang menarik
3. Baca chapter dan gunakan bookmark untuk menyimpan progress
4. Toggle dark mode untuk kenyamanan membaca

---

<div style="text-align: center; padding: 2rem; background: var(--vp-c-bg-soft); border-radius: 12px; margin-top: 3rem;">
  <h3 style="color: var(--vp-c-text-1); margin-bottom: 1rem;">Siap untuk Memulai?</h3>
  <p style="color: var(--vp-c-text-2); margin-bottom: 1.5rem;">
    Kronos Novels adalah platform open-source yang dapat Anda deploy sendiri.
  </p>
  <a href="https://github.com/muhammad-zainal-muttaqin/kronos-novels" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: var(--kn-primary); color: var(--kn-accent-dark); padding: 0.75rem 2rem; border-radius: 8px; text-decoration: none; font-weight: 600;">
    View on GitHub
  </a>
</div>
