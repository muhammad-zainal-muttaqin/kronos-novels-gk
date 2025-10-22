# Contributing to Kronos Novels

Terima kasih atas minat Anda untuk berkontribusi pada Kronos Novels!

## Development Setup

1. Clone repository:
\`\`\`bash
git clone https://github.com/muhammad-zainal-muttaqin/kronos-novels-gk.git
cd kronos-novels-gk
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create `.dev.vars` file:
\`\`\`env
GITHUB_CLIENT_ID=your_dev_client_id
GITHUB_CLIENT_SECRET=your_dev_client_secret
UPLOADTHING_TOKEN=your_token
\`\`\`

4. Start dev server:
\`\`\`bash
npm run dev
\`\`\`

5. Open `http://localhost:5173`

## Project Structure

\`\`\`
kronos-novels/
├── docs/                      # VitePress source
│   ├── .vitepress/           # VitePress config & theme
│   │   ├── config.ts         # Site configuration
│   │   ├── theme/            # Custom theme
│   │   │   ├── index.ts      # Theme entry
│   │   │   ├── style.css     # Custom styles
│   │   │   ├── bookmark-db.ts # IndexedDB logic
│   │   │   └── components/   # Vue components
│   │   └── clientAppEnhance.ts
│   ├── novels/               # Novel content (Markdown)
│   ├── public/               # Static assets
│   │   ├── admin/            # Decap CMS
│   │   └── uploader/         # UploadThing UI
│   └── index.md              # Homepage
├── functions/                # Cloudflare Workers
│   └── api/
│       ├── oauth.ts          # GitHub OAuth
│       └── uploadthing.ts    # UploadThing handler
├── package.json
├── tsconfig.json
└── wrangler.toml             # Cloudflare config
\`\`\`

## Guidelines

### Code Style

- Use TypeScript untuk type safety
- Follow Vue 3 Composition API patterns
- Use Tailwind CSS classes (avoid inline styles)
- Format code dengan Prettier
- Lint dengan ESLint

### Commit Messages

Format: `type(scope): message`

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Styling changes
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Maintenance

Examples:
- `feat(theme): add dark mode toggle`
- `fix(bookmark): resolve IndexedDB error`
- `docs(readme): update deployment guide`

### Pull Requests

1. Fork repository
2. Create feature branch: `git checkout -b feat/amazing-feature`
3. Commit changes: `git commit -m 'feat: add amazing feature'`
4. Push to branch: `git push origin feat/amazing-feature`
5. Open Pull Request

### Testing

Before submitting PR:
- Test di local dev server
- Test dark mode
- Test bookmark functionality
- Test responsive design (mobile, tablet, desktop)
- Check console for errors

## Adding Features

### New Component

1. Create component di `docs/.vitepress/theme/components/`
2. Register di `docs/.vitepress/theme/index.ts`
3. Add types jika perlu
4. Document usage

### New Page

1. Create Markdown file di `docs/`
2. Add frontmatter
3. Update navigation di `config.ts` jika perlu

### New Novel/Chapter

Gunakan Decap CMS di `/admin` atau manual:

1. Create folder di `docs/novels/[slug]/`
2. Add `index.md` untuk novel info
3. Add chapters di `docs/novels/[slug]/chapters/`
4. Follow frontmatter schema

## Questions?

Open an issue atau discussion di GitHub repository.

---

Happy coding!
