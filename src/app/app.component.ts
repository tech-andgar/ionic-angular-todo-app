import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet, IonTabs, IonTabBar, IonIcon, IonLabel, IonHeader,IonToolbar,IonTitle,IonContent } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { listOutline, folderOutline } from 'ionicons/icons';
import { RouterLinkActive } from '@angular/router';
import { TodosRepository } from './features/todos/todos_repository/todos_repository';
import { ThemeService } from './core/theme/theme.service';
import { LanguageService } from './core/language/language.service';
import { SettingsDropdownComponent } from "./core/settings/settings-dropdown.component";
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
    private todosRepository: TodosRepository,
    private themeService: ThemeService,
    private languageService: LanguageService
  ) {
    addIcons({ listOutline, folderOutline });
  }

  async ngOnInit() {
    this.themeService.initializeTheme();

    // Initialize language
    this.languageService.init();
  }
}
