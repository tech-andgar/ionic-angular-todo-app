import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage-angular';
import { Language, LanguageOption, SUPPORTED_LANGUAGES } from './model/language.model';

// if browser lang not supported
const defaultLanguage = Language.English;

// A service to manage the user's preferred language
@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly kStorageKey = '__preferred_language_key__';
  private _storage: Storage | null = null;

  constructor(
    private translate: TranslateService,
    private storage: Storage
  ) {
    this.initializeLanguage();
  }

  async initializeLanguage() {
    await this.setInitialLanguage();
  }

  private async setInitialLanguage() {
    this._storage = await this.storage.create();
    const preferredLanguage = await this.getPreferredLanguage();
    this.setLanguage(preferredLanguage);
  }

  async getPreferredLanguage(): Promise<Language> {
    if (!this._storage) {
      await this.initializeLanguage();
    }
    const storedLang = await this._storage?.get(this.kStorageKey) as Language | null;
    if (storedLang && this.isLanguageSupported(storedLang)) {
      return storedLang;
    }

    // If no stored preference or stored language is not supported, use the browser's language
    const browserLang = this.translate.getBrowserLang() as Language;
    return this.isLanguageSupported(browserLang) ? browserLang : Language.English;
  }

  async setLanguage(lang: Language) {
    if (this.isLanguageSupported(lang)) {
      await this._storage?.set(this.kStorageKey, lang);
      this.translate.use(lang);
    } else {
      console.warn(`Language ${lang} is not supported. Falling back to English.`);
      await this._storage?.set(this.kStorageKey, defaultLanguage);
      this.translate.use(defaultLanguage);
    }
  }

  getCurrentLanguage(): Language {
    return this.translate.currentLang as Language;
  }

  getSupportedLanguages(): LanguageOption[] {
    return SUPPORTED_LANGUAGES;
  }

  private isLanguageSupported(lang: string): lang is Language {
    return SUPPORTED_LANGUAGES.some(l => l.code === lang);
  }

  async switchToEnglish() {
    await this.setLanguage(Language.English);
  }

  async switchToSpanish() {
    await this.setLanguage(Language.Spanish);
  }
}
