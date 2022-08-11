import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserDataService} from '../../../../services/user-data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {Pagination} from '../../../../interfaces/pagination';
import {NgxSpinnerService} from 'ngx-spinner';
import {Product} from 'src/app/interfaces/product';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/components/ui/confirm-dialog/confirm-dialog.component';
import { ReloadService } from 'src/app/services/reload.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {

  wishlistProducts: Product[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private userDataService: UserDataService,
    private dialog: MatDialog,
    private reloadService: ReloadService,
  ) { }

  ngOnInit(): void {
    this.reloadService.refreshWishlist$
      .subscribe(() => {
        this.getProductsFromWishlist();
      });
    this.getProductsFromWishlist();
  }

  private getProductsFromWishlist() {
    this.userDataService.getProductsFromWishlist()
    .subscribe( res => {
      this.wishlistProducts = res.products;
    }, err => {
      console.log(err);
    });
  }

  /**
   * COMPONENT DIALOG VIEW
   */
   public openConfirmDialog(data?: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want delete this product from your wishlist?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.userDataService.deleteProductByProductIdFromWishlist(data)
        .subscribe( res => {
          this.reloadService.needRefreshWishlist$();
        }, err => {
          console.log(err);
        })
      }
    });
  }

}
