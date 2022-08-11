import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrandsRoutingModule } from './brands-routing.module';
import { BrandsComponent } from './brands.component';
import {MaterialModule} from '../../../material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ExtendedModule, FlexModule} from '@angular/flex-layout';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {AddNewBrandComponent} from './add-new-brand/add-new-brand.component';
import {NgxSpinnerModule} from 'ngx-spinner';


@NgModule({
  declarations: [
    BrandsComponent,
    AddNewBrandComponent
  ],
    imports: [
        CommonModule,
        BrandsRoutingModule,
        MaterialModule,
        ReactiveFormsModule,
        FlexModule,
        FormsModule,
        MatProgressSpinnerModule,
        NgxSpinnerModule,
        ExtendedModule,
    ]
})
export class BrandsModule { }
