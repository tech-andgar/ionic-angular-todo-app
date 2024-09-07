
import { Injectable, signal, computed } from '@angular/core';
import { Todo } from '../../todosAPI/models/todo';
import { TodosRepository } from '../../todos_repository/todos_repository';

export enum StatsStatus { initial, loading, success, failure }

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private statusSignal = signal<StatsStatus>(StatsStatus.initial);
  private todosSignal = signal<Todo[]>([]);

  status = this.statusSignal.asReadonly();
  todos = this.todosSignal.asReadonly();

  completedTodos = computed(() => this.todos().filter(todo => todo.isCompleted).length);
  activeTodos = computed(() => this.todos().filter(todo => !todo.isCompleted).length);

  constructor(private todosRepository: TodosRepository) { }

  async loadStats() {
    this.statusSignal.set(StatsStatus.loading);
    try {
      this.todosRepository.getTodos().subscribe(todos => {
        this.todosSignal.set(todos);
        this.statusSignal.set(StatsStatus.success);
      });
    } catch (error) {
      this.statusSignal.set(StatsStatus.failure);
    }
  }
}
