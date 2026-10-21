// UI strings for the announcement/discussion/issue components, per locale.
// The posts themselves come from GitHub and are not translated.
import { computed } from 'vue'
import { useData } from 'vitepress'

const strings = {
    en: {
        allAnnouncements: 'All announcements',
        allDiscussions: 'All discussions',
        allIssues: 'All issues',
        pinned: 'Pinned',
        by: 'by',
        edited: 'edited',
        comments: 'Comments',
        answer: 'Answer',
        discussIssue: 'Discuss this issue on GitHub',
        joinDiscussion: 'Join this discussion on GitHub',
        discussAnnouncement: 'Discuss this announcement on GitHub',
        noComments: 'No comments yet',
        oneComment: '1 comment',
        nComments: (n: number) => `${n} comments`,
        noIssues: 'There are no open issues.',
        noDiscussions: 'There are no open discussions.',
        noAnnouncements: 'There are no announcements yet.',
        latestAnnouncements: 'Latest announcements',
    },
    de: {
        allAnnouncements: 'Alle Ankündigungen',
        allDiscussions: 'Alle Diskussionen',
        allIssues: 'Alle Issues',
        pinned: 'Angeheftet',
        by: 'von',
        edited: 'bearbeitet',
        comments: 'Kommentare',
        answer: 'Antwort',
        discussIssue: 'Dieses Issue auf GitHub diskutieren',
        joinDiscussion: 'An dieser Diskussion auf GitHub teilnehmen',
        discussAnnouncement: 'Diese Ankündigung auf GitHub diskutieren',
        noComments: 'Noch keine Kommentare',
        oneComment: '1 Kommentar',
        nComments: (n: number) => `${n} Kommentare`,
        noIssues: 'Es gibt keine offenen Issues.',
        noDiscussions: 'Es gibt keine offenen Diskussionen.',
        noAnnouncements: 'Es gibt noch keine Ankündigungen.',
        latestAnnouncements: 'Neueste Ankündigungen',
    },
}

export function useI18n() {
    const { lang, localeIndex } = useData()
    const isDe = computed(() => localeIndex.value === 'de')
    return {
        lang,
        t: computed(() => (isDe.value ? strings.de : strings.en)),
        // Path prefix of the current locale ('' for English at the root).
        prefix: computed(() => (isDe.value ? '/de' : '')),
    }
}
