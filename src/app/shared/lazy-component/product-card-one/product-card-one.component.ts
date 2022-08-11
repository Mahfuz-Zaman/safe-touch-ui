import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {QuickViewDialogComponent} from './quick-view-dialog/quick-view-dialog.component';
import {ReloadService} from '../../../services/reload.service';
import {Cart} from '../../../interfaces/cart';
import {UserService} from '../../../services/user.service';
import {CartService} from '../../../services/cart.service';
import {UiService} from '../../../services/ui.service';
import {Product} from '../../../interfaces/product';

@Component({
  selector: 'app-product-card-one',
  templateUrl: './product-card-one.component.html',
  styleUrls: ['./product-card-one.component.scss']
})
export class ProductCardOneComponent implements OnInit {

  @Input() data: any = null;

  @Input() product?: Product;

  dataOb: any;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private userService: UserService,
    private cartService: CartService,
    private reloadService: ReloadService,
    private uiService: UiService
  ) {
  }

  ngOnInit(): void {
  }

  /**
   * CLICK With Event
   */

  addToCart(event: MouseEvent) {
    event.stopPropagation();

    const data: Cart = {
      product: this.product?._id,
      selectedQty: 1,
    };


    if (this.userService.getUserStatus()) {
      this.addItemToCartDB(data);
    } else {
      this.cartService.addCartItemToLocalStorage(data);
      this.reloadService.needRefreshCart$();
    }
  }


  /**
   * HTTP REQ HANDLE
   */

  addItemToCartDB(data: Cart) {
    this.cartService.addItemToUserCart(data)
      .subscribe(res => {
        console.log(res);
        this.uiService.success(res.message);
        this.reloadService.needRefreshCart$();
      }, error => {
        console.log(error);
      });
  }


  onNavigate(url?: string) {
    this.router.navigate(['/product-details/' + this.product.productSlug]);
  }

  /**
   * OPEN COMPONENT DIALOG
   */

  public openComponentDialog(data?: any) {
    this.dialog.open(QuickViewDialogComponent, {
      data,
      panelClass: ['theme-dialog', 'full-screen-modal'],
      autoFocus: false,
      disableClose: false
    });
  }

}
