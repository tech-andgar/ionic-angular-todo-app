import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
/**
 * Abstract class that provides an API for managing `category` items.
 */
export abstract class CategoriesApi {

  // ========= Category Retrieval Methods =========

  /**
   * Provides an Observable of all categories.
   *
   * @returns {Observable<Category[]>} - A stream of all categories.
   */
  abstract getCategories(): Observable<Category[]>;

  /**
   * Retrieves a category by its ID.
   *
   * @param {string} categoryId - The ID of the category to retrieve.
   * @returns {Observable<Category>} - A stream of the requested category.
   */
  abstract getCategory(categoryId: string): Observable<Category>;

  // ========= Category Modification Methods =========

  /**
   * Saves a category. If a category with the same ID already exists, it will be replaced.
   *
   * @param {Category} category - The category to save.
   * @returns {Promise<void>} - Resolves when the category is saved.
   */
  abstract saveCategory(category: Category): Promise<void>;

  /**
   * Saves a category at a specified index. If a category with the same ID already exists, it will be replaced.
   *
   * @param {Category} category - The category to save.
   * @param {number | null} index - The position to save the category at, or null to append it.
   * @returns {Promise<void>} - Resolves when the category is saved at the specified position.
   */
  abstract saveCategoryAt(category: Category, index: number | null): Promise<void>;

  // ========= Category Deletion Methods =========

  /**
   * Deletes the category with the given ID.
   *
   * @param {string} id - The ID of the category to delete.
   * @returns {Promise<void>} - Resolves when the category is deleted.
   * @throws {CategoryNotFoundException} - If no category with the given ID exists.
   */
  abstract deleteCategory(id: string): Promise<void>;

  // ========= Resource Management Methods =========

  /**
   * Closes the API client and frees up any resources.
   *
   * @returns {Promise<void>} - Resolves when the client is closed.
   */
  abstract close(): Promise<void>;
}
