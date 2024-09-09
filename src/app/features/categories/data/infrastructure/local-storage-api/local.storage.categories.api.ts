import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { CategoriesApi } from '../../../domain/infrastructure/categories_api';
import { Category } from 'src/app/core/domain/model/category.model';
import { CategoryNotFoundException } from '../../../../../core/domain/exceptions/exceptions';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageCategoriesApi implements CategoriesApi {
  private static readonly kCategoriesCollectionKey = '__categories_collection_key__';
  private categoryStreamController: BehaviorSubject<Category[]>;

  constructor() {
    this.categoryStreamController = new BehaviorSubject<Category[]>([]);
    this.init();
  }

  private init(): void {
    const categoriesJson = localStorage.getItem(LocalStorageCategoriesApi.kCategoriesCollectionKey);
    if (categoriesJson) {
      const categories: Category[] = JSON.parse(categoriesJson)
        .map((jsonMap: any) => new Category({
          name: jsonMap.name,
          id: jsonMap.id,
          active: jsonMap.active
        }));
      this.categoryStreamController.next(categories);
    } else {
      this.categoryStreamController.next([]);
    }
  }

  getCategories(): Observable<Category[]> {
    return this.categoryStreamController.asObservable();
  }

  getCategory(categoryId: string): Observable<Category> {
    return new Observable<Category>(subscriber => {
      const category = this.categoryStreamController.value.find(c => c.id === categoryId);
      if (category) {
        subscriber.next(category);
        subscriber.complete();
      } else {
        subscriber.error(new CategoryNotFoundException());
      }
    });
  }

  saveCategory(category: Category): Observable<boolean> {
    const categories = [...this.categoryStreamController.value];

    const categoryIndex = categories.findIndex(t => t.id === category.id);
    if (categoryIndex >= 0) {
      categories[categoryIndex] = category;
    } else {
      categories.push(category);
    }

    localStorage.setItem(LocalStorageCategoriesApi.kCategoriesCollectionKey, JSON.stringify(categories));
    this.categoryStreamController.next(categories);

    return this.getCategory(category.id!).pipe(map(category => category ? true: false));
  }

  saveCategoryAt(category: Category, index: number | null = null): Observable<boolean> {
    const categories = [...this.categoryStreamController.value];
    const categoryIndex = categories.findIndex(t => t.id === category.id);

    if (categoryIndex >= 0) {
      categories[categoryIndex] = category;
    } else if (index !== null) {
      categories.splice(index, 0, category);
    } else {
      categories.push(category);
    }

    this.categoryStreamController.next(categories);
    localStorage.setItem(LocalStorageCategoriesApi.kCategoriesCollectionKey, JSON.stringify(categories));
    return this.getCategory(category.id!).pipe(map(category => category ? true: false));

  }

  deleteCategory(id: string): Observable<boolean> {
    const categories = [...this.categoryStreamController.value];
    const categoryIndex = categories.findIndex(t => t.id === id);
    if (categoryIndex === -1) {
      throw new CategoryNotFoundException();
    } else {
      categories.splice(categoryIndex, 1);
      this.categoryStreamController.next(categories);
      localStorage.setItem(LocalStorageCategoriesApi.kCategoriesCollectionKey, JSON.stringify(categories));
    }
    return this.getCategory(id).pipe(map(category => category ? false  : true));
  }

  close(): Observable<void> {
    this.categoryStreamController.complete();
    return of(undefined);
  }
}
