import { loadDiscussions } from '../../.vitepress/announcements'

// German version (same data, German UI). One page per open discussion: /de/discussions/<discussion number>.html
export default {
    paths() {
        return loadDiscussions().map((discussion) => ({
            params: { ...discussion, number: String(discussion.number), kind: 'discussions' },
        }))
    },
}
