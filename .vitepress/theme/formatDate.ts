// Fixed time zone so server-rendered and hydrated output match.
// One formatter per locale (en-US, de-DE, ...), created on first use.
const formatters: Record<string, Intl.DateTimeFormat> = {}

export const formatDate = (iso: string, lang = 'en-US') =>
    (formatters[lang] ??= new Intl.DateTimeFormat(lang, { dateStyle: 'long', timeZone: 'UTC' }))
        .format(new Date(iso))
