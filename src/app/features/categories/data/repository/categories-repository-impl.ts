import { CategoriesApi } from '../../domain/infrastructure/categories_api';
import { CategoriesRepository } from '../../domain/repository/categories_repository';
import { Category } from 'src/app/core/domain/model/category.model';
import { Injectable, signal } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';
import { ToastController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

export const enum CategoriesViewFilter { all, activeOnly, inactiveOnly }

/**
 * A repository that handles `category` related requests.
 */
@Injectable({
  providedIn: 'root'
})
export class CategoriesRepositoryImpl implements CategoriesRepository {
  categoriesSignal = signal<Category[]>([]);
  filterSignal = signal<CategoriesViewFilter>(CategoriesViewFilter.all);
  lastDeletedCategorySignal = signal<Category | null>(null);
  lastDeletedCategoryIndexSignal = signal<number | null>(null);

  categories = this.categoriesSignal.asReadonly();
  lastDeletedCategory = this.lastDeletedCategorySignal.asReadonly();

  constructor(
    private categoriesApi: CategoriesApi,
    private alertController: AlertController,
    private toastController: ToastController,
    private translateService: TranslateService
  ) {}

  async loadCategories() {
    this.getCategories().subscribe(categories => {
      this.categoriesSignal.set(categories);
    });
  }

  /**
   * Provides an Observable of all categories.
   */
  getCategories(): Observable<Category[]> {
    return this.categoriesApi.getCategories();
  }

  getCategoryById(categoryId: string): Observable<Category> {
    return this.categoriesApi.getCategory(categoryId);
  }

  /**
   * Saves a category.
   *
   * If a category with the same id already exists, it will be replaced.
   */
  saveCategory(category: Category): Promise<void> {
    return this.categoriesApi.saveCategory(category);
  }

  /**
   * Saves a category with the position index
   *
   * If a category with the same id already exists, it will be replaced.
   */
  saveCategoryAt(category: Category, index: number | null = null): Promise<void> {
    return this.categoriesApi.saveCategoryAt(category, index);
  }

  /**
   * Deletes the category with the given id.
   *
   * If no category with the given id exists, a CategoryNotFoundException is thrown.
   */
  async deleteCategory(category: Category): Promise<boolean> {
    if (await this.confirmDelete(category)) {
      const categories = this.categories();
      const index = categories.findIndex(t => t.id === category.id);

      if (index !== -1) {
        this.lastDeletedCategorySignal.set(category);
        this.lastDeletedCategoryIndexSignal.set(index);
        await this.categoriesApi.deleteCategory(category.id!);
        this.removeCategoryFromList(category);
        this.showUndoToast(category);
      }
      return true;
    } else {
      return false;
    }
  }

  private removeCategoryFromList(categoryToRemove: Category) {
    this.categoriesSignal.update(categories =>
      categories.filter(category => category.id !== categoryToRemove.id)
    );
  }

  private async confirmDelete(category: Category): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alertController.create({
        header: await lastValueFrom(this.translateService.get('COMMON.DELETE_CONFIRM_HEADER')),
        message: await lastValueFrom(this.translateService.get('CATEGORIES.DELETE_CONFIRM_MESSAGE', { name: category.name })),
        buttons: [
          {
            text: await lastValueFrom(this.translateService.get('COMMON.CANCEL')),
            role: 'cancel',
            handler: () => {
              resolve(false);
            }
          },
          {
            text: await lastValueFrom(this.translateService.get('COMMON.DELETE')),
            role: 'destructive',
            handler: async () => {
              resolve(true);
            }
          }
        ]
      });
      alert.present();
    });
  }

  private async showUndoToast(deletedCategory: Category) {
    const toast = await this.toastController.create({
      message: await lastValueFrom(this.translateService.get('CATEGORIES.CATEGORY_DELETED_MESSAGE', { name: deletedCategory.name })), // TODO UPDATED LABEL i18n
      duration: 4000,
      position: 'bottom',
      buttons: [
        {
          side: 'end',
          text: await lastValueFrom(this.translateService.get('COMMON.UNDO')),
          handler: () => {
            this.undoDeleteCategory();
          }
        }
      ]
    });
    await toast.present();
  }

  private async undoDeleteCategory() {
    const category = this.lastDeletedCategory();
    const index = this.lastDeletedCategoryIndexSignal();

    if (category && index !== null) {
      await this.saveCategoryAt(category, index);
      this.lastDeletedCategorySignal.set(null);
      this.lastDeletedCategoryIndexSignal.set(null);
      this.addCategoryToListAt(category, index);
    }
  }

  private addCategoryToListAt(categoryToAdd: Category, index: number) {
    this.categoriesSignal.update(categories => {
      if (!categories.some(t => t.id === categoryToAdd.id)) {
        const newCategories = [...categories];
        newCategories.splice(index, 0, categoryToAdd);
        return newCategories;
      }
      return categories;
    });
  }

  setFilter(filter: CategoriesViewFilter) {
    this.filterSignal.set(filter);
  }

  async toggleCategoryCompletion(category: Category, active: boolean) {
    const newCategory = category.copyWith({ active });
    await this.saveCategory(newCategory);
    this.updateCategoryInList(newCategory);
  }

  private updateCategoryInList(updatedCategory: Category) {
    this.categoriesSignal.update(categories =>
      categories.map(category => category.id === updatedCategory.id ? updatedCategory : category)
    );
  }
}
