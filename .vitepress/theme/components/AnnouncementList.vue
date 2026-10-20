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
            <span class="announcement-card-date">
                <span v-if="a.pinned" class="announcement-badge">Pinned</span>
                <time :datetime="a.createdAt">{{ formatDate(a.createdAt) }}</time>
                <template v-if="a.category && a.category !== 'Announcements'"> · {{ a.category }}</template>
            </span>
            <span class="announcement-card-title">{{ a.title }}</span>
            <span v-if="a.excerpt" class="announcement-card-excerpt">{{ a.excerpt }}</span>
        </a>
    </div>
</template>
