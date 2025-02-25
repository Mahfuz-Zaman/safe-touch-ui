import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {MenuService} from 'src/app/services/menu.service';
import {User} from '../../../interfaces/user';
import {UserService} from '../../../services/user.service';
import {UserDataService} from '../../../services/user-data.service';
import {ReloadService} from '../../../services/reload.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {MatMenu, MatMenuTrigger} from '@angular/material/menu';
import {Cart} from '../../../interfaces/cart';
import {CartService} from '../../../services/cart.service';
import {ProductService} from '../../../services/product.service';
import {PricePipe} from '../../../shared/pipes/price.pipe';
import {CategoryMenu} from '../../../interfaces/category-menu';
import {MenuSide} from '../../../interfaces/menu-side';

@Component({
  selector: 'app-mega-menu',
  templateUrl: './mega-menu.component.html',
  styleUrls: ['./mega-menu.component.scss'],
  providers: [PricePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MegaMenuComponent implements OnInit {
  @Input() scrollPosition = 0;
  @Input() mobileCatMenu: MenuSide[] = [];
  @Input() categoryMenus: CategoryMenu[] = [];
  @Output() sidenavNavToggle = new EventEmitter();
  @ViewChild('menuCartTrigger') menuCartTrigger: MatMenuTrigger;
  @ViewChild('menuCart') menuCart: MatMenu;


  isOpen = false;


  // User Data
  user: User = null;
  isUserAuth = false;

  // CARTS
  carts: Cart[];
  cartsItemsCount = 0;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => {
        return result.matches;
      })
    );

  constructor(
    public router: Router,
    private breakpointObserver: BreakpointObserver,
    private menuService: MenuService,
    public userService: UserService,
    public userDataService: UserDataService,
    private cartService: CartService,
    private reloadService: ReloadService,
    private productService: ProductService,
    private cd: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {

    this.userService.getUserStatusListener().subscribe(() => {
      this.isUserAuth = this.userService.getUserStatus();
      if (this.isUserAuth) {
        this.getLoggedInUserInfo();
      }
    });
    this.isUserAuth = this.userService.getUserStatus();
    if (this.isUserAuth) {
      this.getLoggedInUserInfo();
    }

    // CART FUNCTION
    this.reloadService.refreshCart$.subscribe(() => {
      this.getCartsItems(true);
      this.cd.markForCheck();
    });
    this.getCartsItems();

  }

  onLogout() {
    this.userService.userLogOut();
  }

  /**
   * ON TOGGLE SIDE MENU
   */
  onToggleSidenav() {
    this.sidenavNavToggle.emit();
  }


  /**
   * HTTP REQ HANDLE
   */

  private getLoggedInUserInfo() {
    const select = 'fullName';
    this.userDataService.getLoggedInUserInfo(select)
      .subscribe(res => {
        this.user = res.data;
      }, error => {
        console.log(error);
      });
  }

  /**
   * CART DATA
   */
  private getCartsItems(refresh?: boolean) {
    if (this.userService.getUserStatus()) {
      this.cartService.getCartItemList()
        .subscribe(res => {
          this.carts = res.data;
          if (refresh) {
            this.openCartDropdown();
          }
        });
    } else {
      this.getCarsItemFromLocal(refresh);
    }

  }

  private getCarsItemFromLocal(refresh?: boolean) {
    const items = this.cartService.getCartItemFromLocalStorage();

    if (items && items.length > 0) {
      const ids: string[] = items.map(m => m.product as string);
      this.productService.getSpecificProductsById(ids, 'productName productSlug  price discountType discountAmount  quantity images')
        .subscribe(res => {
          const products = res.data;
          if (products && products.length > 0) {
            this.carts = items.map(t1 => ({...t1, ...{product: products.find(t2 => t2._id === t1.product)}}));
            if (refresh) {
              this.openCartDropdown();
            }
          }
        });
    } else {
      this.carts = [];
    }
  }

  private openCartDropdown() {
    if (this.router.url !== '/cart') {
      // this.menuCart.hasBackdrop = false;
      this.menuCartTrigger.openMenu();
    }
  }


  onClose(event: MouseEvent) {
    event.stopPropagation();
    this.menuCartTrigger.closeMenu();
  }


  /**
   * CALCULATION
   */

  get cartSubTotal(): number {
    if (this.carts && this.carts.length > 0) {
      console.log(this.carts);
      // return this.carts.map(t => {
      //   return this.pricePipe.transform(t.product as Product, 'priceWithDiscount', t.selectedQty) as number;
      // }).reduce((acc, value) => acc + value, 0);
      return 0;
    } else {
      return 0;
    }
  }

  get cartSubtotal() {
    let cartSubtotal = 0;
    if (this.carts && this.carts.length > 0) {
      this.carts.map(cart => {
        if (cart?.product?.discountAmount) {
          const discountAmount = cart?.product?.discountAmount;
          if (cart?.product?.discountType === 1) {
            cartSubtotal += ((100 - discountAmount) / 100) * cart?.product?.price * cart?.selectedQty;
          } else {
            cartSubtotal += (cart?.product?.price - discountAmount) * cart?.selectedQty;
          }
        } else {
          cartSubtotal += (cart?.product?.price * cart?.selectedQty);
        }
      });
    }
    return cartSubtotal;
  }


  /**
   * CART FUNCTIONALITY
   */
  onDeleteCartItem(event: any, cartId: string, product: string) {
    if (this.userService.getUserStatus()) {
      this.cartService.removeCartItem(cartId)
        .subscribe(() => {
          this.reloadService.needRefreshCart$();
          this.menuCartTrigger.ngAfterContentInit();
        }, error => {
          console.log(error);
        });
    } else {
      this.cartService.deleteCartItemFromLocalStorage(product);
      this.reloadService.needRefreshCart$();
      this.menuCartTrigger.ngAfterContentInit();
    }
  }

  /**
   * CAT NAV EVENT
   */
  onCatNavClick(mouseEvent: MouseEvent) {
    this.router.events.subscribe(event => {
      this.isOpen = false;
    });
  }

  onCatNavClickMobile(mouseEvent: MouseEvent) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isOpen = false;
      }
    });
  }


}
