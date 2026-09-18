export enum Locale {
  FR = 'fr',
}

export type LocaleType = typeof Locale.FR
export const defaultLocale: LocaleType = Locale.FR
