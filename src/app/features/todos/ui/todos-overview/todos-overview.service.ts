import { Injectable, computed, signal } from '@angular/core';
import { Todo } from '../../todosAPI/models/todo';
import { TodosRepository } from '../../todos_repository/todos_repository';

export enum TodosOverviewStatus { initial, loading, success, failure }
export enum TodosViewFilter { all, activeOnly, completedOnly }

@Injectable({ providedIn: 'root' })
export class TodosOverviewService {
  constructor(private todosRepository: TodosRepository) {}

  private statusSignal = signal<TodosOverviewStatus>(TodosOverviewStatus.initial);
  private todosSignal = signal<Todo[]>([]);
  private filterSignal = signal<TodosViewFilter>(TodosViewFilter.all);
  private lastDeletedTodoSignal = signal<Todo | null>(null);

  status = this.statusSignal.asReadonly();
  todos = this.todosSignal.asReadonly();
  filter = this.filterSignal.asReadonly();
  lastDeletedTodo = this.lastDeletedTodoSignal.asReadonly();

  filteredTodos = computed(() => {
    const filter = this.filter();
    const todos = this.todos();
    return todos.filter(todo => {
      switch (filter) {
        case TodosViewFilter.all: return true;
        case TodosViewFilter.activeOnly: return !todo.isCompleted;
        case TodosViewFilter.completedOnly: return todo.isCompleted;
      }
    });
  });

  async loadTodos() {
    this.statusSignal.set(TodosOverviewStatus.loading);
    try {
      this.todosRepository.getTodos().subscribe(todos => {
        this.todosSignal.set(todos);
        this.statusSignal.set(TodosOverviewStatus.success);
      });
    } catch (error) {
      this.statusSignal.set(TodosOverviewStatus.failure);
    }
  }

  async toggleTodoCompletion(todo: Todo, isCompleted: boolean) {
    const newTodo = todo.copyWith({ isCompleted });
    await this.todosRepository.saveTodo(newTodo);
    this.updateTodoInList(newTodo);
  }

  async deleteTodo(todo: Todo) {
    this.lastDeletedTodoSignal.set(todo);
    await this.todosRepository.deleteTodo(todo.id);
    this.removeTodoFromList(todo);
  }

  async undoDeleteTodo() {
    const todo = this.lastDeletedTodo();
    if (todo) {
      await this.todosRepository.saveTodo(todo);
      this.lastDeletedTodoSignal.set(null);
      this.addTodoToList(todo);
    }
  }

  setFilter(filter: TodosViewFilter) {
    this.filterSignal.set(filter);
  }

  async toggleAll() {
    const areAllCompleted = this.todos().every(todo => todo.isCompleted);
    await this.todosRepository.completeAll(!areAllCompleted);
    await this.loadTodos();
  }

  async clearCompleted() {
    await this.todosRepository.clearCompleted();
    await this.loadTodos();
  }

  private updateTodoInList(updatedTodo: Todo) {
    this.todosSignal.update(todos =>
      todos.map(todo => todo.id === updatedTodo.id ? updatedTodo : todo)
    );
  }

  private removeTodoFromList(todoToRemove: Todo) {
    this.todosSignal.update(todos =>
      todos.filter(todo => todo.id !== todoToRemove.id)
    );
  }

  private addTodoToList(todoToAdd: Todo) {
    this.todosSignal.update(todos => [...todos, todoToAdd]);
  }
}
