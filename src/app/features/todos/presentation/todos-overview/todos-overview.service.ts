import { Injectable, computed, signal } from '@angular/core';
import { Todo } from '../../../../core/domain/model/todo.model';
import { TodosRepositoryImpl, TodosViewFilter } from '../../data/repository/todos-repository-impl';

export enum TodosOverviewStatus { initial, loading, success, failure }

@Injectable({ providedIn: 'root' })
export class TodosOverviewService {
  private statusSignal = signal<TodosOverviewStatus>(TodosOverviewStatus.initial);
  status = this.statusSignal.asReadonly();
  todos = this.todosRepository.todosSignal.asReadonly();
  selectedCategory = this.todosRepository.selectedCategory;
  filteredTodos = this.todosRepository.filteredTodos;

  constructor(private todosRepository: TodosRepositoryImpl) { }

  async loadTodos() {
    this.statusSignal.set(TodosOverviewStatus.loading);
    try {
      this.todosRepository.loadTodos();
      this.statusSignal.set(TodosOverviewStatus.success);
    } catch (error) {
      console.error('Failed to load todos:', error);
      this.statusSignal.set(TodosOverviewStatus.failure);
    }
  }

  async toggleTodoCompletion(todo: Todo, isCompleted: boolean) {
    await this.todosRepository.toggleTodoCompletion(todo, isCompleted);
  }

  async deleteTodo(todo: Todo) {
    this.statusSignal.set(TodosOverviewStatus.loading);
    await this.todosRepository.deleteTodo(todo);
    this.statusSignal.set(TodosOverviewStatus.success);
  }

  setFilter(filter: TodosViewFilter) {
    this.statusSignal.set(TodosOverviewStatus.loading);
    this.todosRepository.setFilter(filter);
    this.statusSignal.set(TodosOverviewStatus.success);
  }

  setSelectedCategory(categoryId: string | null) {
    this.statusSignal.set(TodosOverviewStatus.loading);
    this.todosRepository.setSelectedCategory(categoryId);
    this.statusSignal.set(TodosOverviewStatus.success);
  }

  async toggleAll() {
    this.statusSignal.set(TodosOverviewStatus.loading);
    await this.todosRepository.toggleAll();
    this.statusSignal.set(TodosOverviewStatus.success);
  }

  async clearCompleted() {
    this.statusSignal.set(TodosOverviewStatus.loading);
    await this.todosRepository.clearCompleted();
    this.statusSignal.set(TodosOverviewStatus.success);
  }
}
