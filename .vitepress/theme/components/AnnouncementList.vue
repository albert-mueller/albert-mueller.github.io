<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data as announcements } from '../announcements.data'
import { data as issues } from '../issues.data'
import { formatDate } from '../formatDate'

const props = defineProps<{ limit?: number, kind?: 'announcements' | 'issues' }>()

const kind = computed(() => props.kind ?? 'announcements')
const items = computed(() => {
    const all = kind.value === 'issues' ? issues : announcements
    return props.limit ? all.slice(0, props.limit) : all
})
</script>

<template>
    <div class="announcement-list">
        <p v-if="!items.length" class="announcement-empty">
            {{ kind === 'issues' ? 'There are no open issues.' : 'There are no announcements yet.' }}
        </p>
        <a
            v-for="a in items"
            :key="a.number"
            class="announcement-card"
            :href="withBase(`/${kind}/${a.number}.html`)"
        >
            <span class="announcement-card-date">
                <span v-if="a.pinned" class="announcement-badge">Pinned</span>
                <time :datetime="a.createdAt">{{ formatDate(a.createdAt) }}</time>
                <template v-if="a.category && a.category !== 'Announcements'"> · {{ a.category }}</template>
            </span>
            <span class="announcement-card-title">{{ a.title }}</span>
            <span v-if="a.labels?.length" class="announcement-labels">
                <span v-for="label in a.labels" :key="label.name" class="announcement-label">{{ label.name }}</span>
            </span>
            <span v-if="a.excerpt" class="announcement-card-excerpt">{{ a.excerpt }}</span>
        </a>
    </div>
</template>
