// Fixed locale and time zone so server-rendered and hydrated output match.
const formatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' })

export const formatDate = (iso: string) => formatter.format(new Date(iso))
