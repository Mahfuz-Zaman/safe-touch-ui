import { Component, OnInit } from '@angular/core';
import { StoreInfo } from 'src/app/interfaces/store-info';
import { StoreInfoService } from 'src/app/services/store-info.service';

@Component({
  selector: 'app-store-locator',
  templateUrl: './store-locator.component.html',
  styleUrls: ['./store-locator.component.scss']
})
export class StoreLocatorComponent implements OnInit {

  stores: StoreInfo[] = [];

  constructor(
    private storeInfoService: StoreInfoService
  ) { }

  ngOnInit(): void {
    this.getAllStoresInfo();
  }

  getAllStoresInfo() {
    this.storeInfoService.getAllStoresInfo()
    .subscribe(res => {
      this.stores = res.data;
    }, err => {
      console.log(err);
    });
  }

}
