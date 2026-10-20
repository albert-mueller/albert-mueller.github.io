<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data } from '../announcements.data'
import { formatDate } from '../formatDate'

const props = defineProps<{ limit?: number }>()

const items = computed(() => (props.limit ? data.slice(0, props.limit) : data))
</script>

<template>
    <div class="announcement-list">
        <p v-if="!items.length" class="announcement-empty">
            There are no announcements yet.
        </p>
        <a
            v-for="a in items"
            :key="a.number"
            class="announcement-card"
            :href="withBase(`/announcements/${a.number}.html`)"
        >
            <time class="announcement-card-date" :datetime="a.createdAt">{{ formatDate(a.createdAt) }}</time>
            <span class="announcement-card-title">{{ a.title }}</span>
            <span v-if="a.excerpt" class="announcement-card-excerpt">{{ a.excerpt }}</span>
        </a>
    </div>
</template>
