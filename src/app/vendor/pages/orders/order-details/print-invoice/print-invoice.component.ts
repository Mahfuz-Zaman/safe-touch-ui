import { Component, Input, OnInit } from '@angular/core';
import { Order } from 'src/app/interfaces/order';
import { ShopInfo } from 'src/app/interfaces/shop-info';
import { ShopService } from 'src/app/services/shop.service';

@Component({
  selector: 'app-print-invoice',
  templateUrl: './print-invoice.component.html',
  styleUrls: ['./print-invoice.component.scss']
})
export class PrintInvoiceComponent implements OnInit {

  @Input() order: Order = null;
  contactInfoData: ShopInfo;

  constructor(
    private shopService: ShopService
  ) { }

  ngOnInit(): void {
    this.getContactInfo();
  }

  private getContactInfo() {
    this.shopService.getShopInfo()
      .subscribe(res => {
        this.contactInfoData = res.data;
      }, error => {
        console.log(error);
      });
  }

}
