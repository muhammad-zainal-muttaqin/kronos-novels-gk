---
title: Image Uploader
layout: page
---

# Image Uploader

<div style="text-align: center; padding: 3rem 2rem; background: var(--vp-c-bg-soft); border-radius: 12px; border: 2px solid var(--kn-primary);">
  <div style="font-size: 3rem; margin-bottom: 1rem;">📷</div>
  <h2 style="color: var(--vp-c-text-1); margin-bottom: 1rem;">Upload Cover & Ilustrasi</h2>
  <p style="color: var(--vp-c-text-2); margin-bottom: 2rem;">
    Gunakan uploader untuk mengunggah cover novel dan ilustrasi chapter ke UploadThing.
  </p>
  <a href="/uploader/" style="display: inline-block; background: var(--kn-primary); color: var(--kn-accent-dark); padding: 0.75rem 2rem; border-radius: 8px; text-decoration: none; font-weight: 600; transition: all 0.2s ease;">
    Buka Uploader
  </a>
</div>

## Cara Menggunakan

### 1. Upload Cover Novel

- Klik area upload atau drag & drop gambar
- Maksimal ukuran: **2MB**
- Format: JPG, PNG, WebP
- Rekomendasi dimensi: **300x400px** (rasio 3:4)

### 2. Upload Ilustrasi Chapter

- Klik area upload atau drag & drop gambar
- Maksimal ukuran: **5MB**
- Format: JPG, PNG, WebP
- Rekomendasi dimensi: **1200x600px** (landscape)

### 3. Copy URL

Setelah upload berhasil:
1. URL gambar akan muncul di kotak
2. Klik tombol **Copy URL**
3. Paste URL ke Decap CMS di field `cover` atau `illustration`

## Tips

- Gunakan gambar dengan resolusi tinggi untuk hasil terbaik
- Compress gambar sebelum upload untuk mempercepat loading
- Pastikan gambar memiliki rasio aspek yang sesuai
- Gunakan format WebP untuk ukuran file lebih kecil

## Troubleshooting

**Upload gagal?**
- Pastikan ukuran file tidak melebihi batas
- Cek koneksi internet Anda
- Pastikan format file didukung (JPG, PNG, WebP)

**URL tidak muncul?**
- Refresh halaman dan coba lagi
- Cek console browser untuk error message
- Pastikan environment variable `UPLOADTHING_TOKEN` sudah diset

---

Butuh bantuan? Hubungi admin atau cek dokumentasi UploadThing.
