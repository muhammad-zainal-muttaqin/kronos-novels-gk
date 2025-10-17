import { openDB, type DBSchema, type IDBPDatabase } from "idb"

interface BookmarkDB extends DBSchema {
  bookmarks: {
    key: string // format: "novelSlug:chapterSlug"
    value: {
      novelSlug: string
      chapterSlug: string
      scrollPosition: number
      timestamp: number
    }
  }
}

let db: IDBPDatabase<BookmarkDB> | null = null

export async function initBookmarkDB() {
  if (db) return db

  db = await openDB<BookmarkDB>("kronos-novels-bookmarks", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("bookmarks")) {
        db.createObjectStore("bookmarks")
      }
    },
  })

  return db
}

export async function saveBookmark(novelSlug: string, chapterSlug: string, scrollPosition = 0) {
  const database = await initBookmarkDB()
  const key = `${novelSlug}:${chapterSlug}`

  await database.put(
    "bookmarks",
    {
      novelSlug,
      chapterSlug,
      scrollPosition,
      timestamp: Date.now(),
    },
    key,
  )

  console.log("[Kronos] Bookmark saved:", key)
}

export async function getBookmark(novelSlug: string, chapterSlug: string) {
  const database = await initBookmarkDB()
  const key = `${novelSlug}:${chapterSlug}`

  return await database.get("bookmarks", key)
}

export async function removeBookmark(novelSlug: string, chapterSlug: string) {
  const database = await initBookmarkDB()
  const key = `${novelSlug}:${chapterSlug}`

  await database.delete("bookmarks", key)
  console.log("[Kronos] Bookmark removed:", key)
}

export async function getAllBookmarks() {
  const database = await initBookmarkDB()
  return await database.getAll("bookmarks")
}

export async function getNovelBookmarks(novelSlug: string) {
  const database = await initBookmarkDB()
  const allBookmarks = await database.getAll("bookmarks")

  return allBookmarks.filter((bookmark) => bookmark.novelSlug === novelSlug)
}
