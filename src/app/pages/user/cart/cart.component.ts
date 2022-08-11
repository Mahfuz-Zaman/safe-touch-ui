import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Cart} from '../../../interfaces/cart';
import {UserDataService} from '../../../services/user-data.service';
import {ReloadService} from '../../../services/reload.service';
import {UserService} from '../../../services/user.service';
import {UiService} from '../../../services/ui.service';
import {DATABASE_KEY} from '../../../core/utils/global-variable';
import {Product} from '../../../interfaces/product';
import {CartService} from '../../../services/cart.service';
import {ProductService} from '../../../services/product.service';
import {PricePipe} from '../../../shared/pipes/price.pipe';
import {Coupon} from 'src/app/interfaces/coupon';
import {CouponService} from 'src/app/services/coupon.service';
import {StorageService} from 'src/app/services/storage.service';
import {ShippingChargeService} from '../../../services/shipping-charge.service';
import {ShippingCharge} from '../../../interfaces/shippingcharge';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  providers: [PricePipe]
})
export class CartComponent implements OnInit {

  carts: Cart[] = [];
  shippingChargeData: ShippingCharge = null;
  shippingCharge = 0;
  // inSideDhaka = 0;
  // outSideDhaka = 0;

  // Coupon
  couponText: string;
  couponData: Coupon = null;
  couponType: number;
  couponDiscountType: number;
  finalDiscount: number;

  constructor(
    private router: Router,
    private userDataService: UserDataService,
    private reloadService: ReloadService,
    private userService: UserService,
    private uiService: UiService,
    private cartService: CartService,
    private productService: ProductService,
    private couponService: CouponService,
    private storageService: StorageService,
    private shippingService: ShippingChargeService,
    private pricePipe: PricePipe,
  ) {
  }

  ngOnInit(): void {
    this.reloadService.refreshCart$.subscribe(() => {
      this.getCartsItems();
    });
    this.getCartsItems();
    this.couponData = this.storageService.storedCouponData;
    if (this.couponData) {
      this.couponText = this.couponData.couponCode;
    }
    // this.getShippingCharge();
  }

  private getShippingCharge() {
    // this.shippingService.getExtraPriceInfo()
    //   .subscribe(res => {
    //     this.shippingChargeData = res.data;
    //     if (this.shippingChargeData) {
    //       this.shippingCharge = this.shippingChargeData.deliveryInDhaka;
    //     }
    //     // this.inSideDhaka = res.data?.deliveryInDhaka;
    //     // this.outSideDhaka = res.data?.deliveryOutsideDhaka;
    //     // this.shippingCharge = res.data?.deliveryInDhaka;
    //   }, error => {
    //     console.log(error);
    //   });
  }

  /**
   * HTTP REQ HANDLE
   * COUPON HANDLE
   */

  checkCoupon() {
    this.couponService.checkCoupon(this.couponText)
      .subscribe(res => {
        console.log(res);
        const data = res.data;
        if (!data) {
          this.couponData = null;
          this.uiService.wrong(res.message);
        } else {
          this.couponData = data;
          this.couponType = this.couponData.couponType;
          this.couponDiscountType = this.couponData.couponDiscountType;
          this.storageService.storeCouponData(this.couponData);
          this.uiService.success(res.message);
        }
      }, error => {
        console.log(error);
      });
  }

  /**
   * APPLY COUPON
   */

  applyCoupon() {
    if (!this.couponText) {
      this.uiService.warn('No Coupon text');
      return;
    } else {
      // call use coupon to check if valid
      this.checkCoupon();
      // if not valid
      // if valid
    }
    console.log(this.couponText);
  }

  removeCoupon() {
    this.couponData = null;
    this.couponText = null;
    this.storageService.storeCouponData(this.couponData);
  }

  /**
   * CART DATA
   */
  private getCartsItems() {
    if (this.userService.getUserStatus()) {
      this.getCartItemList();
    } else {
      this.getCarsItemFromLocal();
    }

  }

