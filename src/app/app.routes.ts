import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tasks',
    loadComponent: () => import('./features/task/presentation/components/task-list/task-list.component').then(m => m.TaskListComponent)
  },
  {
    path: 'categories',
    loadComponent: () => import('./features/task/presentation/components/category-list/category-list.component').then(m => m.CategoryListComponent)
  },
  {
    path: '',
    redirectTo: 'tasks',
    pathMatch: 'full'
  }
];
