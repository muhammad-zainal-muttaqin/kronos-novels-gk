<template>
  <div class="novel-card">
    <img 
      v-if="cover" 
      :src="cover" 
      :alt="`Cover ${title}`"
      class="novel-card-cover"
    />
    <div class="novel-card-content">
      <h3 class="novel-card-title">{{ title }}</h3>
      <p class="novel-card-author">oleh {{ author }}</p>
      <p class="novel-card-description">{{ description }}</p>
      
      <div class="novel-card-meta">
        <span :class="['status-badge', `status-${status}`]">
          {{ statusText }}
        </span>
      </div>
      
      <div v-if="tags && tags.length" class="novel-card-tags">
        <span v-for="tag in tags" :key="tag" class="novel-tag">
          {{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  author: string
  description: string
  cover?: string
  status: 'ongoing' | 'completed' | 'hiatus'
  tags?: string[]
}>()

const statusText = computed(() => {
  const statusMap = {
    ongoing: 'Berlangsung',
    completed: 'Selesai',
    hiatus: 'Hiatus'
  }
  return statusMap[props.status] || props.status
})
</script>
