import {Component, Inject, OnInit} from '@angular/core';
import {MatRadioChange} from '@angular/material/radio';
import {Address} from '../../../interfaces/address';
import {MatDialog} from '@angular/material/dialog';
import {AddNewAddressComponent} from './add-new-address/add-new-address.component';
import {UserDataService} from '../../../services/user-data.service';
import {ReloadService} from '../../../services/reload.service';
import {Cart} from '../../../interfaces/cart';
import {UiService} from '../../../services/ui.service';
import {CartService} from '../../../services/cart.service';
import {PricePipe} from '../../../shared/pipes/price.pipe';
import {Product} from '../../../interfaces/product';
import {Order, OrderItem} from '../../../interfaces/order';
import {UtilsService} from '../../../services/utils.service';
import {OrderStatus} from '../../../enum/order-status';
import {SslInit} from '../../../interfaces/ssl-init';
import {OrderService} from '../../../services/order.service';
import {PaymentSslService} from '../../../services/payment-ssl.service';
import {SslInitResponse} from '../../../interfaces/ssl-init-response';
import {ConfirmOrderDialogComponent} from './confirm-order-dialog/confirm-order-dialog.component';
import {Select} from '../../../interfaces/select';
import {Router} from '@angular/router';
import {DOCUMENT} from '@angular/common';
import {environment} from '../../../../environments/environment';
import {User} from '../../../interfaces/user';
import {StorageService} from 'src/app/services/storage.service';
import {Coupon} from 'src/app/interfaces/coupon';
import {CouponService} from 'src/app/services/coupon.service';
import {ShippingChargeService} from '../../../services/shipping-charge.service';
import {ShippingCharge} from '../../../interfaces/shippingcharge';
import { Vendor } from 'src/app/interfaces/vendor';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  providers: [PricePipe]
})
export class CheckoutComponent implements OnInit {

  // Address
  userAddress: Address[] = [];
  selectedAddressIndex = 0;

  // CARTS
  carts: Cart[] = [];

  shippingChargeData: ShippingCharge = null;
  shippingCharge = 0;

  // NOTES
  orderNotes = '';

  // TERMS
  isAccept = false;

  // Store Order Data
  order: Order = null;

  // PAYMENT DATA
  currency = 'BDT';
  shippingMethod: 'Courier';
  shippingType = 'Courier';
  productsNameStr: string = null;
  productsCatStr: string = null;

  // PAYMENT TYPES
  paymentTypes: Select[] = [
    {value: 'cash_on_delivery', viewValue: 'Cash on Delivery'},
    {value: 'online_payment', viewValue: 'Online Payment or Bkash, Nagad or Rocket'},
  ];

  selectedPaymentType = 'cash_on_delivery';

  user: User = null;

  // Coupon
  couponText: string;
  couponData: Coupon = null;
  couponType: number;
  couponDiscountType: number;
  finalDiscount: number;

  constructor(
    private dialog: MatDialog,
    private userDataService: UserDataService,
    private reloadService: ReloadService,
    private uiService: UiService,
    private cartService: CartService,
    private pricePipe: PricePipe,
    private utilsService: UtilsService,
    private orderService: OrderService,
    private storageService: StorageService,
    private couponService: CouponService,
    private paymentSslService: PaymentSslService,
    private shippingService: ShippingChargeService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {
  }

  ngOnInit(): void {

    this.reloadService.refreshAddress$.subscribe(() => {
      this.getUserAddress();
    });

    // GET DATA
    this.getLoggedInUserInfo();
    this.getUserAddress();
    this.getCartItemList();
    this.checkCouponData();
    // this.getShippingCharge();

    console.log(this.shippingCharge);
  }



  checkCouponData() {
    this.couponData = this.storageService.storedCouponData;
    if (this.couponData) {
      this.couponService.getCouponCouponId(this.couponData._id)
        .subscribe(res => {
          this.couponData = res.data;
          if (this.couponData.couponUsedByUser.includes(this.user._id)) {
            this.couponData = null;
            this.uiService.warn('Coupon is not applicable anymore, and has been removed');
          }
        }, err => {
          console.log(err);
        });
    }

    console.log(this.couponData);
  }

  onChangeAddress(event: MatRadioChange) {
    // this.selectedAddressIndex = event.value;
    // if (this.userAddress[event.value].city === 'Dhaka') {
    //   this.shippingCharge = this.shippingChargeData?.deliveryInDhaka;
    // } else {
    //   this.shippingCharge = this.shippingChargeData?.deliveryOutsideDhaka;
    // }
  }

  /**
   * COMPONENT DIALOG VIEW
   */

  openAddNewAddressDialog(address?: Address) {
    this.dialog.open(AddNewAddressComponent, {
      data: address,
      panelClass: ['theme-dialog'],
      maxHeight: '600px',
      autoFocus: false,
      disableClose: false
    });
  }

  openConfirmOrderDialog() {
    console.log('Here');

    const dialogRef = this.dialog.open(ConfirmOrderDialogComponent, {
      data: {
        order: this.order,
        carts: this.carts,
        selectedPaymentType: this.selectedPaymentType
      },
      panelClass: ['theme-dialog'],
      width: '90%',
      maxWidth: '1050px',
      maxHeight: '800px',
      autoFocus: false,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        if (dialogResult.isConfirm) {
          this.storageService.storeCouponData(null);
          if (this.selectedPaymentType === 'cash_on_delivery') {
            this.saveOrderInformationToMain();
          } else {
            this.saveOrderInformationToTemp();
          }
        }
      }
    });
  }


