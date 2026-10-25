// Opt-in browser notifications for new announcements, without a push server.
//
// The site is static (GitHub Pages), so nothing can push to the browser.
// Instead this service worker compares /notify.json (written by
// scripts/fetch-announcements.mjs on every hourly build) with the
// announcements it has already seen and shows a notification for each new one.
// It checks whenever a page of the site is open and, where the browser
// supports Periodic Background Sync (Chrome/Edge with the site installed as an
// app), also in the background. It does not intercept any requests.
const STATE_CACHE = 'oclp-t2-notify'
const STATE_URL = '/__notify-state'
const SYNC_TAG = 'oclp-t2-announcements'
const MAX_AT_ONCE = 3

const TEXT = {
  en: { body: 'New announcement – click to read it.', prefix: '' },
  de: { body: 'Neue Ankündigung – zum Lesen anklicken.', prefix: '/de' },
}

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))

async function loadState() {
  try {
    const cache = await caches.open(STATE_CACHE)
    const res = await cache.match(STATE_URL)
    return res ? await res.json() : null
  } catch {
    return null
  }
}

async function saveState(state) {
  const cache = await caches.open(STATE_CACHE)
  await cache.put(STATE_URL, new Response(JSON.stringify(state), {
    headers: { 'Content-Type': 'application/json' },
  }))
}

async function fetchLatest() {
  const res = await fetch('/notify.json', { cache: 'no-store' })
  if (!res.ok) throw new Error(`notify.json: HTTP ${res.status}`)
  const data = await res.json()
  return Array.isArray(data.announcements) ? data.announcements : []
}

const normLang = (lang) => (lang === 'de' ? 'de' : 'en')

async function enable(lang) {
  const items = await fetchLatest()
  // Only announcements posted from now on trigger a notification.
  await saveState({ enabled: true, lang: normLang(lang), seen: items.map((a) => a.number) })
}

async function disable() {
  await caches.delete(STATE_CACHE)
}

async function check(lang) {
  const state = await loadState()
  if (!state?.enabled || self.Notification?.permission !== 'granted') return
  if (lang) state.lang = normLang(lang)
  const items = await fetchLatest() // newest first
  const seen = new Set(state.seen)
  const fresh = items.filter((a) => !seen.has(a.number))
  const t = TEXT[state.lang] ?? TEXT.en
  // At most a few at once (e.g. after a long time offline), oldest first.
  for (const a of fresh.slice(0, MAX_AT_ONCE).reverse()) {
    await self.registration.showNotification(a.title, {
      body: t.body,
      icon: '/icon-192.png',
      tag: `announcement-${a.number}`,
      data: { url: `${t.prefix}/announcements/${a.number}.html` },
    })
  }
  const allSeen = [...new Set([...items.map((a) => a.number), ...state.seen])].slice(0, 200)
  await saveState({ ...state, seen: allSeen })
}

self.addEventListener('periodicsync', (event) => {
  if (event.tag === SYNC_TAG) event.waitUntil(check())
})

self.addEventListener('message', (event) => {
  const msg = event.data || {}
  const job = msg.type === 'enable' ? enable(msg.lang)
    : msg.type === 'disable' ? disable()
    : msg.type === 'check' ? check(msg.lang)
    : null
  if (!job) return
  const reply = (data) => event.ports[0]?.postMessage(data)
  event.waitUntil(job.then(
    () => reply({ ok: true }),
    (err) => reply({ ok: false, error: String(err?.message || err) }),
  ))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = new URL(event.notification.data?.url || '/announcements/', self.location.origin).href
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    const existing = windows.find((c) => c.url === url)
    if (existing) return existing.focus()
    return self.clients.openWindow(url)
  })())
})
