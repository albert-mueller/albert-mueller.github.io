<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data as announcements } from '../announcements.data'
import { data as issues } from '../issues.data'
import { data as discussions } from '../discussions.data'
import { formatDate } from '../formatDate'
import { useStrings } from '../i18n'

const props = defineProps<{ limit?: number, kind?: 'announcements' | 'issues' | 'discussions' }>()

const t = useStrings()
const kind = computed(() => props.kind ?? 'announcements')
const items = computed(() => {
    const all = { announcements, issues, discussions }[kind.value]
    return props.limit ? all.slice(0, props.limit) : all
})
</script>

<template>
    <div class="announcement-list">
        <p v-if="!items.length" class="announcement-empty">
            {{ t.empty[kind] }}
        </p>
        <a
            v-for="a in items"
            :key="a.number"
            class="announcement-card"
            :href="withBase(`${t.prefix}/${kind}/${a.number}.html`)"
        >
            <span class="announcement-card-date">
                <span v-if="a.pinned" class="announcement-badge">{{ t.pinned }}</span>
                <time :datetime="a.createdAt">{{ formatDate(a.createdAt, t.dateLocale) }}</time>
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
