import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from '../models/todo.model';

/**
 * A repository that handles `todo` related operations, such as
 * retrieval, saving, updating, and deleting todos.
 */
@Injectable({
  providedIn: 'root'
})
export abstract class TodosRepository {

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
  abstract getTodoById(todoId: string): Observable<Todo>;

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

  /**
   * Toggles the completion state of a todo.
   *
   * @param {Todo} todo - The todo to toggle.
   * @param {boolean} isCompleted - Whether the todo is marked as completed.
   * @returns {Promise<void>} - Resolves when the todo completion state is updated.
   */
  abstract toggleTodoCompletion(todo: Todo, isCompleted: boolean): Promise<void>;

  // ========= Todo Deletion Methods =========

  /**
   * Deletes the specified todo.
   *
   * @param {Todo} todo - The todo to delete.
   * @returns {Promise<boolean>} - Resolves with true if deletion is successful, otherwise throws an error.
   * @throws {TodoNotFoundException} - If no todo with the given ID exists.
   */
  abstract deleteTodo(todo: Todo): Promise<boolean>;

  // ========= Batch Operations Methods =========

  /**
   * Deletes all completed todos.
   *
   * @returns {Promise<number>} - Resolves with the number of deleted todos.
   */
  abstract clearCompleted(): Promise<number>;

  /**
   * Marks all todos as completed or not completed.
   *
   * @param {boolean} isCompleted - The completion state to apply to all todos.
   * @returns {Promise<number>} - Resolves with the number of updated todos.
   */
  abstract completeAll(isCompleted: boolean): Promise<number>;

  /**
   * Toggles the completion state of all todos.
   *
   * @returns {Promise<void>} - Resolves when the completion state of all todos is toggled.
   */
  abstract toggleAll(): Promise<void>;
}
