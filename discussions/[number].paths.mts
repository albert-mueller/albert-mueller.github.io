import { loadDiscussions } from '../.vitepress/announcements'

// One page per open discussion: /discussions/<discussion number>.html
export default {
    paths() {
        return loadDiscussions().map((discussion) => ({
            params: { ...discussion, number: String(discussion.number), kind: 'discussions' },
        }))
    },
}
