import { Injectable, computed, signal } from '@angular/core';
import { Todo } from '../../todosAPI/models/todo';
import { TodosRepository, TodosViewFilter } from '../../todos_repository/todos_repository';

export enum TodosOverviewStatus { initial, loading, success, failure }

@Injectable({ providedIn: 'root' })
export class TodosOverviewService {
  private statusSignal = signal<TodosOverviewStatus>(TodosOverviewStatus.initial);
  status = this.statusSignal.asReadonly();

  todos = this.todosRepository.todosSignal.asReadonly();
  filter = this.todosRepository.filterSignal.asReadonly();

  filteredTodos = computed(() => {
    return this.todosRepository.todos().filter(todo => {
      switch (this.filter()) {
        case TodosViewFilter.all: return true;
        case TodosViewFilter.activeOnly: return !todo.isCompleted;
        case TodosViewFilter.completedOnly: return todo.isCompleted;
      }
    });
  });

  constructor(private todosRepository: TodosRepository) { }

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
