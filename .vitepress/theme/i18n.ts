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
        lang: 'en' as const,
        notify: {
            enable: 'Get browser notifications',
            hintOff: 'Your browser shows a notification when a new announcement is posted. No account and no tracking, and you can turn it off at any time.',
            on: 'Browser notifications are on.',
            background: 'New announcements are checked in the background, even when this site is closed.',
            foreground: 'Your browser checks for new announcements while a page of this site is open. To also get them when it is closed, install the site as an app (Chrome or Edge: install icon in the address bar) or subscribe to the RSS feed.',
            disable: 'Turn off',
            denied: 'Notifications are blocked for this site in your browser settings. Allow them there to use browser notifications.',
            unsupported: 'This browser does not support notifications. You can subscribe to the RSS feed instead.',
            'ios-install': 'On iPhone and iPad: tap Share → “Add to Home Screen”, open the site from the home screen and turn on notifications there.',
            error: 'That did not work. Please try again.',
        },
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
        lang: 'de' as const,
        notify: {
            enable: 'Browser-Benachrichtigungen erhalten',
            hintOff: 'Dein Browser zeigt eine Benachrichtigung, sobald eine neue Ankündigung veröffentlicht wird. Ohne Konto und ohne Tracking, jederzeit abschaltbar.',
            on: 'Browser-Benachrichtigungen sind aktiviert.',
            background: 'Neue Ankündigungen werden im Hintergrund geprüft, auch wenn diese Website geschlossen ist.',
            foreground: 'Dein Browser prüft auf neue Ankündigungen, solange eine Seite dieser Website geöffnet ist. Um sie auch bei geschlossener Website zu erhalten, installiere die Website als App (Chrome oder Edge: Installations-Symbol in der Adressleiste) oder abonniere den RSS-Feed.',
            disable: 'Ausschalten',
            denied: 'Benachrichtigungen sind für diese Website in deinen Browser-Einstellungen blockiert. Erlaube sie dort, um Browser-Benachrichtigungen zu nutzen.',
            unsupported: 'Dieser Browser unterstützt keine Benachrichtigungen. Du kannst stattdessen den RSS-Feed abonnieren.',
            'ios-install': 'Auf iPhone und iPad: Tippe auf Teilen → „Zum Home-Bildschirm“, öffne die Website vom Home-Bildschirm aus und aktiviere dort die Benachrichtigungen.',
            error: 'Das hat nicht geklappt. Bitte versuche es erneut.',
        },
    },
}

export type Kind = 'announcements' | 'discussions' | 'issues'

export function useStrings() {
    const { localeIndex } = useData()
    return computed(() => strings[localeIndex.value as keyof typeof strings] ?? strings.root)
}
