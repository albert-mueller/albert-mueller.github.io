import DefaultTheme from 'vitepress/theme'
import { onMounted, watch, nextTick } from 'vue'
import { inBrowser, useRoute } from 'vitepress'
import mediumZoom from 'medium-zoom'
import AnnouncementList from './components/AnnouncementList.vue'
import AnnouncementPage from './components/AnnouncementPage.vue'
import HomeAnnouncements from './components/HomeAnnouncements.vue'
import './custom.css'

// Same key as the language redirect script in .vitepress/config.mts.
const LANG_KEY = 'oclp-t2-lang'

// Guide pages that exist in English and German. Announcements, discussions and
// issues are English only, so visiting them says nothing about the language
// the visitor prefers.
const isGuidePage = (path: string) =>
    /^\/(de\/)?([A-Za-z0-9-]+(\.html)?)?$/.test(path)

export default {
    extends: DefaultTheme,
    enhanceApp({ app }) {
        app.component('AnnouncementList', AnnouncementList)
        app.component('AnnouncementPage', AnnouncementPage)
        app.component('HomeAnnouncements', HomeAnnouncements)
    },
    setup() {
        const route = useRoute()
        const initZoom = () => {
            mediumZoom('.vp-doc :not(a) > img', { background: 'var(--vp-c-bg)' })
        }
        // Remember the language of the guide page being read, so that a
        // visitor who switches languages with the language menu keeps that
        // choice and is no longer redirected automatically.
        const rememberLanguage = () => {
            if (!inBrowser || !isGuidePage(route.path)) return
            try {
                localStorage.setItem(LANG_KEY, route.path.startsWith('/de/') ? 'de' : 'en')
            } catch {
                // Storage can be unavailable (private mode); nothing to remember then.
            }
        }
        onMounted(() => {
            initZoom()
            rememberLanguage()
        })
        watch(() => route.path, () => {
            nextTick(initZoom)
            rememberLanguage()
        })
    },
}
