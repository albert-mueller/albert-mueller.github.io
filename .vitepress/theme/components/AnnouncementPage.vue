<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import type { Announcement } from '../../announcements'
import { formatDate } from '../formatDate'

// Filled in by announcements/[number].paths.mts
const { params } = useData()
const a = computed(() => params.value as unknown as Announcement)

const commentsLabel = computed(() => {
    const n = a.value.comments
    return n === 0 ? 'No comments yet' : n === 1 ? '1 comment' : `${n} comments`
})
</script>

<template>
    <article class="announcement">
        <p class="announcement-back">
            <a :href="withBase('/announcements/')">← All announcements</a>
        </p>
        <h1>{{ a.title }}</h1>
        <p class="announcement-meta">
            <time :datetime="a.createdAt">{{ formatDate(a.createdAt) }}</time>
            <template v-if="a.author">
                · by <a :href="a.author.url" target="_blank" rel="noreferrer">@{{ a.author.login }}</a>
            </template>
            <template v-if="a.lastEditedAt">
                · edited {{ formatDate(a.lastEditedAt) }}
            </template>
        </p>
        <!-- bodyHTML is GitHub's own sanitised rendering of the discussion -->
        <div class="announcement-body" v-html="a.bodyHTML" />
        <div class="announcement-actions">
            <a class="announcement-button" :href="a.url" target="_blank" rel="noreferrer">
                Discuss this announcement on GitHub
            </a>
            <span class="announcement-comments">{{ commentsLabel }}</span>
        </div>
    </article>
</template>
