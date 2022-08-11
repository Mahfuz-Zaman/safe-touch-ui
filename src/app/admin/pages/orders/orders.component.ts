import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {OrderStatus} from '../../../enum/order-status';
import {MatSelect, MatSelectChange} from '@angular/material/select';
import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import {Subscription} from 'rxjs';
import {Order} from '../../../interfaces/order';
import {OrderService} from '../../../services/order.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {Pagination} from '../../../interfaces/pagination';
import {FormControl, FormGroup} from '@angular/forms';
import {UiService} from '../../../services/ui.service';
import {UtilsService} from '../../../services/utils.service';
import {UpdateOrderStatusComponent} from './update-order-status/update-order-status.component';
import {Vendor} from 'src/app/interfaces/vendor';
import {VendorDataService} from 'src/app/services/vendor-data.service';

export interface OrderFilter {
  deliveryStatus?: number;
  checkoutDate?: any;
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {


  private subAcRoute: Subscription;

  public orderEnum = OrderStatus;

  orders: Order[] = [];

  // Pagination
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 2;
  totalProductsStore = 0;

  orderStatus: any[] = [
    {value: null, viewValue: 'None'},
    {value: OrderStatus.PENDING, viewValue: 'Pending'},
    {value: OrderStatus.CONFIRM, viewValue: 'Confirm'},
    {value: OrderStatus.PROCESSING, viewValue: 'Processing'},
    {value: OrderStatus.SHIPPING, viewValue: 'Shipping'},
    {value: OrderStatus.DELIVERED, viewValue: 'Delivered'},
    {value: OrderStatus.CANCEL, viewValue: 'Cancel'},
    {value: OrderStatus.REFUND, viewValue: 'Refund'},
  ];

  // Filter Date Range
  startDate?: string;
  endDate?: string;

  // Form Group
  dataFormRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  // Data Filtering
  isFiltering = false;

  // Max & Min Data
  today = new Date();
  // QUERY
  filterQuery: OrderFilter = null;

  vendorId: string = null;
  vendor: Vendor = null;

  @ViewChild('matSelectFilter') matSelectFilter: MatSelect;


  constructor(
    private dialog: MatDialog,
    private orderService: OrderService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private uiService: UiService,
    private utilsService: UtilsService,
    private vendorDataService: VendorDataService
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(param => {
      this.vendorId = param.get('id');
    });

    this.subAcRoute = this.activatedRoute.queryParams.subscribe(qParam => {
      if (qParam && qParam.page) {
        this.currentPage = qParam.page;
      } else {
        this.currentPage = 1;
      }
      if (!this.vendorId) {
        this.getAllOrdersByAdmin();
      } else {
        this.getAllOrdersByVendor();
        // this.getAllOrdersOfVendor();
        this.getVendorById();
      }
    });

  }

  private getAllOrdersOfVendor() {
    this.orderService.getAllOrdersOfVendor(this.vendorId)
      .subscribe(res => {
        this.orders = res.data;
      }, error => {
        console.log(error);
      });
  }

  private getVendorById() {
    this.vendorDataService.getSingleVendorById(this.vendorId)
    .subscribe( res => {
      this.vendor = res.data;

      console.log('this is vendor by Id');
      console.log(this.vendor);
    }, err => {
      console.log(err);
    });
  }

  private getAllOrdersByVendor() {
    this.spinner.show();

    const pagination: Pagination = {
      pageSize: this.productsPerPage.toString(),
      currentPage: this.currentPage.toString()
    };

    this.orderService.getAllVendorOrdersByAdmin(this.vendorId, pagination, null, this.filterQuery)
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
        if (!item.product && item.deleteDeliveryStatus === 'not-shipped-or-delivered') {
          refundAmount += item.price * item.quantity;
        }
      });
      order.refundAmount = refundAmount;
    });
  }

  private getAllOrdersByAdmin() {
    this.spinner.show();

    const pagination: Pagination = {
      pageSize: this.productsPerPage.toString(),
      currentPage: this.currentPage.toString()
    };

    this.orderService.getAllOrdersByAdmin(pagination, null, this.filterQuery)
      .subscribe(res => {
        this.orders = res.data;
        this.updatedAmount();
        this.totalProducts = res.count;
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }


  /**
   * PAGINATION CHANGE
   */
  public onPageChanged(event: any) {
    this.router.navigate([], {queryParams: {page: event}});
  }

  /**
   * NG CLASS
   */
  getDeliveryStatusColor(order: Order) {
    switch (order.deliveryStatus) {

      case this.orderEnum.CANCEL: {
        return 'cancel';
      }
      case this.orderEnum.PROCESSING: {
        return 'processing';
      }
      case this.orderEnum.CONFIRM: {
        return 'confirm';
      }
      case this.orderEnum.DELIVERED: {
        return 'delivered';
      }
      case this.orderEnum.REFUND: {
        return 'refund';
      }
      case this.orderEnum.SHIPPING: {
        return 'shipping';
      }
      default: {
        return 'none';
      }
    }
  }

  /**
   * OPEN COMPONENT DIALOG
   */

  public openUpdateOrderDialog(order?: Order) {
    const dialogRef = this.dialog.open(UpdateOrderStatusComponent, {
      data: order,
      panelClass: ['theme-dialog'],
      // width: '100%',
      // minHeight: '60%',
      autoFocus: false,
      disableClose: false
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        // if (dialogResult.selectedIds) {
        //   this.selectedProductIds = dialogResult.selectedIds;
        //   this.dataForm.patchValue({products: dialogResult.selectedIds});
        //   this.getSpecificProductsById(this.selectedProductIds);
        // }
      }
    });
  }

  /**
   * ON FILTER CHANGE
   */
  onFilterSelectChange(event: MatSelectChange) {
    if (event.value) {
      if (this.filterQuery && this.filterQuery.deliveryStatus) {
        this.filterQuery.deliveryStatus = event.value;
      } else if (this.filterQuery) {
        this.filterQuery = {...this.filterQuery, ...{deliveryStatus: event.value}};
      } else {
        this.filterQuery = {deliveryStatus: event.value};
      }
      console.log('On Type Filter');
      console.log(this.filterQuery);
      this.getAllOrdersByAdmin();
    } else {
      delete this.filterQuery.deliveryStatus;
      this.getAllOrdersByAdmin();

    }
  }

  public openConfirmDialog(data?: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want delete this category?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        console.log('Data should be deleted');
        // TODO DELETE PROCESS HANDLE HERE
      }
    });
  }


  /**
   * FILTER DATA
   */

  onFilterData() {
    if (
      this.dataFormRange.controls.start.hasError('matStartDateInvalid') ||
      !this.dataFormRange.value.start
    ) {
      this.uiService.warn('Invalid start date');
      return;
    }

    if (
      this.dataFormRange.controls.end.hasError('matEndDateInvalid') ||
      !this.dataFormRange.value.end
    ) {
      this.uiService.warn('Invalid end date');
      return;
    }
    this.isFiltering = true;
    this.startDate = this.utilsService.getDateString(this.dataFormRange.value.start);
    this.endDate = this.utilsService.getDateString(this.dataFormRange.value.end);


    // this.getAllReports();

    if (this.isFiltering) {

      if (this.filterQuery && this.filterQuery.checkoutDate) {
        this.filterQuery.checkoutDate = { $gte: this.startDate, $lte: this.endDate };
      } else if (this.filterQuery) {
        this.filterQuery = {...this.filterQuery, ...{checkoutDate: { $gte: this.startDate, $lte: this.endDate }}};
      } else {
        this.filterQuery = {checkoutDate: { $gte: this.startDate, $lte: this.endDate }};
      }

      this.getAllOrdersByAdmin();

      console.log('On date Filter');
      console.log(this.filterQuery);

      // this.filterQuery = {checkoutDate: { $gte: this.startDate, $lte: this.endDate }}

      // const date = this.utilsService.getStartEndDate(new Date(), true);
      // this.startDate = date.firstDay as string;
      // this.endDate = this.utilsService.getDateString(new Date());
    }

  }

  /**
   * CLEAR FILTERING
   */
  clearFiltering() {
    this.isFiltering = false;
    this.dataFormRange.reset();
    this.filterQuery = null;
    this.matSelectFilter.value = null;
    this.getAllOrdersByAdmin();
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
