import { defineConfig } from 'vitepress'
import multimdTable from 'markdown-it-multimd-table'
import { loadAnnouncements, loadDiscussions, loadIssues } from './announcements'

const titles: Record<string, string> = {
    "START": "What is OpenCore?",
    "MODELS": "Supported Models",
    "FAQ": "FAQ",
    "INSTALLER": "Creating macOS Installers",
    "BUILD": "Building and installing OpenCore",
    "BOOT": "Booting OpenCore and macOS",
    "POST-INSTALL": "Post-Installation",
    "TAHOE-DROP": "macOS Tahoe",
    "SEQUOIA-DROP": "macOS Sequoia",
    "SONOMA-DROP": "macOS Sonoma",
    "VENTURA-DROP": "macOS Ventura",
    "MONTEREY-DROP": "macOS Monterey",
    "UPDATE": "Updating",
    "UNINSTALL": "Uninstall",
    "PROCESS": "Background process",
    "TROUBLESHOOT-APP": "Application issues",
    "TROUBLESHOOT-MISC": "Booting, installer and other issues",
    "TROUBLESHOOT-NONMETAL": "Non-Metal issues",
    "TROUBLESHOOT-HARDWARE": "Hardware issues",
    "DEBUG": "How to debug with OpenCore",
    "TIMEMACHINE": "Restoring Time Machine backup",
    "ICNS": "Creating custom icons for OpenCore and Mac Boot Picker",
    "WINDOWS": "Installing Windows in UEFI Mode",
    "UNIVERSALCONTROL": "Universal Control on unsupported Macs",
    "LICENSE": "OpenCore Legacy Patcher License",
    "TERMS": "OpenCore Patcher Terminology",
    "HOW": "Boot Process with OpenCore Legacy Patcher T2",
    "PATCHEXPLAIN": "Explaining the patches in OpenCore Legacy Patcher T2"
}

// German sidebar titles for the pages under de/.
const titlesDe: Record<string, string> = {
    "START": "Was ist OpenCore?",
    "MODELS": "Unterstützte Modelle",
    "FAQ": "FAQ",
    "INSTALLER": "macOS-Installer erstellen",
    "BUILD": "OpenCore erstellen und installieren",
    "BOOT": "OpenCore und macOS booten",
    "POST-INSTALL": "Nach der Installation",
    "TAHOE-DROP": "macOS Tahoe",
    "SEQUOIA-DROP": "macOS Sequoia",
    "SONOMA-DROP": "macOS Sonoma",
    "VENTURA-DROP": "macOS Ventura",
    "MONTEREY-DROP": "macOS Monterey",
    "UPDATE": "Aktualisieren",
    "UNINSTALL": "Deinstallation",
    "PROCESS": "Hintergrundprozess",
    "TROUBLESHOOT-APP": "Probleme mit der Anwendung",
    "TROUBLESHOOT-MISC": "Booten, Installer und Sonstiges",
    "TROUBLESHOOT-NONMETAL": "Non-Metal-Probleme",
    "TROUBLESHOOT-HARDWARE": "Hardware-Probleme",
    "DEBUG": "Debuggen mit OpenCore",
    "TIMEMACHINE": "Time-Machine-Backup wiederherstellen",
    "ICNS": "Eigene Symbole für OpenCore und den Mac-Bootpicker",
    "WINDOWS": "Windows im UEFI-Modus installieren",
    "UNIVERSALCONTROL": "Universelle Steuerung auf nicht unterstützten Macs",
    "LICENSE": "Lizenz von OpenCore Legacy Patcher",
    "TERMS": "OpenCore-Patcher-Terminologie",
    "HOW": "Bootvorgang mit OpenCore Legacy Patcher T2",
    "PATCHEXPLAIN": "Erklärung der Patches in OpenCore Legacy Patcher T2"
}

// Guide pages that exist in every language. The mirrored announcements,
// discussions and issues also have a German version (German UI, original text)
// under de/announcements/, de/discussions/ and de/issues/.
const TRANSLATED_PAGES = [...Object.keys(titles), 'TROUBLESHOOTING']

// Public URL of the deployed site (GitHub Pages user site at the domain root).
// Used for the sitemap, canonical links and Open Graph tags so search engines
// and link previews always see absolute, stable URLs.
const SITE_URL = 'https://albert-mueller.github.io/'
const SITE_TITLE = 'OpenCore Legacy Patcher T2'
const SITE_DESCRIPTION = 'Guide to put macOS on unsupported devices'
const SITE_DESCRIPTION_DE = 'Anleitung, um macOS auf nicht unterstützte Geräte zu bringen'
const COPYRIGHT = 'Copyright © Dortania 2020-2025 · T2 fork © 2026 Albert Müller and OCLP-T2 contributors'
const COPYRIGHT_DE = 'Copyright © Dortania 2020–2025 · T2-Fork © 2026 Albert Müller und OCLP-T2-Mitwirkende'