  openConfirmDialog(id: any) {

  }


  /**
   * HTTP REQ HANDLE
   * LOCAL STORAGE HANDLE
   */

  private getLoggedInUserInfo() {
    const select = '-password';
    this.userDataService.getLoggedInUserInfo(select)
      .subscribe(res => {
        this.user = res.data;
      }, error => {
        console.log(error);
      });
  }

  private getUserAddress() {
    this.userDataService.getAllAddress()
      .subscribe((res1) => {
        this.userAddress = res1.data;

        // this.shippingService.getExtraPriceInfo()
        //   .subscribe(res => {
        //     this.shippingChargeData = res.data;
        //     if (this.shippingChargeData) {
        //       this.shippingCharge = this.shippingChargeData.deliveryInDhaka;
        //       this.shippingCharge = this.userAddress[0].city === 'Dhaka' ? this.shippingChargeData.deliveryInDhaka : this.shippingChargeData.deliveryOutsideDhaka;
        //     }
        //   }, error => {
        //     console.log(error);
        //   });

      }, err => {
        console.log(err);
      });
  }

  private getCartItemList() {
    this.cartService.getCartItemList()
      .subscribe(res => {
        this.carts = res.data;

        const productNames = this.carts.map(m => {
          const product = m.product as Product;
          return product.productName;
        });
        const productCategories = this.carts.map(m => {
          const product = m.product as Product;
          return product.categorySlug;
        });
        this.productsNameStr = productNames.join();
        this.productsCatStr = productCategories.join();

        console.log('get all cart products');
        console.log(this.carts);

        for (const data of this.carts) {
          this.shippingCharge += data.product.shippingCharge;
          console.log('this is shipping charge');
          console.log(this.shippingCharge);
        }



      }, error => {
        console.log(error);
      });

  }

  getShippingCharge() {
    for (const data of this.carts) {
      this.shippingCharge += data.product.shippingCharge;
      console.log('this is shipping charge');
      console.log(this.shippingCharge);
      return this.shippingCharge;
    }

  }

