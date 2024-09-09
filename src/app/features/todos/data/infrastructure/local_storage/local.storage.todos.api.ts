import { Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom, map, Observable, of } from 'rxjs';
import { TodosApi } from '../../../domain/infrastructure/todos_api';
import { Todo } from '../../../../../core/domain/model/todo.model';
import { TodoNotFoundException } from 'src/app/core/domain/exceptions/exceptions';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageTodosApi implements TodosApi {
  private static readonly kTodosCollectionKey = '__todos_collection_key__';
  private todoStreamController: BehaviorSubject<Todo[]>;

  constructor() {
    this.todoStreamController = new BehaviorSubject<Todo[]>([]);
    this.init();
  }

  private init(): void {
    const todosJson = localStorage.getItem(LocalStorageTodosApi.kTodosCollectionKey);
    if (todosJson) {
      const todos: Todo[] = JSON.parse(todosJson).map((jsonMap: any) =>
        new Todo(
          jsonMap.title,
          {
            id: jsonMap.id,
            description: jsonMap.description,
            isCompleted: jsonMap.isCompleted,
            category: jsonMap.category
          }
        )
      );
      this.todoStreamController.next(todos);
    } else {
      this.todoStreamController.next([]);
    }
  }

  getTodos(): Observable<Todo[]> {
    return this.todoStreamController.asObservable();
  }

  getTodo(todoId: string): Observable<Todo> {
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

   saveTodo(todo: Todo): Observable<boolean> {
    const todos = [...this.todoStreamController.value];
    const todoIndex = todos.findIndex(t => t.id === todo.id);
    if (todoIndex >= 0) {
      todos[todoIndex] = todo;
    } else {
      todos.push(todo);
    }

    this.todoStreamController.next(todos);
    localStorage.setItem(LocalStorageTodosApi.kTodosCollectionKey, JSON.stringify(todos));

    return this.getTodo(todo.id).pipe(map(todo => todo ? true : false));
  }

   saveTodoAt(todo: Todo, index: number | null = null): Observable<boolean> {
    const todos = [...this.todoStreamController.value];
    const todoIndex = todos.findIndex(t => t.id === todo.id);

    if (todoIndex >= 0) {
      todos[todoIndex] = todo;  // Update existing todo
    } else if (index !== null) {
      todos.splice(index, 0, todo);  // Insert at the original index
    } else {
      todos.push(todo);  // Add new todo at the end (for new todos)
    }

    this.todoStreamController.next(todos);
    localStorage.setItem(LocalStorageTodosApi.kTodosCollectionKey, JSON.stringify(todos));
    return this.getTodo(todo.id).pipe(map(todo => todo ? true : false));
  }

   deleteTodo(id: string): Observable<boolean> {
    const todos = [...this.todoStreamController.value];
    const todoIndex = todos.findIndex(t => t.id === id);
    if (todoIndex === -1) {
      throw new TodoNotFoundException();
    } else {
      todos.splice(todoIndex, 1);
      this.todoStreamController.next(todos);
      localStorage.setItem(LocalStorageTodosApi.kTodosCollectionKey, JSON.stringify(todos));
    }

    return this.getTodo(id).pipe(map(todo => todo ? false  : true));
  }

   clearCompleted(): Observable<number> {
    const todos = [...this.todoStreamController.value];
    const completedTodosAmount = todos.filter(t => t.isCompleted).length;
    const newTodos = todos.filter(t => !t.isCompleted);
    this.todoStreamController.next(newTodos);
    localStorage.setItem(LocalStorageTodosApi.kTodosCollectionKey, JSON.stringify(newTodos));
    return of(completedTodosAmount);
  }

   completeAll(isCompleted: boolean): Observable<number> {
    const todos = [...this.todoStreamController.value];
    const changedTodosAmount = todos.filter(t => t.isCompleted !== isCompleted).length;
    const newTodos = todos.map(todo => todo.copyWith({ isCompleted }));
    this.todoStreamController.next(newTodos);
    localStorage.setItem(LocalStorageTodosApi.kTodosCollectionKey, JSON.stringify(newTodos));
    return of(changedTodosAmount);
  }

  close(): Observable<void> {
    this.todoStreamController.complete();
    return of(undefined);
  }
}
