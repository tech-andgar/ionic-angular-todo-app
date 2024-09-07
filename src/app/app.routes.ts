import { Routes } from '@angular/router';
import { HomePage } from './features/todos/ui/home/home.page';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'todos',
        loadComponent: () => import('./features/todos/ui/todos/todos-overview.page').then(m => m.TodosOverviewPage)
      },
      {
        path: 'stats',
        loadComponent: () => import('./features/todos/ui/stats/stats.page').then(m => m.StatsPage)
      },
      {
        path: 'categories',
        loadComponent: () => import('./features/task/presentation/components/category-list/category-list.component').then(m => m.CategoryListComponent)
      },
      {
        path: '',
        redirectTo: 'todos',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'add-todo',
    loadComponent: () => import('./features/todos/ui/todos/add-todo.page').then(m => m.AddTodoPage)
  }
];
