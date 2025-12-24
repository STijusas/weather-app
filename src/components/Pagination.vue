<template>
  <nav class="pagination is-centered mt-5" role="navigation">
    <button 
      class="pagination-previous" 
      :disabled="currentPage === 1"
      @click="$emit('update:currentPage', currentPage - 1)"
    >
      Previous
    </button>
    <button 
      class="pagination-next"
      :disabled="currentPage === totalPages"
      @click="$emit('update:currentPage', currentPage + 1)"
    >
      Next
    </button>
    <ul class="pagination-list">
      <li v-for="page in displayPages" :key="page">
        <span v-if="page === '...'" class="pagination-ellipsis">&hellip;</span>
        <a 
          v-else
          class="pagination-link"
          :class="{ 'is-current': page === currentPage }"
          @click="$emit('update:currentPage', page)"
        >
          {{ page }}
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true }
})

defineEmits(['update:currentPage'])

const displayPages = computed(() => {
  const pages = []
  const total = props.totalPages
  const current = props.currentPage

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 3) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 2) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    }
  }

  return pages
})
</script>