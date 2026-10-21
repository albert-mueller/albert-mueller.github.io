// UI strings of the custom components (announcement lists and pages) per
// locale. The keys match the `locales` in .vitepress/config.mts: "root" is
// English, "de" is German. Mirrored GitHub content itself is not translated.
import { computed } from 'vue'
import { useData } from 'vitepress'

const strings = {
    root: {
        prefix: '',
        dateLocale: 'en-US',
        empty: {
            announcements: 'There are no announcements yet.',
            discussions: 'There are no open discussions.',
            issues: 'There are no open issues.',
        },
        back: {
            announcements: '← All announcements',
            discussions: '← All discussions',
            issues: '← All issues',
        },
        pinned: 'Pinned',
        answer: 'Answer',
        by: 'by',
        edited: 'edited',
        comments: 'Comments',
        commentCount: (n: number) => (n === 0 ? 'No comments yet' : n === 1 ? '1 comment' : `${n} comments`),
        onGitHub: {
            announcements: 'Discuss this announcement on GitHub',
            discussions: 'Join this discussion on GitHub',
            issues: 'Discuss this issue on GitHub',
        },
        latestAnnouncements: 'Latest announcements',
        allAnnouncements: 'All announcements →',
    },
    de: {
        prefix: '/de',
        dateLocale: 'de-DE',
        empty: {
            announcements: 'Es gibt noch keine Ankündigungen.',
            discussions: 'Es gibt keine offenen Diskussionen.',
            issues: 'Es gibt keine offenen Issues.',
        },
        back: {
            announcements: '← Alle Ankündigungen',
            discussions: '← Alle Diskussionen',
            issues: '← Alle Issues',
        },
        pinned: 'Angeheftet',
        answer: 'Antwort',
        by: 'von',
        edited: 'bearbeitet',
        comments: 'Kommentare',
        commentCount: (n: number) => (n === 0 ? 'Noch keine Kommentare' : n === 1 ? '1 Kommentar' : `${n} Kommentare`),
        onGitHub: {
            announcements: 'Diese Ankündigung auf GitHub diskutieren',
            discussions: 'An dieser Diskussion auf GitHub teilnehmen',
            issues: 'Dieses Issue auf GitHub diskutieren',
        },
        latestAnnouncements: 'Neueste Ankündigungen',
        allAnnouncements: 'Alle Ankündigungen →',
    },
}

export type Kind = 'announcements' | 'discussions' | 'issues'

export function useStrings() {
    const { localeIndex } = useData()
    return computed(() => strings[localeIndex.value as keyof typeof strings] ?? strings.root)
}
