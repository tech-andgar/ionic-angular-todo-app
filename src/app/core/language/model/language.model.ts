export const enum Language {
  English = 'en',
  Spanish = 'es',
}

export interface LanguageOption {
  code: Language;
  name: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: Language.English, name: 'English' },
  { code: Language.Spanish, name: 'Español' },
];
