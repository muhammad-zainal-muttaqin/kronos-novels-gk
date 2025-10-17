# Deployment Guide - Kronos Novels

Panduan lengkap untuk deploy Kronos Novels ke Cloudflare Pages.

## Prerequisites

1. Akun GitHub
2. Akun Cloudflare
3. Repository GitHub: `muhammad-zainal-muttaqin/kronos-novels`
4. GitHub OAuth App (untuk Decap CMS)
5. UploadThing Account (sudah ada token)

---

## Step 1: Setup GitHub OAuth App

Untuk Decap CMS authentication:

1. Buka [GitHub Developer Settings](https://github.com/settings/developers)
2. Klik **New OAuth App**
3. Isi form:
   - **Application name**: Kronos Novels CMS
   - **Homepage URL**: `https://kronos-novels.pages.dev`
   - **Authorization callback URL**: `https://kronos-novels.pages.dev/api/oauth/callback`
4. Klik **Register application**
5. Copy **Client ID** dan generate **Client Secret**
6. Simpan kedua nilai ini untuk Step 3

---

## Step 2: Connect Cloudflare Pages

1. Login ke [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Pilih **Workers & Pages** dari sidebar
3. Klik **Create application** > **Pages** > **Connect to Git**
4. Pilih repository: `muhammad-zainal-muttaqin/kronos-novels`
5. Konfigurasi build:
   - **Project name**: `kronos-novels`
   - **Production branch**: `main`
   - **Build command**: `npm run build`
   - **Build output directory**: `docs/.vitepress/dist`
6. Klik **Save and Deploy**

---

## Step 3: Add Environment Variables

Di Cloudflare Pages dashboard:

1. Buka project **kronos-novels**
2. Pilih **Settings** > **Environment variables**
3. Tambahkan variable berikut:

### Production Environment

| Variable Name | Value | Type |
|--------------|-------|------|
| `GITHUB_CLIENT_ID` | (dari Step 1) | Plain text |
| `GITHUB_CLIENT_SECRET` | (dari Step 1) | Secret |
| `UPLOADTHING_TOKEN` | `eyJhcGlLZXkiOiJza19saXZlXzlhNjQ2MWFlYTZhNTkyYTQ5ZGVmMTAwZTZmYzBiNzdiZDE3NzVlMTY2M2U3MzIwYTU0NjI2MjdjOGU0MWE3MzciLCJhcHBJZCI6ImdrdzV5MHM0MmUiLCJyZWdpb25zIjpbInNlYTEiXX0=` | Secret |

4. Klik **Save**
5. Redeploy project untuk apply environment variables

---

## Step 4: Verify Deployment

Setelah deployment selesai:

1. Buka `https://kronos-novels.pages.dev`
2. Test navigasi dan dark mode
3. Test bookmark functionality (buka chapter, klik bookmark button)
4. Buka `/admin` untuk test Decap CMS
5. Login dengan GitHub
6. Test create/edit novel atau chapter
7. Buka `/uploader` untuk test UploadThing
8. Upload test image dan verify URL

---

## Step 5: Custom Domain (Optional)

Jika ingin menggunakan custom domain:

1. Di Cloudflare Pages, pilih **Custom domains**
2. Klik **Set up a custom domain**
3. Masukkan domain (contoh: `kronos-novels.com`)
4. Follow instruksi untuk setup DNS
5. Update GitHub OAuth App callback URL ke domain baru
6. Update `base_url` di `docs/public/admin/config.yml`

---

## Troubleshooting

### Decap CMS tidak bisa login

- Pastikan `GITHUB_CLIENT_ID` dan `GITHUB_CLIENT_SECRET` sudah diset
- Cek callback URL di GitHub OAuth App matches dengan deployment URL
- Cek browser console untuk error messages

### UploadThing upload gagal

- Pastikan `UPLOADTHING_TOKEN` sudah diset dengan benar
- Cek file size tidak melebihi limit (2MB untuk cover, 5MB untuk illustration)
- Cek network tab di browser untuk error response

### Build gagal

- Pastikan `package.json` dependencies sudah lengkap
- Cek build logs di Cloudflare Pages dashboard
- Pastikan Node.js version compatible (v20+)

### Bookmark tidak tersimpan

- Bookmark menggunakan IndexedDB (client-side only)
- Pastikan browser support IndexedDB
- Cek browser console untuk errors
- Clear browser cache dan coba lagi

---

## Maintenance

### Update Content

1. Buka `/admin`
2. Login dengan GitHub
3. Edit atau tambah novel/chapter
4. Save changes
5. Changes akan auto-commit ke GitHub
6. Cloudflare Pages akan auto-deploy

### Update Code

1. Push changes ke GitHub repository
2. Cloudflare Pages akan auto-deploy
3. Monitor deployment di dashboard

### Backup

- Content tersimpan di GitHub repository (Git-based CMS)
- Images tersimpan di UploadThing
- Bookmark tersimpan di browser (IndexedDB, local only)

---

## Performance Tips

1. **Optimize Images**: Compress images sebelum upload
2. **Use WebP**: Format WebP lebih kecil dari JPG/PNG
3. **Lazy Loading**: VitePress sudah handle lazy loading images
4. **CDN**: Cloudflare Pages sudah include global CDN
5. **Caching**: Static files di-cache automatically

---

## Security

1. **Environment Variables**: Jangan commit secrets ke Git
2. **OAuth**: Gunakan GitHub OAuth untuk admin access
3. **HTTPS**: Cloudflare Pages enforce HTTPS by default
4. **CORS**: Configure CORS di UploadThing dashboard jika perlu

---

## Support

- GitHub Issues: [kronos-novels/issues](https://github.com/muhammad-zainal-muttaqin/kronos-novels/issues)
- Cloudflare Docs: [developers.cloudflare.com/pages](https://developers.cloudflare.com/pages)
- VitePress Docs: [vitepress.dev](https://vitepress.dev)
- Decap CMS Docs: [decapcms.org](https://decapcms.org)
- UploadThing Docs: [docs.uploadthing.com](https://docs.uploadthing.com)

---

Selamat! Kronos Novels sudah live di Cloudflare Pages.
