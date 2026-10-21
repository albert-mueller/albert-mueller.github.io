// Fixed locales and time zone so server-rendered and hydrated output match.
const formatters: Record<string, Intl.DateTimeFormat> = {
    'en-US': new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' }),
    'de-DE': new Intl.DateTimeFormat('de-DE', { dateStyle: 'long', timeZone: 'UTC' }),
}

export const formatDate = (iso: string, lang = 'en-US') =>
    (formatters[lang] ?? formatters['en-US']).format(new Date(iso))
