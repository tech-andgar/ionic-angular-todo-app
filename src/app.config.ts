import { ApplicationConfig, ErrorHandler, importProvidersFrom } from '@angular/core';
import { CategoriesApi } from './app/features/categories/domain/infrastructure/categories_api';
import { CategoriesRepository } from './app/features/categories/domain/repository/categories_repository';
import { CategoriesRepositoryImpl } from './app/features/categories/data/repository/categories-repository-impl';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { IonicStorageModule } from '@ionic/storage-angular';
import { LocalStorageCategoriesApi } from './app/features/categories/data/infrastructure/local-storage-api/local.storage.categories.api';
import { LocalStorageTodosApi } from './app/features/todos/data/infrastructure/local_storage/local.storage.todos.api';
import { Observable } from 'rxjs';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { routes } from './app/app.routes';
import { TodosApi } from './app/core/domain/api/todos_api';
import { TodosRepository } from './app/features/todos/domain/repository/todos_repository';
import { TodosRepositoryImpl } from './app/features/todos/data/repository/todos-repository-impl';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

export class LazyTranslateLoader implements TranslateLoader {
  constructor(private http: HttpClient) {}

  getTranslation(lang: string): Observable<any> {
    return this.http.get(`/assets/i18n/${lang}.json`);
  }
}

export function HttpLoaderFactory(http: HttpClient) {
  return new LazyTranslateLoader(http);
}

class AppErrorHandler implements ErrorHandler {
  handleError(error: any) {
    console.error('An error occurred:', error);
    // You could add more sophisticated error handling here
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withPreloading(PreloadAllModules)),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideHttpClient(),
    importProvidersFrom(IonicStorageModule.forRoot()),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        },
        defaultLanguage: 'en',
      })
    ),
    { provide: ErrorHandler, useClass: AppErrorHandler },
    { provide: TodosApi, useClass: LocalStorageTodosApi },
    { provide: CategoriesApi, useClass: LocalStorageCategoriesApi },
    { provide: TodosRepository, useClass: TodosRepositoryImpl },
    { provide: CategoriesRepository, useClass: CategoriesRepositoryImpl },
    // Storage,
  ]
};

