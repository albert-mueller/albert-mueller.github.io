<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import type { Announcement } from '../../announcements'
import { formatDate } from '../formatDate'

// Filled in by announcements/[number].paths.mts and issues/[number].paths.mts
const { params } = useData()
const a = computed(() => params.value as unknown as Announcement & { kind?: string })
const isIssue = computed(() => a.value.kind === 'issues')

const commentsLabel = computed(() => {
    const n = a.value.comments
    return n === 0 ? 'No comments yet' : n === 1 ? '1 comment' : `${n} comments`
})
</script>

<template>
    <article class="announcement">
        <p class="announcement-back">
            <a v-if="isIssue" :href="withBase('/issues/')">← All issues</a>
            <a v-else :href="withBase('/announcements/')">← All announcements</a>
        </p>
        <h1>{{ a.title }}</h1>
        <p class="announcement-meta">
            <span v-if="a.pinned" class="announcement-badge">Pinned</span>
            <time :datetime="a.createdAt">{{ formatDate(a.createdAt) }}</time>
            <template v-if="a.author">
                · by <a :href="a.author.url" target="_blank" rel="noreferrer">@{{ a.author.login }}</a>
            </template>
            <template v-if="a.lastEditedAt">
                · edited {{ formatDate(a.lastEditedAt) }}
            </template>
        </p>
        <p v-if="a.labels?.length" class="announcement-labels">
            <span v-for="label in a.labels" :key="label.name" class="announcement-label">{{ label.name }}</span>
        </p>
        <!-- bodyHTML is GitHub's own sanitised rendering of the discussion -->
        <div class="announcement-body" v-html="a.bodyHTML" />
        <section v-if="a.commentList?.length" class="announcement-comment-list">
            <h2>Comments</h2>
            <div v-for="c in a.commentList" :key="c.url" class="announcement-comment">
                <p class="announcement-comment-meta">
                    <a v-if="c.author" :href="c.author.url" target="_blank" rel="noreferrer">@{{ c.author.login }}</a>
                    <span v-else>ghost</span>
                    · <a :href="c.url" target="_blank" rel="noreferrer"><time :datetime="c.createdAt">{{ formatDate(c.createdAt) }}</time></a>
                    <template v-if="c.lastEditedAt"> · edited</template>
                </p>
                <!-- GitHub's own sanitised rendering of the comment -->
                <div class="announcement-comment-body" v-html="c.bodyHTML" />
            </div>
        </section>
        <div class="announcement-actions">
            <a class="announcement-button" :href="a.url" target="_blank" rel="noreferrer">
                {{ isIssue ? 'Discuss this issue on GitHub' : 'Discuss this announcement on GitHub' }}
            </a>
            <span class="announcement-comments">{{ commentsLabel }}</span>
        </div>
    </article>
</template>
