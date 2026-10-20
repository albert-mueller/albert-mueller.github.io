import DefaultTheme from 'vitepress/theme'
import { onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import mediumZoom from 'medium-zoom'
import AnnouncementList from './components/AnnouncementList.vue'
import AnnouncementPage from './components/AnnouncementPage.vue'
import HomeAnnouncements from './components/HomeAnnouncements.vue'
import './custom.css'

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
        onMounted(initZoom)
        watch(() => route.path, () => nextTick(initZoom))
    },
}
