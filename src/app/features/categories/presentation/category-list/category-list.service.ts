import { CategoriesViewFilter, CategoriesRepositoryImpl } from '../../data/repository/categories-repository-impl';
import { Category } from 'src/app/core/domain/model/category.model';
import { Injectable, signal, computed } from '@angular/core';

export const enum CategoryListStatus { initial, loading, success, failure }

@Injectable({
  providedIn: 'root'
})
export class CategoryListService {
  name = signal<string>('');

  private initialCategorySignal = signal<Category | null>(null);
  initialCategory = this.initialCategorySignal.asReadonly();
  isNewCategory = computed(() => this.initialCategorySignal() === null);

  private statusSignal = signal<CategoryListStatus>(CategoryListStatus.initial);
  status = this.statusSignal.asReadonly();

  categories = this.categoriesRepository.categoriesSignal.asReadonly();
  filter = this.categoriesRepository.filterSignal.asReadonly();

  filteredCategories = computed(() => {
    return this.categoriesRepository.categories().filter(category => {
      switch (this.filter()) {
        case CategoriesViewFilter.all: return true;
        case CategoriesViewFilter.activeOnly: return !category.active;
        case CategoriesViewFilter.inactiveOnly: return category.active;
      }
    });
  });

  constructor(private categoriesRepository: CategoriesRepositoryImpl) { }

  async loadCategories() {
    this.statusSignal.set(CategoryListStatus.loading);
    try {
      this.categoriesRepository.loadCategories();
      this.statusSignal.set(CategoryListStatus.success);
    } catch (error) {
      console.error('Failed to load categories:', error);
      this.statusSignal.set(CategoryListStatus.failure);
    }
  }

  async toggleCategoryCompletion(category: Category, isActive: boolean) {
    await this.categoriesRepository.toggleCategoryCompletion(category, isActive);
  }

  async submit(name: string) {
    this.statusSignal.set(CategoryListStatus.loading);
    try {
      await this.categoriesRepository.saveCategory(Category.create({ name: name, id: null }));
      this.statusSignal.set(CategoryListStatus.success);
    } catch (e) {
      this.statusSignal.set(CategoryListStatus.failure);
    }
  }

  async update(name: string, category: Category) {
    this.statusSignal.set(CategoryListStatus.loading);
    const updatedCategory = category.copyWith({ name: name });
    try {
      await this.categoriesRepository.saveCategory(updatedCategory);
      this.statusSignal.set(CategoryListStatus.success);
    } catch (e) {
      this.statusSignal.set(CategoryListStatus.failure);
    }
  }


  async deleteCategory(category: Category): Promise<boolean> {
    this.statusSignal.set(CategoryListStatus.loading);
    const result = await this.categoriesRepository.deleteCategory(category);
    if (result) {
      this.statusSignal.set(CategoryListStatus.success);
    } else {
      this.statusSignal.set(CategoryListStatus.initial);
    }
    return result;
  }

  setFilter(filter: CategoriesViewFilter) {
    this.statusSignal.set(CategoryListStatus.loading);
    this.categoriesRepository.setFilter(filter);
    this.statusSignal.set(CategoryListStatus.success);
  }
}
