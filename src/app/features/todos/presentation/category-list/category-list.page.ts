import { addIcons } from 'ionicons';
import { AlertController } from '@ionic/angular';
import { Category } from '../../domain/models/category.model';
import { CategoryListService } from './category-list.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { createOutline, trashOutline } from 'ionicons/icons';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { SettingsDropdownComponent } from 'src/app/core/settings/settings-dropdown.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-category-list',
  template: `
  <ion-header>
      <ion-toolbar>
        <ion-title>{{ 'CATEGORIES.TITLE' | translate }}</ion-title>
        <app-settings-dropdown slot="end"></app-settings-dropdown>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-list>
        <ion-item>
          <ion-input [(ngModel)]="newCategoryName" placeholder="{{ 'CATEGORIES.PLACEHOLDER' | translate }}"></ion-input>
          <ion-button (click)="addCategory()" [attr.aria-label]=" 'COMMON.ADD' | translate">
            <ion-icon name="add"></ion-icon>
          </ion-button>
        </ion-item>
        <!-- *ngFor="let category of categories$ | async" -->
        <ion-item
           *ngFor="let category of categoryListService.filteredCategories()"
        >
          <ion-label>{{ category.name }}</ion-label>
          <ion-button (click)="editCategory(category)" [attr.aria-label]="'COMMON.EDIT' | translate ">
            <ion-icon name="create-outline"></ion-icon>
          </ion-button>
          <ion-button color="danger" (click)="onDelete(category)"  [attr.aria-label]="'COMMON.DELETE' | translate ">
            <ion-icon name="trash-outline"></ion-icon>
          </ion-button>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, SettingsDropdownComponent, TranslateModule],
})
export class CategoryListPage implements OnInit {
  newCategoryName = '';

  constructor(
    public categoryListService: CategoryListService,
    private alertController: AlertController,
    private translateService: TranslateService
  ) {
    addIcons({ createOutline, trashOutline });
  }

  ngOnInit() {
    this.categoryListService.loadCategories();
  }

  addCategory() {
    let name: string = this.newCategoryName.trim();
    if (name) {
      this.categoryListService.submit(name);
      this.newCategoryName = '';
    }
  }

  async editCategory(category: Category) {
    const alert = await this.alertController.create({
      header: await lastValueFrom(this.translateService.get('CATEGORIES.EDIT_TITLE')),
      inputs: [
        { placeholder: 'Name' },
      ],
      buttons: [
        {
          text: await lastValueFrom(this.translateService.get('COMMON.CANCEL')),
          role: 'cancel',
          handler: () => { }
        },
        {
          text: await lastValueFrom(this.translateService.get('COMMON.UPDATE')),
          role: 'destructive',
          handler: async (value) => {
            await this.categoryListService.update(value[0], category);
          }
        }
      ]
    });
    alert.present();
  }

  async onDelete(category: Category) {
    await this.categoryListService.deleteCategory(category);
  }
}
