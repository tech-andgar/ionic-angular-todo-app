import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TodoNotFoundException, TodosApi } from '../todosAPI/todos_api';
import { Todo } from '../todosAPI/models/todo';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageTodosApi extends TodosApi {
  private static readonly kTodosCollectionKey = '__todos_collection_key__';
  private todoStreamController: BehaviorSubject<Todo[]>;

  constructor() {
    super();
    this.todoStreamController = new BehaviorSubject<Todo[]>([]);
    this.init();
  }

  private init(): void {
    const todosJson = localStorage.getItem(LocalStorageTodosApi.kTodosCollectionKey);
    if (todosJson) {
      const todos: Todo[] = JSON.parse(todosJson).map((jsonMap: any) =>
        new Todo(jsonMap.title, jsonMap.id, jsonMap.description, jsonMap.isCompleted)
      );
      this.todoStreamController.next(todos);
    } else {
      this.todoStreamController.next([]);
    }
  }

  override getTodos(): Observable<Todo[]> {
    return this.todoStreamController.asObservable();
  }

  override getTodo(todoId: string): Observable<Todo> {
    return new Observable<Todo>(subscriber => {
      const todo = this.todoStreamController.value.find(t => t.id === todoId);
      if (todo) {
        subscriber.next(todo);
        subscriber.complete();
      } else {
        subscriber.error(new TodoNotFoundException());
      }
    });
  }

  override async saveTodo(todo: Todo): Promise<void> {
    const todos = [...this.todoStreamController.value];
    const todoIndex = todos.findIndex(t => t.id === todo.id);
    if (todoIndex >= 0) {
      todos[todoIndex] = todo;
    } else {
      todos.push(todo);
    }

    this.todoStreamController.next(todos);
    localStorage.setItem(LocalStorageTodosApi.kTodosCollectionKey, JSON.stringify(todos));
  }

  override async deleteTodo(id: string): Promise<void> {
    const todos = [...this.todoStreamController.value];
    const todoIndex = todos.findIndex(t => t.id === id);
    if (todoIndex === -1) {
      throw new TodoNotFoundException();
    } else {
      todos.splice(todoIndex, 1);
      this.todoStreamController.next(todos);
      localStorage.setItem(LocalStorageTodosApi.kTodosCollectionKey, JSON.stringify(todos));
    }
  }

  override async clearCompleted(): Promise<number> {
    const todos = [...this.todoStreamController.value];
    const completedTodosAmount = todos.filter(t => t.isCompleted).length;
    const newTodos = todos.filter(t => !t.isCompleted);
    this.todoStreamController.next(newTodos);
    localStorage.setItem(LocalStorageTodosApi.kTodosCollectionKey, JSON.stringify(newTodos));
    return completedTodosAmount;
  }

  override async completeAll(isCompleted: boolean): Promise<number> {
    const todos = [...this.todoStreamController.value];
    const changedTodosAmount = todos.filter(t => t.isCompleted !== isCompleted).length;
    const newTodos = todos.map(todo => todo.copyWith({ isCompleted }));
    this.todoStreamController.next(newTodos);
    localStorage.setItem(LocalStorageTodosApi.kTodosCollectionKey, JSON.stringify(newTodos));
    return changedTodosAmount;
  }

  override async close(): Promise<void> {
    this.todoStreamController.complete();
  }
}
