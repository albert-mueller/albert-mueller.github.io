// Client side of the opt-in browser notifications (see public/notify-sw.js).
import { inBrowser } from 'vitepress'

const KEY = 'oclp-t2-notify'
const SW_URL = '/notify-sw.js'
const SYNC_TAG = 'oclp-t2-announcements'
const SYNC_INTERVAL = 6 * 60 * 60 * 1000
const FOREGROUND_INTERVAL = 30 * 60 * 1000

export type Lang = 'en' | 'de'
export type NotifyStatus = 'unsupported' | 'ios-install' | 'denied' | 'off' | 'on'

const isSupported = () => inBrowser && 'serviceWorker' in navigator && 'Notification' in window
const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches
    || (navigator as any).standalone === true

function stored(): boolean {
    try {
        return localStorage.getItem(KEY) === 'on'
    } catch {
        return false
    }
}

function store(on: boolean) {
    try {
        if (on) localStorage.setItem(KEY, 'on')
        else localStorage.removeItem(KEY)
    } catch {
        // Storage unavailable (private mode): the toggle just isn't remembered.
    }
}

export function getStatus(): NotifyStatus {
    if (!inBrowser) return 'unsupported'
    // Safari on iPhone/iPad only offers notifications to home-screen web apps.
    if (!isSupported()) return isIOS() && !isStandalone() ? 'ios-install' : 'unsupported'
    if (Notification.permission === 'denied') return 'denied'
    return stored() && Notification.permission === 'granted' ? 'on' : 'off'
}

async function ourRegistration() {
    const reg = await navigator.serviceWorker.getRegistration('/')
    const script = reg?.active?.scriptURL || reg?.installing?.scriptURL || reg?.waiting?.scriptURL
    return script && new URL(script).pathname === SW_URL ? reg : undefined
}

function send(worker: ServiceWorker, msg: object) {
    return new Promise<void>((resolve, reject) => {
        const channel = new MessageChannel()
        channel.port1.onmessage = (e) => (e.data?.ok ? resolve() : reject(new Error(e.data?.error)))
        worker.postMessage(msg, [channel.port2])
    })
}

// Background checks: only granted by Chrome/Edge for sites installed as an app.
async function tryPeriodicSync(reg: ServiceWorkerRegistration) {
    try {
        const perm = await navigator.permissions.query({ name: 'periodic-background-sync' as PermissionName })
        if (perm.state !== 'granted' || !('periodicSync' in reg)) return false
        await (reg as any).periodicSync.register(SYNC_TAG, { minInterval: SYNC_INTERVAL })
        return true
    } catch {
        return false
    }
}

export async function hasBackgroundChecks(): Promise<boolean> {
    try {
        const reg = await ourRegistration()
        if (!reg || !('periodicSync' in reg)) return false
        const tags: string[] = await (reg as any).periodicSync.getTags()
        return tags.includes(SYNC_TAG)
    } catch {
        return false
    }
}

export async function enableNotifications(lang: Lang): Promise<NotifyStatus> {
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') return getStatus()
    await navigator.serviceWorker.register(SW_URL, { scope: '/' })
    const reg = await navigator.serviceWorker.ready
    await send(reg.active!, { type: 'enable', lang })
    store(true)
    await tryPeriodicSync(reg)
    return 'on'
}

export async function disableNotifications(): Promise<NotifyStatus> {
    store(false)
    const reg = await ourRegistration()
    if (reg) {
        if (reg.active) await send(reg.active, { type: 'disable' }).catch(() => {})
        try {
            await (reg as any).periodicSync?.unregister(SYNC_TAG)
        } catch {
            // Not supported; nothing to unregister.
        }
        await reg.unregister()
    }
    return getStatus()
}

// While a page of the site is open: check now and every 30 minutes, and pick
// up background checks if the site was installed as an app in the meantime.
export function startNotifyChecks(getLang: () => Lang) {
    if (getStatus() !== 'on') return
    const run = async () => {
        try {
            const reg = await ourRegistration()
            if (!reg?.active || getStatus() !== 'on') return
            await send(reg.active, { type: 'check', lang: getLang() })
        } catch {
            // Offline or notify.json missing: try again next time.
        }
    }
    ourRegistration().then((reg) => reg && tryPeriodicSync(reg))
    run()
    setInterval(run, FOREGROUND_INTERVAL)
}
