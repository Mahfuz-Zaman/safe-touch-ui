import { Component, OnInit } from '@angular/core';
import {Vendor} from '../../../interfaces/vendor';
import {MatDialog} from '@angular/material/dialog';
import {ReloadService} from '../../../services/reload.service';
import {UiService} from '../../../services/ui.service';
import {VendorDataService} from '../../../services/vendor-data.service';

import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import {Select} from '../../../interfaces/select';
import {MatOptionSelectionChange} from '@angular/material/core';
import {ProductFilter} from '../../../interfaces/product-filter';
import {UpdateAmountComponent} from './update-amount/update-amount.component';
import {VendorService} from '../../../services/vendor.service';

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss']
})
export class VendorsComponent implements OnInit {

  // store data
  vendors: Vendor[] = [];

  Approvals: Select[] = [
    {viewValue : 'Approved', value: {approved: true}},
    {viewValue : 'Not Approved', value: {approved: false}}
  ];

  // Query
  query = {};

  constructor(
    private dialog: MatDialog,
    private reloadService: ReloadService,
    private uiService: UiService,
    private vendorDataService: VendorDataService,
    private vendorService: VendorService
  ) { }

  ngOnInit(): void {
    this.reloadService.refreshVendors$.subscribe(() => {
      this.getVendorList();
    });
    this.getVendorList();
  }

  /**
   * HTTP REQ HANDLE
   */
  private getVendorList() {
    this.vendorDataService.getVendorsByFilter(this.query)
      .subscribe(res => {
        this.vendors = res.data;
      }, error => {
        console.log(error);
      });
  }

  private deleteVendor(vendorId) {
    this.vendorDataService.deleteVendor(vendorId)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshVendors$();
      }, error => {
        console.log(error);
      });
  }

  private changeVendorStatus(id, data) {
    this.vendorDataService.changeVendorStatus(id, data)
    .subscribe( res => {
      this.uiService.success(res.message);
      this.reloadService.needRefreshVendors$();
    }, err => {
      console.log(err);
    });
  }

  /**
   * COMPONENT DIALOG VIEW
   */
  public openConfirmDialog(data?: Vendor) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure? you want delete this Vendor?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deleteVendor(data._id);
      }
    });
  }

  public openApprovalConfirmDialog(data?: Vendor) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: data?.approved ? 'Remove Approval' : 'Confirm Approval',
        message: 'Are you sure you want to ' + (data?.approved ? 'remove approval of this vendor?' : 'approve this vendor?')
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.changeVendorStatus(data._id, (data?.approved ? {approved: false} : {approved: true}));
      }
    });
  }

  public openUpdateAmountDialog(vendor?: Vendor) {
    const dialogRef = this.dialog.open(UpdateAmountComponent, {
      data: vendor,
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

  onSelectApprove($event: MatOptionSelectionChange) {
    this.query = $event.source.value.value;
    this.reloadService.needRefreshVendors$();
  }

  onClearFilter() {
    this.query = {};
    this.reloadService.needRefreshVendors$();
  }

  /**
   * COMPONENT DIALOG VIEW
   */
  public openConfirmDialogVendor(data?: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want delete this category?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deleteVendorByID(data);
      }
    });
  }

  /**
   * DELETE METHOD HERE
   */
  private deleteVendorByID(id: string) {
    this.vendorService.deleteVendor(id)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshVendors$();
      }, error => {
        console.log(error);
      });
  }
}
