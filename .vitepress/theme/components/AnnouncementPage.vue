<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import type { Announcement } from '../../announcements'
import { formatDate } from '../formatDate'
import { useStrings, type Kind } from '../i18n'

// Filled in by announcements/, discussions/ and issues/[number].paths.mts
const { params } = useData()
const a = computed(() => params.value as unknown as Announcement & { kind?: string })
const isIssue = computed(() => a.value.kind === 'issues')
const isDiscussion = computed(() => a.value.kind === 'discussions')

const t = useStrings()
const kind = computed<Kind>(() => (isIssue.value ? 'issues' : isDiscussion.value ? 'discussions' : 'announcements'))
const commentsLabel = computed(() => t.value.commentCount(a.value.comments))
</script>

<template>
    <article class="announcement">
        <p class="announcement-back">
            <a :href="withBase(`${t.prefix}/${kind}/`)">{{ t.back[kind] }}</a>
        </p>
        <h1>{{ a.title }}</h1>
        <p class="announcement-meta">
            <span v-if="a.pinned" class="announcement-badge">{{ t.pinned }}</span>
            <time :datetime="a.createdAt">{{ formatDate(a.createdAt, t.dateLocale) }}</time>
            <template v-if="isDiscussion && a.category"> · {{ a.category }}</template>
            <template v-if="a.author">
                · {{ t.by }} <a :href="a.author.url" target="_blank" rel="noreferrer">@{{ a.author.login }}</a>
            </template>
            <template v-if="a.lastEditedAt">
                · {{ t.edited }} {{ formatDate(a.lastEditedAt, t.dateLocale) }}
            </template>
        </p>
        <p v-if="a.labels?.length" class="announcement-labels">
            <span v-for="label in a.labels" :key="label.name" class="announcement-label">{{ label.name }}</span>
        </p>
        <!-- bodyHTML is GitHub's own sanitised rendering of the discussion -->
        <div class="announcement-body" v-html="a.bodyHTML" />
        <section v-if="a.commentList?.length" class="announcement-comment-list">
            <h2>{{ t.comments }}</h2>
            <div v-for="c in a.commentList" :key="c.url" class="announcement-comment">
                <p class="announcement-comment-meta">
                    <span v-if="c.isAnswer" class="announcement-badge">{{ t.answer }}</span>
                    <a v-if="c.author" :href="c.author.url" target="_blank" rel="noreferrer">@{{ c.author.login }}</a>
                    <span v-else>ghost</span>
                    · <a :href="c.url" target="_blank" rel="noreferrer"><time :datetime="c.createdAt">{{ formatDate(c.createdAt, t.dateLocale) }}</time></a>
                    <template v-if="c.lastEditedAt"> · {{ t.edited }}</template>
                </p>
                <!-- GitHub's own sanitised rendering of the comment -->
                <div class="announcement-comment-body" v-html="c.bodyHTML" />
                <!-- Threaded replies (discussions only) -->
                <div v-if="c.replies?.length" class="announcement-replies">
                    <div v-for="r in c.replies" :key="r.url" class="announcement-reply">
                        <p class="announcement-comment-meta">
                            <a v-if="r.author" :href="r.author.url" target="_blank" rel="noreferrer">@{{ r.author.login }}</a>
                            <span v-else>ghost</span>
                            · <a :href="r.url" target="_blank" rel="noreferrer"><time :datetime="r.createdAt">{{ formatDate(r.createdAt, t.dateLocale) }}</time></a>
                            <template v-if="r.lastEditedAt"> · {{ t.edited }}</template>
                        </p>
                        <div class="announcement-comment-body" v-html="r.bodyHTML" />
                    </div>
                </div>
            </div>
        </section>
        <div class="announcement-actions">
            <a class="announcement-button" :href="a.url" target="_blank" rel="noreferrer">
                {{ t.onGitHub[kind] }}
            </a>
            <span class="announcement-comments">{{ commentsLabel }}</span>
        </div>
    </article>
</template>
