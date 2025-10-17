<template>
  <button 
    :class="['bookmark-button', { bookmarked: isBookmarked }]"
    @click="toggleBookmark"
    :title="isBookmarked ? 'Hapus bookmark' : 'Tambah bookmark'"
  >
    {{ isBookmarked ? '★' : '☆' }}
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { saveBookmark, getBookmark, removeBookmark } from '../bookmark-db'

const props = defineProps<{
  novelSlug: string
  chapterSlug: string
}>()

const isBookmarked = ref(false)
let scrollPosition = 0

const checkBookmark = async () => {
  const bookmark = await getBookmark(props.novelSlug, props.chapterSlug)
  isBookmarked.value = !!bookmark
  
  // Restore scroll position if bookmarked
  if (bookmark && bookmark.scrollPosition > 0) {
    window.scrollTo(0, bookmark.scrollPosition)
  }
}

const toggleBookmark = async () => {
  if (isBookmarked.value) {
    await removeBookmark(props.novelSlug, props.chapterSlug)
    isBookmarked.value = false
  } else {
    scrollPosition = window.scrollY
    await saveBookmark(props.novelSlug, props.chapterSlug, scrollPosition)
    isBookmarked.value = true
  }
}

const updateScrollPosition = () => {
  scrollPosition = window.scrollY
}

onMounted(async () => {
  await checkBookmark()
  window.addEventListener('scroll', updateScrollPosition)
})

onUnmounted(() => {
  // Save scroll position before leaving
  if (isBookmarked.value) {
    saveBookmark(props.novelSlug, props.chapterSlug, scrollPosition)
  }
  window.removeEventListener('scroll', updateScrollPosition)
})
</script>
