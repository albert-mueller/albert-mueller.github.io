import { loadDiscussions } from '../../.vitepress/announcements'

// German locale: one page per open discussion at /de/discussions/<discussion number>.html
export default {
    paths() {
        return loadDiscussions().map((discussion) => ({
            params: { ...discussion, number: String(discussion.number), kind: 'discussions' },
        }))
    },
}