  private getCarsItemFromLocal() {
    const items = this.cartService.getCartItemFromLocalStorage();

    if (items && items.length > 0) {
      const ids: string[] = items.map(m => m.product as string);
      this.productService.getSpecificProductsById(ids, 'productName productSlug  price discountType discountAmount  quantity images shippingCharge')
        .subscribe(res => {
          const products = res.data;
          if (products && products.length > 0) {
            this.carts = items.map(t1 => ({...t1, ...{product: products.find(t2 => t2._id === t1.product)}}));
            console.log('get all cart products');
            console.log(this.carts);

            for (const data of this.carts) {
              this.shippingCharge += data.product.shippingCharge;
            }
          }
        });
    } else {
      this.carts = [];
    }
  }


  /**
   * CART FUNCTIONALITY
   */
  onDeleteCartItem(cartId: string, product: string) {
    if (this.userService.getUserStatus()) {
      this.removeCartItem(cartId);
    } else {
      this.cartService.deleteCartItemFromLocalStorage(product);
      this.reloadService.needRefreshCart$();
    }
  }


  /**
   * LOGICAL METHODS
   */

  incrementQty(cartId: string, index: number) {
    if (this.userService.getUserStatus()) {
      this.incrementCartQtyDB(cartId);
    } else {
      const data = this.cartService.getCartItemFromLocalStorage();
      if (data != null) {
        data[index].selectedQty = data[index].selectedQty + 1;
        localStorage.setItem(DATABASE_KEY.userCart, JSON.stringify(data));
        this.reloadService.needRefreshCart$();
      }
    }
  }

  decrementQty(cartId: string, index: number, sQty: number) {
    if (this.userService.getUserStatus()) {
      if (sQty === 1) {
        this.uiService.warn('Minimum quantity is 1');
        return;
      }
      this.decrementCartQtyDB(cartId);
    } else {
      const data = this.cartService.getCartItemFromLocalStorage();
      if (data[index].selectedQty === 1) {
        return;
      }
      if (data != null) {
        data[index].selectedQty = data[index].selectedQty - 1;
        localStorage.setItem(DATABASE_KEY.userCart, JSON.stringify(data));
        this.reloadService.needRefreshCart$();
      }
    }

  }

  /**
   * CALCULATION
   */

  get couponCalculation(): number {
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
  }

  get cartSubTotal(): number {
    return this.carts.map(t => {
      const cartSubTotal = this.pricePipe.transform(t.product as Product, 'priceWithDiscount', t.selectedQty) as number;
      return cartSubTotal;
    }).reduce((acc, value) => acc + value, 0);
  }

  get totalCartAmount(): number {
    if (this.carts && this.carts.length > 0) {
      return this.carts.map((t: Cart) => {
        const product = t.product as Product;
        const totalCartAmount = product.price * t.selectedQty;
        return totalCartAmount;
      }).reduce((acc: any, value: any) => acc + value, 0);
    } else {
      return 0;
    }
  }

  //
  // get totalAmount(): number {
  //   return this.carts.map(t => t.product.price * t.selectedQty).reduce((acc, value) => acc + value, 0);
  //   return 0;
  // }

  get totalSave(): number {
    // const old = this.cartsItems.map(t => t.product.price * t.selectedQty).reduce((acc, value) => acc + value, 0);
    // return old - this.totalAmount;
    return 0;
  }

  /**
   * HTTP REQ HANDLE
   */
  private getCartItemList() {
    this.cartService.getCartItemList()
      .subscribe(res => {
        this.carts = res.data;
        console.log('get all cart products online ');
        console.log(this.carts);

        for (const data of this.carts) {
          this.shippingCharge += data.product.shippingCharge;
        }
      }, error => {
        console.log(error);
      });
  }

  private removeCartItem(cartId: string) {
    this.cartService.removeCartItem(cartId)
      .subscribe(() => {
        this.reloadService.needRefreshCart$();
      }, error => {
        console.log(error);
      });
  }

  private incrementCartQtyDB(cartId: string) {
    this.cartService.incrementCartQuantity(cartId)
      .subscribe(() => {
        this.reloadService.needRefreshCart$();
      }, error => {
        console.log(error);
      });
  }

  private decrementCartQtyDB(cartId: string) {
    this.cartService.decrementCartQuantity(cartId)
      .subscribe(() => {
        this.reloadService.needRefreshCart$();
      }, error => {
        console.log(error);
      });
  }


}
