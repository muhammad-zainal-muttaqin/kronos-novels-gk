# Kronos Novels

> Perjalanan Cerita Tanpa Batas Waktu

Platform baca novel modern yang dibangun dengan VitePress, Decap CMS, dan UploadThing.

## Fitur

- Static Site Generation dengan VitePress
- Git-based CMS dengan Decap
- Media storage dengan UploadThing
- Bookmark otomatis dengan IndexedDB
- Dark mode support
- Responsif & cepat

## Development

\`\`\`bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
\`\`\`

## Deployment

Project ini di-deploy ke Cloudflare Pages:

1. Push ke GitHub repository
2. Connect Cloudflare Pages ke repo
3. Set build command: `npm run build`
4. Set output directory: `docs/.vitepress/dist`
5. Add environment variables:
   - `GITHUB_CLIENT_ID`: GitHub OAuth App Client ID
   - `GITHUB_CLIENT_SECRET`: GitHub OAuth App Client Secret
   - `UPLOADTHING_TOKEN`: UploadThing API token

## Environment Variables

## Usage

### Admin Panel

Access the Decap CMS admin panel at `/admin` to manage novels and chapters.

### Image Uploader

Use the image uploader at `/uploader` to upload cover images and chapter illustrations to UploadThing.

### Adding Content

1. Go to `/admin`
2. Login with GitHub
3. Create a new novel or chapter
4. Upload images via `/uploader`
5. Copy the image URL and paste it in the CMS
6. Publish your content

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