// localStorage key holding the visitor's language choice ('en' or 'de').
// Shared with .vitepress/theme/index.ts.
const LANG_KEY = 'oclp-t2-lang'

// Runs in <head> before the page renders: on a device whose preferred language
// is German, open the German version of the current page, unless the
// visitor has already picked a language with the language switcher.
const LANG_REDIRECT = `(function () {
  try {
    var pref = null;
    try { pref = localStorage.getItem(${JSON.stringify(LANG_KEY)}); } catch (e) {}
    if (pref) return;
    var langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ''];
    if (!/^de(-|$)/i.test(langs[0] || '')) return;
    var pages = ${JSON.stringify(TRANSLATED_PAGES)};
    var p = location.pathname, target = null;
    if (p === '/' || p === '/index.html') target = '/de/';
    else if (/^\\/(announcements|discussions|issues)\\//.test(p)) target = '/de' + p;
    else {
      var m = p.match(/^\\/([A-Za-z0-9-]+?)(\\.html)?$/);
      if (m && pages.indexOf(m[1]) !== -1) target = '/de/' + m[1] + '.html';
    }
    if (target) location.replace(target + location.search + location.hash);
  } catch (e) {}
})();`

// Announcements mirrored from the patcher's GitHub Discussions
// (generated by scripts/fetch-announcements.mjs before the build).
const announcements = loadAnnouncements()
const discussions = loadDiscussions()
const issues = loadIssues()

const RSS_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>RSS</title><path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20 5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1Z"/></svg>'

// Maps a source page (e.g. "BUILD.md", "index.md") to its public URL.
// cleanUrls is off, so pages are served as *.html.
const pageUrl = (relativePath: string) =>
    SITE_URL + relativePath
        .replace(/(^|\/)(index|README)\.md$/, '$1')
        .replace(/\.md$/, '.html')

const group = (text: string, pages: string[]) => ({
    text,
    collapsed: false,
    items: pages.map((page) => ({ text: titles[page] ?? page, link: `/${page}` })),
})

const groupDe = (text: string, pages: string[]) => ({
    text,
    collapsed: false,
    items: pages.map((page) => ({ text: titlesDe[page] ?? page, link: `/de/${page}` })),
})

