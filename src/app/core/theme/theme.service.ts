import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_DARK_KEY = 'themeDark';

  initializeTheme() {
    // const prefersDarkS = window.matchMedia('(prefers-color-scheme: dark)');
    // prefersDarkS.addEventListener('change',(e) => this.setAppTheme(e.matches ? 'dark' : 'light'));

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = localStorage.getItem(this.THEME_DARK_KEY) || (prefersDark ? 'dark' : 'light');
    this.setAppTheme(theme);
  }

  toggleTheme(event: any) {
    const theme = event.detail.checked ? 'dark' : 'light';
    this.setAppTheme(theme);
  }

  setAppTheme(theme: string) {
    document.body.classList.toggle('dark-theme', theme === 'dark');
    localStorage.setItem(this.THEME_DARK_KEY, theme);
  }

  isDarkMode() {
    return document.body.classList.contains('dark-theme');
  }
}

