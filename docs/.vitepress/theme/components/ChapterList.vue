<template>
  <div class="chapter-list">
    <div 
      v-for="chapter in chapters" 
      :key="chapter.slug"
      :class="['chapter-item', { bookmarked: isBookmarked(chapter.slug) }]"
    >
      <span class="chapter-number">{{ chapter.number }}</span>
      <a :href="chapter.link" class="chapter-title">{{ chapter.title }}</a>
      <span v-if="isBookmarked(chapter.slug)" class="bookmark-badge">
        Bookmark
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getNovelBookmarks } from '../bookmark-db'

const props = defineProps<{
  novelSlug: string
  chapters: Array<{
    number: number
    title: string
    slug: string
    link: string
  }>
}>()

const bookmarkedChapters = ref<Set<string>>(new Set())

const isBookmarked = (chapterSlug: string) => {
  return bookmarkedChapters.value.has(chapterSlug)
}

onMounted(async () => {
  const bookmarks = await getNovelBookmarks(props.novelSlug)
  bookmarkedChapters.value = new Set(bookmarks.map(b => b.chapterSlug))
})
</script>
