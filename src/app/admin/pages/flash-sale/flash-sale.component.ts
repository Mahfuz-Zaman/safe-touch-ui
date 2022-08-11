import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {UiService} from '../../../services/ui.service';
import {ReloadService} from '../../../services/reload.service';
import {FlashSaleService} from '../../../services/flash-sale.service';
import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import {Product} from '../../../interfaces/product';
import {ProductViewTableOneComponent} from '../components/product-view-table-one/product-view-table-one.component';
import {FlashSale} from '../../../interfaces/flash-sale';

@Component({
  selector: 'app-deals-of-the-day',
  templateUrl: './flash-sale.component.html',
  styleUrls: ['./flash-sale.component.scss']
})
export class FlashSaleComponent implements OnInit {

  allFlashSale: FlashSale[] = [];

  constructor(
    private dialog: MatDialog,
    private uiService: UiService,
    private reloadService: ReloadService,
    private flashSaleService: FlashSaleService
  ) { }

  ngOnInit(): void {
    this.reloadService.refreshFlashSale$.subscribe(() => {
      this.getAllFlashSale();
    });
    this.getAllFlashSale();
  }

  /**
   * COMPONENT DIALOG VIEW
   */
  public openConfirmDialog(id?: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want delete this category?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deleteFlashSaleById(id);
      }
    });
  }

  /**
   * OPEN COMPONENT DIALOG
   */

  public openComponentDialog(product: Product) {
    console.log(product);
    const products = [product];
    console.log('My products');
    console.log(products);
    const dialogRef = this.dialog.open(ProductViewTableOneComponent, {
      data: products,
      panelClass: ['theme-dialog', 'full-screen-modal'],
      width: '100%',
      autoFocus: false,
      disableClose: false
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        // TODO IF CLOSE
      }
    });
  }

  /**
   * HTTP REQ HANDLE
   */

  private getAllFlashSale() {
    this.flashSaleService.getAllFlashSale()
      .subscribe(res => {
        this.allFlashSale = res.data;
      }, error => {
        console.log(error);
      });
  }

  private deleteFlashSaleById(id: string) {
    this.flashSaleService.deleteFlashSaleById(id)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshFlashSale$();
      }, error => {
        console.log(error);
      });
  }
}
