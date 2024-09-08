import { Todo } from "../../../../core/domain/model/todo.model";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
/**
 * Abstract class that provides an API for managing `todo` items.
 */
export abstract class TodosApi {

  // ========= Todo Retrieval Methods =========

  /**
   * Provides an Observable of all todos.
   *
   * @returns {Observable<Todo[]>} - A stream of all todos.
   */
  abstract getTodos(): Observable<Todo[]>;

  /**
   * Retrieves a todo by its ID.
   *
   * @param {string} todoId - The ID of the todo to retrieve.
   * @returns {Observable<Todo>} - A stream of the requested todo.
   */
  abstract getTodo(todoId: string): Observable<Todo>;

  // ========= Todo Modification Methods =========

  /**
   * Saves a todo. If a todo with the same ID already exists, it will be replaced.
   *
   * @param {Todo} todo - The todo to save.
   * @returns {Promise<void>} - Resolves when the todo is saved.
   */
  abstract saveTodo(todo: Todo): Promise<void>;

  /**
   * Saves a todo at a specified index. If a todo with the same ID already exists, it will be replaced.
   *
   * @param {Todo} todo - The todo to save.
   * @param {number | null} index - The position to save the todo at, or null to append it.
   * @returns {Promise<void>} - Resolves when the todo is saved at the specified position.
   */
  abstract saveTodoAt(todo: Todo, index: number | null): Promise<void>;

  // ========= Todo Deletion Methods =========

  /**
   * Deletes the todo with the given ID.
   *
   * @param {string} id - The ID of the todo to delete.
   * @returns {Promise<void>} - Resolves when the todo is deleted.
   * @throws {TodoNotFoundException} - If no todo with the given ID exists.
   */
  abstract deleteTodo(id: string): Promise<void>;

  // ========= Batch Operations Methods =========

  /**
   * Deletes all completed todos.
   *
   * @returns {Promise<number>} - Resolves with the number of deleted todos.
   */
  abstract clearCompleted(): Promise<number>;

  /**
   * Sets the `isCompleted` state of all todos to the given value.
   *
   * @param {boolean} isCompleted - The completion state to apply to all todos.
   * @returns {Promise<number>} - Resolves with the number of updated todos.
   */
  abstract completeAll(isCompleted: boolean): Promise<number>;

  // ========= Resource Management Methods =========

  /**
   * Closes the API client and frees up any resources.
   *
   * @returns {Promise<void>} - Resolves when the client is closed.
   */
  abstract close(): Promise<void>;
}
