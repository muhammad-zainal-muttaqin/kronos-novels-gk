import { defineConfig } from "vitepress"
import { readdirSync, statSync } from "fs"
import { join } from "path"

// Generate sidebar from novels directory
function generateNovelsSidebar() {
  const novelsDir = join(__dirname, "../novels")
  const novels = readdirSync(novelsDir).filter((file) => {
    const stat = statSync(join(novelsDir, file))
    return stat.isDirectory()
  })

  return novels.map((novel) => {
    const chaptersDir = join(novelsDir, novel, "chapters")
    let chapters: any[] = []

    try {
      const chapterFiles = readdirSync(chaptersDir)
        .filter((file) => file.endsWith(".md"))
        .sort((a, b) => {
          const numA = Number.parseInt(a.match(/\d+/)?.[0] || "0")
          const numB = Number.parseInt(b.match(/\d+/)?.[0] || "0")
          return numA - numB
        })

      chapters = chapterFiles.map((file) => ({
        text: file.replace(".md", "").replace(/-/g, " "),
        link: `/novels/${novel}/chapters/${file.replace(".md", "")}`,
      }))
    } catch (e) {
      // No chapters yet
    }

    return {
      text: novel.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      collapsed: true,
      items: [{ text: "Info Novel", link: `/novels/${novel}/` }, ...chapters],
    }
  })
}

export default defineConfig({
  title: "Kronos Novels",
  description: "Perjalanan Cerita Tanpa Batas Waktu",
  lang: "id-ID",

  head: [
    ["meta", { name: "theme-color", content: "#A8D5BA" }],
    [
      "meta",
      {
        name: "keywords",
        content: "novel Indonesia, platform baca novel, cerita original, chapter terbaru, Kronos Novels",
      },
    ],
    ["meta", { name: "author", content: "Kronos Novels" }],
    ["meta", { property: "og:title", content: "Kronos Novels - Perjalanan Cerita Tanpa Batas Waktu" }],
    [
      "meta",
      {
        property: "og:description",
        content:
          "Platform baca novel eksklusif. Baca chapter terbaru dan bookmark cerita favorit Anda di Kronos Novels.",
      },
    ],
    ["meta", { property: "og:url", content: "https://kronos-novels.pages.dev" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:site_name", content: "Kronos Novels" }],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:title", content: "Kronos Novels" }],
    ["meta", { name: "twitter:description", content: "Baca cerita original dan jelajahi dunia fiksi Anda." }],
    ["link", { rel: "icon", type: "image/svg+xml", href: "/logo.svg" }],
  ],

  themeConfig: {
    logo: "/logo.svg",
    siteTitle: "Kronos Novels",

    nav: [
      { text: "Beranda", link: "/" },
      { text: "Novel", link: "/novels/" },
      { text: "Tentang", link: "/about" },
      { text: "Uploader", link: "/uploader" },
    ],

    sidebar: {
      "/novels/": generateNovelsSidebar(),
    },

    socialLinks: [{ icon: "github", link: "https://github.com/muhammad-zainal-muttaqin/kronos-novels" }],

    footer: {
      message: "Powered by VitePress + Decap CMS + UploadThing",
      copyright: "© 2025 Kronos Novels - Perjalanan cerita tanpa batas waktu.",
    },

    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "Cari novel...",
            buttonAriaLabel: "Cari novel",
          },
          modal: {
            noResultsText: "Tidak ada hasil untuk",
            resetButtonTitle: "Reset pencarian",
            footer: {
              selectText: "untuk memilih",
              navigateText: "untuk navigasi",
              closeText: "untuk menutup",
            },
          },
        },
      },
    },
  },

  cleanUrls: true,
  lastUpdated: true,
})
