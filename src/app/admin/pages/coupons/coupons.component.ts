import { Component, OnInit } from '@angular/core';
import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {UiService} from '../../../services/ui.service';
import {ReloadService} from '../../../services/reload.service';
import {CouponService} from '../../../services/coupon.service';
import {Coupon} from '../../../interfaces/coupon';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss']
})
export class CouponsComponent implements OnInit {

  coupons: Coupon[];

  constructor(
    private dialog: MatDialog,
    private uiService: UiService,
    private reloadService: ReloadService,
    private couponService: CouponService
  ) { }

  ngOnInit(): void {
    this.reloadService.refreshCoupons$
      .subscribe(() => {
        this.getAllCoupons();
      });
    this.getAllCoupons();
  }

  onPageChanged($event: number) {

  }
  /**
   * COMPONENT DIALOG VIEW
   */
  public openConfirmDialog(data?: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want delete this category?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deleteCoupon(data);
      }
    });
  }

  /**
   * HTTP REQ HANDLE
   */

  private getAllCoupons() {
    this.couponService.getAllCoupons()
      .subscribe(res => {
        this.coupons = res.data;
      }, error => {
        console.log(error);
      });
  }

  private deleteCoupon(id: string) {
    this.couponService.deleteCoupon(id)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshCoupons$();
      }, error => {
        console.log(error);
      });
  }
}
