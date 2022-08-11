import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserDataService} from '../../../../services/user-data.service';
import {ReloadService} from '../../../../services/reload.service';
import {MatDialog} from '@angular/material/dialog';
import {UiService} from '../../../../services/ui.service';
import {EditAddressBookComponent} from '../../../../shared/dialog-view/edit-address-book/edit-address-book.component';
import {ConfirmDialogComponent} from '../../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {Pagination} from '../../../../interfaces/pagination';
import {Address} from '../../../../interfaces/address';

@Component({
  selector: 'app-address-book',
  templateUrl: './address-book.component.html',
  styleUrls: ['./address-book.component.scss']
})
export class AddressBookComponent implements OnInit, OnDestroy {
  private subAcRoute: Subscription;

  userAddress: Address[] = [];


  // Pagination
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 5;
  totalProductsStore = 0;

  constructor(
    private userDataService: UserDataService,
    private reloadService: ReloadService,
    private dialog: MatDialog,
    private uiService: UiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    this.reloadService.refreshAddress$.subscribe(() => {
      this.getUserAddress();
    });

    this.subAcRoute = this.activatedRoute.queryParams.subscribe(qParam => {
      if (qParam && qParam.page) {
        this.currentPage = qParam.page;
      } else {
        this.currentPage = 1;
      }
      this.getUserAddress();
    });
  }

  private getUserAddress() {
    this.spinner.show();

    const pagination: Pagination = {
      pageSize: this.productsPerPage.toString(),
      currentPage: this.currentPage.toString()
    };


    this.userDataService.getAllAddress(pagination)
      .subscribe((res) => {
        this.userAddress = res.data;
        this.totalProducts = res.count;
        console.log(this.totalProducts);
      }, err => {
        console.log(err);
      });
  }

  openAddNewAddressDialog(address?: Address) {
    this.dialog.open(EditAddressBookComponent, {
      data: address,
      panelClass: ['theme-dialog'],
      autoFocus: false,
      disableClose: false
    });
  }

  public openConfirmDialog(addressId: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want delete this category?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        //
        this.deleteAddress(addressId);
        //
      }
    });
  }

  /**
   * HTTP Request Handle
   */

  deleteAddress(addressId: string) {
    // //
    // this.userDataService.deleteAddress(addressId)
    //   //
    //   .subscribe( res => {
    //     this.uiService.success(res.message);
    //     this.reloadService.needRefreshAddress$();
    //   }, error => {
    //     console.log(error);
    //   });

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
