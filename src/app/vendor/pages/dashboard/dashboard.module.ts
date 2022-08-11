import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardComponent} from './dashboard.component';
import {RouterModule, Routes} from '@angular/router';
import {MaterialModule} from '../../../material/material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {BarChartModule, LineChartModule} from '@swimlane/ngx-charts';
import {TilesComponent} from './tiles/tiles.component';
import {InfoCardsComponent} from './info-cards/info-cards.component';


const routes: Routes = [
  {path: '', component: DashboardComponent}
];


@NgModule({
  declarations: [
    DashboardComponent,
    TilesComponent,
    InfoCardsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FlexLayoutModule,
    LineChartModule,
    BarChartModule
  ]
})
export class DashboardModule {
}
