import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {OrderStatus} from '../../../enum/order-status';
import {Order} from '../../../interfaces/order';
import {OrderService} from '../../../services/order.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {Pagination} from '../../../interfaces/pagination';
import { Vendor } from 'src/app/interfaces/vendor';
import { VendorDataService } from 'src/app/services/vendor-data.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit, OnDestroy {

  private subAcRoute: Subscription;

  public orderEnum = OrderStatus;

  orders: any[] = [];

  transactions: Order[] = [];

  // Pagination
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 2;
  totalProductsStore = 0;

  vendorId: string = null;
  vendor: Vendor = null;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private vendorDataService: VendorDataService,
  ) {
  }

  ngOnInit(): void {
    // this.subAcRoute = this.activatedRoute.queryParams.subscribe(qParam => {
    //   if (qParam && qParam.page) {
    //     this.currentPage = qParam.page;
    //   } else {
    //     this.currentPage = 1;
    //   }
    //   this.getAllTransactionByAdmin();
    // });
    this.subAcRoute = this.activatedRoute.paramMap.subscribe(param => {
      this.vendorId = param.get('id');
    });

    if (!this.vendorId) {
      this.getAllTransactionByAdmin();
    } else {
      this.getAllTransactionsByVendor();
      this.getVendorById();
    }
  }

  private getAllTransactionByAdmin() {
    this.spinner.show();
    const pagination: Pagination = {
      pageSize: this.productsPerPage.toString(),
      currentPage: this.currentPage.toString()
    };

    this.orderService.getAllTransactionByAdmin(pagination)
      .subscribe(res => {
        this.orders = res.data;
        this.totalProducts = res.count;
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  private getVendorById() {
    this.vendorDataService.getSingleVendorById(this.vendorId)
    .subscribe( res => {
      this.vendor = res.data;
    }, err => {
      console.log(err);
    });
  }

  private getAllTransactionsByVendor() {
    this.spinner.show();

    const pagination: Pagination = {
      pageSize: this.productsPerPage.toString(),
      currentPage: this.currentPage.toString()
    };

    this.orderService.getAllVendorTransactionByAdmin(this.vendorId, pagination, null)
      .subscribe(res => {
        this.orders = res.data;
        if (this.orders) {
          this.updatedAmount();
        }
        this.totalProducts = res.count;
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  updatedAmount() {
    this.orders.map( order => {
      let refundAmount = 0;
      order.orderedItems.map( item => {
        if (!item.product && item.deleteDeliveryStatus === "not-shipped-or-delivered") {
          refundAmount += item.price * item.quantity;
        }
      });
      order.refundAmount = refundAmount;
    });
  }

  /**
   * PAGINATION CHANGE
   */
  public onPageChanged(event: any) {
    this.router.navigate([], {queryParams: {page: event}});
  }


  /**
   * ON DESTROY
   */
  ngOnDestroy() {
    if (this.subAcRoute) {
      this.subAcRoute.unsubscribe();
    }
  }

}
