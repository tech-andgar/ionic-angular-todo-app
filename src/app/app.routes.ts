import { Routes } from '@angular/router';
import { HomePage } from './features/home/presentation/home.page';

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
        path: 'categories',
        loadComponent: () => import('./features/categories/presentation/category-list/category-list.page').then(m => m.CategoryListPage)
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
  {
    path: 'edit-todo/:id',
    loadComponent: () => import('./features/todos/presentation/edit-todo/edit-todo.page').then(m => m.EditTodoPage)
  },
];
