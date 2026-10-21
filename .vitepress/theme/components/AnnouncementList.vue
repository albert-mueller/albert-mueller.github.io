<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { data as announcements } from '../announcements.data'
import { data as issues } from '../issues.data'
import { data as discussions } from '../discussions.data'
import { formatDate } from '../formatDate'

const props = defineProps<{ limit?: number, kind?: 'announcements' | 'issues' | 'discussions' }>()

const { lang } = useData()
const isDe = computed(() => lang.value.startsWith('de'))

const kind = computed(() => props.kind ?? 'announcements')
const items = computed(() => {
    const all = { announcements, issues, discussions }[kind.value]
    return props.limit ? all.slice(0, props.limit) : all
})

const emptyText = computed(() => isDe.value
    ? { issues: 'Es gibt keine offenen Issues.', discussions: 'Es gibt keine offenen Diskussionen.' }[kind.value]
        ?? 'Es gibt noch keine Ankündigungen.'
    : { issues: 'There are no open issues.', discussions: 'There are no open discussions.' }[kind.value]
        ?? 'There are no announcements yet.')
</script>

<template>
    <div class="announcement-list">
        <p v-if="!items.length" class="announcement-empty">
            {{ emptyText }}
        </p>
        <a
            v-for="a in items"
            :key="a.number"
            class="announcement-card"
            :href="withBase(`/${kind}/${a.number}.html`)"
        >
            <span class="announcement-card-date">
                <span v-if="a.pinned" class="announcement-badge">{{ isDe ? 'Angeheftet' : 'Pinned' }}</span>
                <time :datetime="a.createdAt">{{ formatDate(a.createdAt, lang) }}</time>
                <template v-if="a.category && (kind === 'discussions' || a.category !== 'Announcements')"> · {{ a.category }}</template>
            </span>
            <span class="announcement-card-title">{{ a.title }}</span>
            <span v-if="a.labels?.length" class="announcement-labels">
                <span v-for="label in a.labels" :key="label.name" class="announcement-label">{{ label.name }}</span>
            </span>
            <span v-if="a.excerpt" class="announcement-card-excerpt">{{ a.excerpt }}</span>
        </a>
    </div>
</template>
