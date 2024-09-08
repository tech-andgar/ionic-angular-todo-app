import { Routes } from '@angular/router';
import { HomePage } from './features/todos/presentation/home/home.page';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'todos',
        loadComponent: () => import('./features/todos/presentation/todos-overview/todos-overview.page').then(m => m.TodosOverviewPage)
      },
      {
        path: 'stats',
        loadComponent: () => import('./features/todos/presentation/stats/stats.page').then(m => m.StatsPage)
      },
      {
        path: 'categories',
        loadComponent: () => import('./features/todos/presentation/category-list/category-list.component').then(m => m.CategoryListComponent)
      },
      {
        path: 'edit-todo/:id',
        loadComponent: () => import('./features/todos/presentation/edit-todo/edit-todo.page').then(m => m.EditTodoPage)
      },
      {
        path: '',
        redirectTo: 'todos',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'edit-todo',
    loadComponent: () => import('./features/todos/presentation/edit-todo/edit-todo.page').then(m => m.EditTodoPage)
  },
];
