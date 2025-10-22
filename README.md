<div align="center">

# Kronos Novels

**Perjalanan Cerita Tanpa Batas Waktu**

[![Deploy to Cloudflare Pages](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-orange?style=for-the-badge&logo=cloudflare)](https://pages.cloudflare.com/)
[![Built with VitePress](https://img.shields.io/badge/Built%20with-VitePress-646CFF?style=for-the-badge&logo=vite)](https://vitepress.dev/)
[![Powered by Vue](https://img.shields.io/badge/Powered%20by-Vue%203-4FC08D?style=for-the-badge&logo=vue.js)](https://vuejs.org/)

Platform baca novel modern yang dibangun dengan teknologi terdepan untuk pengalaman membaca yang optimal.

[**Demo Live**](https://kronos-novels.pages.dev) • [**Dokumentasi**](https://kronos-novels.pages.dev/docs) • [**Kontribusi**](CONTRIBUTING.md)

</div>

---

## ✨ Fitur Utama

<table>
<tr>
<td width="50%">

### 📚 Manajemen Konten
- **Static Site Generation** dengan VitePress
- **Git-based CMS** dengan Decap untuk editing mudah
- **Media storage** terintegrasi dengan UploadThing
- **Markdown support** untuk penulisan yang fleksibel

</td>
<td width="50%">

### 🎨 Pengalaman Pengguna
- **Bookmark otomatis** dengan IndexedDB
- **Dark mode support** untuk kenyamanan mata
- **Responsif** di semua perangkat
- **Performance tinggi** dengan caching optimal

</td>
</tr>
</table>

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm atau yarn
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/muhammad-zainal-muttaqin/kronos-novels-gk.git
cd kronos-novels-gk

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## 🌐 Deployment

### Cloudflare Pages Setup

1. **Connect Repository**
   - Login ke [Cloudflare Pages](https://pages.cloudflare.com/)
   - Connect ke GitHub repository ini

2. **Build Configuration**
   ```
   Build command: npm run build
   Output directory: docs/.vitepress/dist
   ```

3. **Environment Variables**
   | Variable | Description | Required |
   |----------|-------------|----------|
   | `GITHUB_CLIENT_ID` | GitHub OAuth App Client ID | ✅ |
   | `GITHUB_CLIENT_SECRET` | GitHub OAuth App Client Secret | ✅ |
   | `UPLOADTHING_TOKEN` | UploadThing API token | ✅ |

### Manual Deployment
```bash
npm run build
# Upload docs/.vitepress/dist ke hosting provider
```

## 📖 Cara Penggunaan

### Admin Panel
Akses panel admin Decap CMS di `/admin` untuk mengelola novel dan chapter.

**Langkah-langkah:**
1. Buka `/admin` di browser
2. Login dengan akun GitHub
3. Mulai membuat novel atau chapter baru

### Image Uploader
Upload gambar cover dan ilustrasi chapter melalui `/uploader`.

**Workflow:**
1. Akses `/uploader`
2. Upload gambar ke UploadThing
3. Copy URL gambar yang dihasilkan
4. Paste URL di CMS untuk digunakan

### Content Management
```mermaid
graph LR
    A[Create Content] --> B[Upload Images]
    B --> C[Edit in CMS]
    C --> D[Preview]
    D --> E[Publish]
```

## Tech Stack

- **VitePress** - SSG framework
- **Vue 3** - UI framework
- **Decap CMS** - Content management
- **UploadThing** - Media storage
- **IndexedDB** - Local bookmarks
- **Cloudflare Pages** - Hosting
- **Cloudflare Workers** - API functions

## License

© 2025 Kronos Novels. All rights reserved.