  private saveOrderInformationToMain() {
    // console.log(this.order);
    this.orderService.placeOrder(this.order)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.router.navigate(['/account/order-list']);
      }, error => {
        console.log(error);
      });
  }

  private saveOrderInformationToTemp() {
    // console.log(this.order);
    this.orderService.placeTempOrder(this.order)
      .subscribe(res => {
        this.sslInitWithOrder(res.orderId);
      }, error => {
        console.log(error);
      });
  }

  /**
   * CALCULATION
   */

  get couponCalculation(): number {
    if (this.couponData) {
      const amount = this.couponData.couponAmount;
      if (this.couponData.couponType === 1) {
        if (this.couponData.couponDiscountType === 2) {
          this.finalDiscount = this.shippingCharge - amount;
          return this.finalDiscount;
        } else {
          return this.finalDiscount = amount;
        }
      } else {
        if (this.couponData.couponDiscountType === 1) {
          return this.finalDiscount = this.cartSubTotal * (amount / 100);
        } else if (this.couponData.couponDiscountType === 2) {
          return this.finalDiscount = this.shippingCharge * (amount / 100);
        } else {
          return this.finalDiscount = (this.cartSubTotal + this.shippingCharge) * (amount / 100);
        }
      }
    } else {
      return 0;
    }
  }

  get cartSubTotal(): number {
    return this.carts.map(t => {
      return this.pricePipe.transform(t.product as Product, 'priceWithDiscount', t.selectedQty) as number;
    }).reduce((acc, value) => acc + value, 0);
  }

  get cartTotalDiscount(): number {
    return this.carts.map(t => {
      return this.pricePipe.transform(t.product as Product, 'discountPrice', t.selectedQty) as number;
    }).reduce((acc, value) => acc + value, 0);
  }


  /**
   * MAIN PLACE ORDER
   */
  placeOrder() {

    if (this.couponData) {
      this.couponService.getCouponCouponId(this.couponData._id)
        .subscribe(res => {
          this.couponData = res.data;
          if (this.couponData.couponUsedByUser.includes(this.user._id)) {
            // Re-do calculation

            this.couponData = null;
            this.uiService.warn('Coupon is not applicable anymore, and has been removed');
          } else {
            // tslint:disable-next-line:no-unused-expression
            this.couponCalculation;
          }
        }, err => {
          console.log(err);
        });
    }

    if (this.userAddress.length <= 0) {
      this.uiService.warn('Please select correct shipping address');
      return;
    }

    if (!this.isAccept) {
      this.uiService.warn('Please accept our terms and conditions con continue');
      return;
    }

    const vendors = [];

    const products = this.carts.map(m => {
      const product = m.product as Product;
      const vendor = m.product.vendor as Vendor;

      if (vendor) {
        vendors.push(vendor._id);
      }

      return {
        product: product._id,
        price: this.pricePipe.transform(product as Product, 'priceWithDiscount') as number,
        discountType: product.discountType,
        discountAmount: product.discountAmount,
        quantity: m.selectedQty,
        orderType: 'regular',
        vendor: product.vendor ? vendor._id : null,
        commission: product.commission ? product.commission : null
      } as OrderItem;
    });

    const totalAmountWithDiscount = (this.cartSubTotal + this.shippingCharge - this.couponCalculation);

    this.order = {
      paymentMethod: this.selectedPaymentType,
      checkoutDate: this.utilsService.getDateWithCurrentTime(new Date()),
      name: this.userAddress[this.selectedAddressIndex].name,
      phoneNo: this.userAddress[this.selectedAddressIndex].phoneNo,
      email: this.userAddress[this.selectedAddressIndex].email,
      alternativePhoneNo: this.userAddress[this.selectedAddressIndex].alternativePhoneNo,
      area: this.userAddress[this.selectedAddressIndex].area,
      city: this.userAddress[this.selectedAddressIndex].city,
      postCode: this.userAddress[this.selectedAddressIndex].postCode,
      shippingAddress: this.userAddress[this.selectedAddressIndex].shippingAddress,
      deliveryDate: null,
      deliveryStatus: OrderStatus.PENDING,
      shippingFee: this.shippingCharge,
      subTotal: this.cartSubTotal,
      discount: this.couponCalculation,
      totalAmount: this.cartSubTotal + this.shippingCharge,
      totalAmountWithDiscount,
      deletedProduct: false,
      refundAmount: 0,
      paymentStatus: 'unpaid',
      hasPreorderItem: false,
      orderTimeline: {
        others: false,
        othersData: null,
        orderPlaced: false,
        orderPlacedDate: this.utilsService.getDateWithCurrentTime(new Date()),
        orderProcessing: false,
        orderProcessingDate: null,
        orderPickedByDeliveryMan: false,
        orderPickedByDeliveryManDate: null,
        orderDelivered: false,
        orderDeliveredDate: null
      },
      couponId: this.couponData?._id,
      couponValue: null,
      orderedItems: products,
      vendors: vendors,
      delivered: false,
      orderNotes: this.orderNotes,
      sessionkey: null
    };

    this.openConfirmOrderDialog();

  }

  private sslInitWithOrder(orderId: string) {
    const baseHost = this.utilsService.getHostBaseUrl();

    const sslPaymentInit: SslInit = {
      store_id: null,
      store_passwd: null,
      total_amount: this.order.totalAmountWithDiscount,
      currency: this.currency,
      tran_id: orderId,
      success_url: baseHost + '/callback/payment/success',
      fail_url: baseHost + '/callback/payment/fail',
      cancel_url: baseHost + '/callback/payment/cancel',
      ipn_url: environment.sslIpnUrl,
      shipping_method: 'Courier',
      product_name: this.productsNameStr,
      product_category: this.productsCatStr,
      product_profile: 'general',
      cus_name: this.order.name,
      cus_email: this.order.email ? this.order.email : 'safetouch.dummy@gmail.com',
      cus_add1: this.order.shippingAddress,
      cus_add2: '',
      cus_city: this.order.city,
      cus_state: '',
      cus_postcode: this.order.postCode ? this.order.postCode : 'dummy',
      cus_country: 'Bangladesh',
      cus_phone: this.order.phoneNo,
      cus_fax: '',
      ship_name: this.order.name,
      ship_add1: this.order.shippingAddress,
      ship_add2: '',
      ship_city: this.order.city,
      ship_state: '',
      ship_postcode: this.order.postCode ? this.order.postCode : 'dummy',
      ship_country: 'Bangladesh',
      // multi_card_name: '',
      value_a: this.order.orderNotes,
      // value_b: '',
      // value_c: '',
      // value_d: ''
    };

    console.log(sslPaymentInit);

    this.paymentSslService.initSSLPayment(sslPaymentInit)
      .subscribe(res => {
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>');
        console.log(res.data);
        const sslInitResponse: SslInitResponse = res.data;
        const sessionkey = sslInitResponse.sessionkey;
        this.orderService.updateOrderSessionKey(orderId, sessionkey)
          .subscribe(res3 => {
            const gatewayPageURL = sslInitResponse.GatewayPageURL;
            // window.open(gatewayPageURL);
            this.document.location.href = gatewayPageURL ? gatewayPageURL : '';
          }, error => {
            this.uiService.wrong('This order could not be processed at this time, please try again.');
          });

      }, error => {
        console.log(error);
      });
  }


}
