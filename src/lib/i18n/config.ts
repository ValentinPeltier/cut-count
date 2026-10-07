export enum Locale {
  FR = 'fr',
  EN = 'en',
}

export type LocaleType = `${Locale}`
export const defaultLocale: LocaleType = Locale.FR
export const availableLocales: LocaleType[] = [Locale.FR, Locale.EN]

export const isLocale = (value: string): value is LocaleType => (availableLocales as string[]).includes(value)
