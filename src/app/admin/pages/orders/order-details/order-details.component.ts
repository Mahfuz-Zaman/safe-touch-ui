import {Component, OnInit} from '@angular/core';
import {Order} from '../../../../interfaces/order';
import {ActivatedRoute} from '@angular/router';
import {OrderService} from '../../../../services/order.service';
import {Vendor} from 'src/app/interfaces/vendor';
import {VendorDataService} from 'src/app/services/vendor-data.service';

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
    this.route.paramMap.subscribe(param => {
      this.orderId = param.get('id');
      this.vendorId = param.get('vendorId');
      this.getOrderDetails();
      if (this.vendorId) {
        this.getSingleVendorById();
      }
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

  private getSingleVendorById() {
    this.vendorDataService.getSingleVendorById(this.vendorId)
      .subscribe(res => {
        this.vendor = res.data;
        console.log(this.order);
      }, error => {
        console.log(error);
      });
  }

}
