import {Component, OnInit} from '@angular/core';
import {Order, OrderItem} from '../../../../interfaces/order';
import {OrderStatus} from '../../../../enum/order-status';
import {ActivatedRoute, Router} from '@angular/router';
import {OrderService} from '../../../../services/order.service';
import {UiService} from '../../../../services/ui.service';
import { VendorDataService } from 'src/app/services/vendor-data.service';
import { Vendor } from 'src/app/interfaces/vendor';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {

  orderId: string = null;
  order: Order = null;

  vendorId: string = null;
  vendor: Vendor = null;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private vendorDataService: VendorDataService
  ) {
  }

  ngOnInit(): void {
    this.getLoginVendorInfo();
    this.route.paramMap.subscribe(param => {
      this.orderId = param.get('id');
      this.getOrderDetails();
    });
  }

  updatedAmount() {
    let refundAmount = 0;
    this.order.orderedItems.map( item => {
      if (!item.product && item.deleteDeliveryStatus === "not-shipped-or-delivered") {
        refundAmount += item.price * item.quantity;
      }
    });
    this.order.refundAmount = refundAmount;
  }

  /**
   * HTTP REQ HANDLE
   */

  private getOrderDetails() {
    this.orderService.getOrderDetails(this.orderId)
      .subscribe(res => {
        this.order = res.data;
        this.updatedAmount();
        console.log(this.order);
      }, error => {
        console.log(error);
      });
  }

  private getLoginVendorInfo() {
    this.vendorDataService.getLoginVendorInfo()
      .subscribe(res => {
        this.vendor = res.data;
        this.vendorId = this.vendor._id
        console.log(this.order);
      }, error => {
        console.log(error);
      });
  }

  vendorAmount(items: OrderItem[]): number {
    let amount = 0;
    items.map( item => {
      if (item.commission) {
        amount = amount + (item.price * ((100 - item.commission) / 100) );
      }
    });
    return amount;
  }

}
