import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoriesComponent } from './categories.component';
import {MaterialModule} from '../../../material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import { AddNewCategoryComponent } from './add-new-category/add-new-category.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {NgxSpinnerModule} from 'ngx-spinner';


@NgModule({
  declarations: [
    CategoriesComponent,
    AddNewCategoryComponent
  ],
    imports: [
        CommonModule,
        CategoriesRoutingModule,
        MaterialModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        MatProgressSpinnerModule,
        FormsModule,
        NgxSpinnerModule
    ]
})
export class CategoriesModule { }
