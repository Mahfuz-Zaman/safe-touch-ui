import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreLocatorRoutingModule } from './store-locator-routing.module';
import { StoreLocatorComponent } from './store-locator.component';
import { DealerSectionOneComponent } from './dealer-section-one/dealer-section-one.component';
import { DealerSectionTwoComponent } from './dealer-section-two/dealer-section-two.component';


@NgModule({
  declarations: [
    StoreLocatorComponent,
    DealerSectionOneComponent,
    DealerSectionTwoComponent
  ],
  imports: [
    CommonModule,
    StoreLocatorRoutingModule
  ]
})
export class StoreLocatorModule { }
