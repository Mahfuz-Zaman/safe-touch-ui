import { Component, OnInit } from '@angular/core';
import {ONLINE_VENDOR_LIST} from '../../core/utils/vendor-list-dummy';
import {Router} from '@angular/router';
import { VendorDataService } from 'src/app/services/vendor-data.service';

@Component({
  selector: 'app-online-shop-list',
  templateUrl: './online-shop-list.component.html',
  styleUrls: ['./online-shop-list.component.scss']
})
export class OnlineShopListComponent implements OnInit {

  onlineVendorList: any[] = [];

  // Pagination
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 20;

  constructor(
    private router: Router,
    private vendorDataService: VendorDataService
  ) { }

  ngOnInit(): void {
    // DUMMY
    // this.onlineVendorList = ONLINE_VENDOR_LIST;
    this.getVendorsByFilter({vendorType: 1});
  }

  getVendorsByFilter(query: any) {
    this.vendorDataService.getVendorsByFilter(query)
    .subscribe( res => {
      this.onlineVendorList = res.data;
      console.log("vendor product",this.onlineVendorList);
      
    }, err => {
      console.log(err);
    });
  }


  /**
   * NGX PAGINATION CHANGED
   */

  public onChangePage(event: number) {
    this.router.navigate([], {queryParams: {page: event}});
  }


}