export default defineConfig({
    lang: 'en-US',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    base: '/',
    rewrites: {
        'README.md': 'index.md',
    },
    srcExclude: ['node_modules/**'],
    lastUpdated: true,
    // Generates /sitemap.xml at build time.
    // Submit it in Google Search Console / Bing Webmaster Tools.
    sitemap: {
        hostname: SITE_URL,
    },
    ignoreDeadLinks: true,
    head: [
        ['script', {}, LANG_REDIRECT],
        ['link', { rel: 'icon', href: '/favicon.ico?v=2' }],
        ['link', { rel: 'alternate', type: 'application/rss+xml', title: `${SITE_TITLE} – Announcements`, href: `${SITE_URL}announcements.xml` }],
        ['link', { rel: 'alternate', type: 'application/rss+xml', title: `${SITE_TITLE} – Discussions`, href: `${SITE_URL}discussions.xml` }],
        ['link', { rel: 'alternate', type: 'application/rss+xml', title: `${SITE_TITLE} – Issues`, href: `${SITE_URL}issues.xml` }],
        ['meta', { name: 'theme-color', content: '#3eaf7c' }],
        ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
        ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
        // Explicitly allow indexing (also the default) and large image previews.
        ['meta', { name: 'robots', content: 'index, follow, max-image-preview:large' }],
        ['meta', { property: 'og:site_name', content: SITE_TITLE }],
        ['meta', { property: 'og:type', content: 'website' }],
        ['meta', { property: 'og:image', content: `${SITE_URL}homepage.png` }],
        ['meta', { name: 'twitter:card', content: 'summary' }],
    ],
    // Per-page SEO tags: canonical URL plus Open Graph title/description/url,
    // so every guide page is indexed under exactly one address. Translated
    // guide pages also link to each other via hreflang.
    transformPageData(pageData) {
        // Announcement pages get their title/description from the discussion.
        if (/^(de\/)?(announcements|discussions|issues)\//.test(pageData.relativePath) && pageData.params?.title) {
            pageData.title = pageData.params.title
            pageData.description = pageData.params.excerpt
        }
        const isDe = pageData.relativePath.startsWith('de/')
        const url = pageUrl(pageData.relativePath)
        const title = pageData.frontmatter.title || pageData.title || SITE_TITLE
        const description = pageData.frontmatter.description || pageData.description || (isDe ? SITE_DESCRIPTION_DE : SITE_DESCRIPTION)
        pageData.frontmatter.head ??= []
        pageData.frontmatter.head.push(
            ['link', { rel: 'canonical', href: url }],
            ['meta', { property: 'og:url', content: url }],
            ['meta', { property: 'og:title', content: title === SITE_TITLE ? title : `${title} | ${SITE_TITLE}` }],
            ['meta', { property: 'og:description', content: description }],
            ['meta', { property: 'og:locale', content: isDe ? 'de_DE' : 'en_US' }],
        )
        const basePath = isDe ? pageData.relativePath.slice(3) : pageData.relativePath
        const pageName = basePath.replace(/\.md$/, '')
        if (pageName === 'index' || pageName === 'README' || TRANSLATED_PAGES.includes(pageName)
            || /^(announcements|discussions|issues)\//.test(pageName)) {
            const enUrl = pageUrl(basePath)
            const deUrl = pageUrl(`de/${basePath}`)
            pageData.frontmatter.head.push(
                ['link', { rel: 'alternate', hreflang: 'en', href: enUrl }],
                ['link', { rel: 'alternate', hreflang: 'de', href: deUrl }],
                ['link', { rel: 'alternate', hreflang: 'x-default', href: enUrl }],
            )
        }
    },
    markdown: {
        // markdown-it-attrs' table rowspan fix-up hides cells of tables built by
        // markdown-it-multimd-table (rowspan via ^^). The docs don't use {attrs}
        // syntax, so turn it off.
        attrs: { disable: true },
        config: (md) => {
            md.use(multimdTable, { rowspan: true })
        },
    },
    // English lives at the root, German under /de/. VitePress shows a language
    // switcher in the nav bar that jumps to the same page in the other language.
    locales: {
        root: {
            label: 'English',
            lang: 'en-US',
        },
        de: {
            label: 'Deutsch',
            lang: 'de-DE',
            link: '/de/',
            description: SITE_DESCRIPTION_DE,
            themeConfig: {
                nav: [
                    { text: 'Anleitung', link: '/de/START' },
                    { text: 'Ankündigungen', link: '/de/announcements/', activeMatch: '^/de/announcements/' },
                    { text: 'Diskussionen', link: '/de/discussions/', activeMatch: '^/de/discussions/' },
                    { text: 'Issues', link: '/de/issues/', activeMatch: '^/de/issues/' },
                ],
                socialLinks: [
                    { icon: 'github', link: 'https://github.com/albert-mueller/OpenCore-Legacy-Patcher-T2/' },
                    { icon: { svg: RSS_ICON }, link: `${SITE_URL}announcements.xml`, ariaLabel: 'RSS-Feed der Ankündigungen' },
                ],
                editLink: {
                    pattern: 'https://github.com/albert-mueller/albert-mueller.github.io/edit/main/:path',
                    text: 'Hilf uns, diese Seite zu verbessern!',
                },
                footer: {
                    copyright: COPYRIGHT_DE,
                },
                outline: { level: [2, 2], label: 'Auf dieser Seite' },
                docFooter: { prev: 'Vorherige Seite', next: 'Nächste Seite' },
                lastUpdated: { text: 'Zuletzt aktualisiert' },
                returnToTopLabel: 'Nach oben',
                sidebarMenuLabel: 'Menü',
                darkModeSwitchLabel: 'Erscheinungsbild',
                lightModeSwitchTitle: 'Zum hellen Modus wechseln',
                darkModeSwitchTitle: 'Zum dunklen Modus wechseln',
                langMenuLabel: 'Sprache ändern',
                skipToContentLabel: 'Zum Inhalt springen',
                notFound: {
                    title: 'SEITE NICHT GEFUNDEN',
                    quote: 'Diese Seite gibt es leider nicht.',
                    linkLabel: 'Zur Startseite',
                    linkText: 'Zur Startseite',
                },
                sidebar: {
                    '/de/announcements/': [
                        {
                            text: 'Ankündigungen',
                            items: [
                                { text: 'Alle Ankündigungen', link: '/de/announcements/' },
                                ...announcements.slice(0, 20).map((a) => ({
                                    text: a.title,
                                    link: `/de/announcements/${a.number}`,
                                })),
                            ],
                        },
                    ],
                    '/de/discussions/': [
                        {
                            text: 'Diskussionen',
                            items: [
                                { text: 'Alle Diskussionen', link: '/de/discussions/' },
                                ...discussions.slice(0, 20).map((d) => ({
                                    text: d.title,
                                    link: `/de/discussions/${d.number}`,
                                })),
                            ],
                        },
                    ],
                    '/de/issues/': [
                        {
                            text: 'Issues',
                            items: [
                                { text: 'Alle Issues', link: '/de/issues/' },
                                ...issues.slice(0, 20).map((i) => ({
                                    text: i.title,
                                    link: `/de/issues/${i.number}`,
                                })),
                            ],
                        },
                    ],
                    '/de/': [
                        groupDe('Einführung', ['START', 'MODELS', 'FAQ']),
                        groupDe('Installation', ['INSTALLER', 'BUILD', 'BOOT', 'POST-INSTALL']),
                        groupDe('macOS-Unterstützung', ['TAHOE-DROP', 'SEQUOIA-DROP', 'SONOMA-DROP', 'VENTURA-DROP', 'MONTEREY-DROP']),
                        groupDe('Anwendung', ['UPDATE', 'UNINSTALL', 'PROCESS']),
                        groupDe('Fehlerbehebung', ['TROUBLESHOOT-APP', 'TROUBLESHOOT-MISC', 'TROUBLESHOOT-NONMETAL', 'TROUBLESHOOT-HARDWARE', 'DEBUG']),
                        groupDe('Sonstiges', ['TIMEMACHINE', 'ICNS', 'WINDOWS', 'UNIVERSALCONTROL']),
                        groupDe('Danksagung', ['LICENSE']),
                        groupDe('Dokumentation', ['TERMS', 'HOW', 'PATCHEXPLAIN']),
                    ],
                },
            },
        },
    },
    themeConfig: {
        logo: '/homepage.png',
        // The full title is too wide for the sidebar column and overflows past
        // its divider, so use a short name in the nav bar. `title` above is
        // still used for browser tabs and page metadata.
        siteTitle: 'OCLP T2',
        outline: [2, 2],
        nav: [
            { text: 'Guide', link: '/START' },
            { text: 'Announcements', link: '/announcements/', activeMatch: '^/announcements/' },
            { text: 'Discussions', link: '/discussions/', activeMatch: '^/discussions/' },
            { text: 'Issues', link: '/issues/', activeMatch: '^/issues/' },
        ],
        socialLinks: [
            { icon: 'github', link: 'https://github.com/albert-mueller/OpenCore-Legacy-Patcher-T2/' },
            { icon: { svg: RSS_ICON }, link: `${SITE_URL}announcements.xml`, ariaLabel: 'Announcements RSS feed' },
        ],
        editLink: {
            pattern: 'https://github.com/albert-mueller/albert-mueller.github.io/edit/main/:path',
            text: 'Help us improve this page!',
        },
        search: {
            provider: 'local',
            options: {
                locales: {
                    de: {
                        translations: {
                            button: { buttonText: 'Suchen', buttonAriaLabel: 'Suchen' },
                            modal: {
                                displayDetails: 'Detailansicht anzeigen',
                                resetButtonTitle: 'Suche zurücksetzen',
                                backButtonTitle: 'Suche schließen',
                                noResultsText: 'Keine Ergebnisse für',
                                footer: {
                                    selectText: 'auswählen',
                                    navigateText: 'navigieren',
                                    closeText: 'schließen',
                                },
                            },
                        },
                    },
                },
            },
        },
        footer: {
            copyright: COPYRIGHT,
        },
        sidebar: {
            '/announcements/': [
                {
                    text: 'Announcements',
                    items: [
                        { text: 'All announcements', link: '/announcements/' },
                        ...announcements.slice(0, 20).map((a) => ({
                            text: a.title,
                            link: `/announcements/${a.number}`,
                        })),
                    ],
                },
            ],
            '/discussions/': [
                {
                    text: 'Discussions',
                    items: [
                        { text: 'All discussions', link: '/discussions/' },
                        ...discussions.slice(0, 20).map((d) => ({
                            text: d.title,
                            link: `/discussions/${d.number}`,
                        })),
                    ],
                },
            ],
            '/issues/': [
                {
                    text: 'Issues',
                    items: [
                        { text: 'All issues', link: '/issues/' },
                        ...issues.slice(0, 20).map((i) => ({
                            text: i.title,
                            link: `/issues/${i.number}`,
                        })),
                    ],
                },
            ],
            '/': [
                group('Introduction', ['START', 'MODELS', 'FAQ']),
                group('How to install', ['INSTALLER', 'BUILD', 'BOOT', 'POST-INSTALL']),
                group('macOS Support', ['TAHOE-DROP', 'SEQUOIA-DROP', 'SONOMA-DROP', 'VENTURA-DROP', 'MONTEREY-DROP']),
                group('Application', ['UPDATE', 'UNINSTALL', 'PROCESS']),
                group('Troubleshooting', ['TROUBLESHOOT-APP', 'TROUBLESHOOT-MISC', 'TROUBLESHOOT-NONMETAL', 'TROUBLESHOOT-HARDWARE', 'DEBUG']),
                group('Misc', ['TIMEMACHINE', 'ICNS', 'WINDOWS', 'UNIVERSALCONTROL']),
                group('Credit', ['LICENSE']),
                group('Documentation', ['TERMS', 'HOW', 'PATCHEXPLAIN']),
            ],
        },
    },
})
