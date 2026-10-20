<script setup lang="ts">
import { withBase } from 'vitepress'
import { data } from '../announcements.data'
import AnnouncementList from './AnnouncementList.vue'
</script>

<template>
    <section v-if="data.length" class="home-announcements">
        <div class="home-announcements-header">
            <h2>Latest announcements</h2>
            <span class="home-announcements-links">
                <a :href="withBase('/announcements/')">All announcements →</a>
                <a :href="withBase('/announcements.xml')" target="_blank" rel="noreferrer">RSS</a>
            </span>
        </div>
        <AnnouncementList :limit="3" />
    </section>
</template>
