import { loadIssues } from '../.vitepress/announcements'

// One page per open issue: /issues/<issue number>.html
export default {
    paths() {
        return loadIssues().map((issue) => ({
            params: { ...issue, number: String(issue.number), kind: 'issues' },
        }))
    },
}
