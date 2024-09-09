import { addIcons } from 'ionicons';
import { Component, OnInit } from '@angular/core';
import { folderOutline, listOutline } from 'ionicons/icons';
import { IonApp, IonRouterOutlet, IonTabs, IonTabBar, IonIcon, IonLabel, IonHeader,IonToolbar,IonTitle,IonContent } from '@ionic/angular/standalone';
import { LanguageService } from './core/language/language.service';
import { RouterLinkActive } from '@angular/router';
import { SettingsDropdownComponent } from "./core/settings/settings-dropdown.component";
import { ThemeService } from './core/theme/theme.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonApp,
    IonRouterOutlet,
    IonTabs,
    IonTabBar,
    IonIcon,
    IonLabel,
    RouterLinkActive,
    SettingsDropdownComponent,
    TranslateModule
],
})
export class AppComponent implements OnInit {
  constructor(
    private themeService: ThemeService,
    private languageService: LanguageService
  ) {
    addIcons({ listOutline, folderOutline });
  }

  async ngOnInit() {
    this.themeService.initializeTheme();
    this.languageService.initializeLanguage();
  }
}
