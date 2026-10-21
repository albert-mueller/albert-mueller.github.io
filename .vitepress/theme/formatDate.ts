// Fixed time zone so server-rendered and hydrated output match. The locale
// follows the page language (see i18n.ts), defaulting to English.
const formatters = new Map<string, Intl.DateTimeFormat>()

export const formatDate = (iso: string, locale = 'en-US') => {
    let formatter = formatters.get(locale)
    if (!formatter) {
        formatter = new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' })
        formatters.set(locale, formatter)
    }
    return formatter.format(new Date(iso))
}
