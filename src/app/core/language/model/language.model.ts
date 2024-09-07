export enum Language {
  English = 'en',
  Spanish = 'es',
  // Add more languages as needed
}

export interface LanguageOption {
  code: Language;
  name: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: Language.English, name: 'English' },
  { code: Language.Spanish, name: 'Español' },
  // Add more language options as needed
];
