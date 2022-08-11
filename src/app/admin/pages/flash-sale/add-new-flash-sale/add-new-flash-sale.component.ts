import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {environment} from '../../../../../environments/environment';
import {Product} from '../../../../interfaces/product';
import {ActivatedRoute, Router} from '@angular/router';
import {UiService} from '../../../../services/ui.service';
import {StorageService} from '../../../../services/storage.service';
import {MatDialog} from '@angular/material/dialog';
import {ProductService} from '../../../../services/product.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {FlashSaleService} from '../../../../services/flash-sale.service';
import {FlashSale} from '../../../../interfaces/flash-sale';
import {ProductTableComponent} from '../../components/product-table/product-table.component';

@Component({
  selector: 'app-add-new-deals-of-the-day',
  templateUrl: './add-new-flash-sale.component.html',
  styleUrls: ['./add-new-flash-sale.component.scss']
})
export class AddNewFlashSaleComponent implements OnInit {


  // Subscriptions
  private subProduct: Subscription;

  // Admin Base Url
  readonly adminBaseUrl = environment.adminBaseUrl;

  // Form Template Ref
  @ViewChild('templateForm') templateForm: NgForm;

  dataForm: FormGroup;
  private sub: Subscription;

  isLoading = false;
  autoSlug = true;

  // Store Data from param
  id?: string;
  dealsOfTheDay: FlashSale = null;
  products?: Product[];

  // From Dialog
  selectedProductIds: string[] = [];

  // Destroy Session
  needSessionDestroy = true;

  constructor(
    private fb: FormBuilder,
    private flashSaleService: FlashSaleService,
    private activatedRoute: ActivatedRoute,
    private uiService: UiService,
    private storageService: StorageService,
    public router: Router,
    private dialog: MatDialog,
    private productService: ProductService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      name: [null, Validators.required],
      slug: [null, Validators.required],
      desc: [null],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      priority: [null],
      products: [null, Validators.required]
    });
    // IF HAVE DATA ON SESSION
    if (this.storageService.getStoredInput('Flash_SALE')) {
      this.dataForm.patchValue(this.storageService.getStoredInput('Flash_SALE'));
    }
    if (this.dataForm.value.products && this.dataForm.value.products.length > 0) {
      this.getSpecificProductsById(this.dataForm.value.products);
    }
    // GET ID FORM PARAM
    this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getSingleFlashSaleById();
      }
    });

    this.autoGenerateSlug();

  }

  /**
   * SET FORM DATA
   */
  private setFormData() {
    this.dataForm.patchValue(this.dealsOfTheDay);

    if (this.storageService.getStoredInput('Flash_SALE')) {
      this.dataForm.patchValue(this.storageService.getStoredInput('Flash_SALE'));
    }
  }

  /**
   * OPEN COMPONENT DIALOG
   */

  public openComponentDialog(data?: any) {
    const dialogRef = this.dialog.open(ProductTableComponent, {
      data: this.dealsOfTheDay ? this.products.map(m => m._id) : null,
      panelClass: ['theme-dialog', 'full-screen-modal'],
      width: '100%',
      minHeight: '60%',
      autoFocus: false,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        if (dialogResult.selectedIds) {
          this.selectedProductIds = dialogResult.selectedIds;
          this.dataForm.patchValue({products: dialogResult.selectedIds});
          this.getSpecificProductsById(this.selectedProductIds);
        }
      }
    });
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required fields');
      return;
    }

    if (this.id) {
      const finalData = {...this.dataForm.value, ...{_id: this.id}};
      this.editFlashSale(finalData);
    } else {
      this.addNewFlashSale(this.dataForm.value);
    }
  }

  /**
   * ON HOLD INPUT DATA
   */

  onHoldInputData() {
    this.needSessionDestroy = false;
    this.storageService.storeInputData(this.dataForm?.value, 'Flash_SALE');
  }



  autoGenerateSlug() {
    if (this.autoSlug === true) {
      this.sub = this.dataForm.get('name').valueChanges
        .pipe(
        ).subscribe(d => {
          const res = d?.trim().replace(/[^A-Z0-9]+/ig, '-').toLowerCase();
          this.dataForm.patchValue({
            slug: res
          });
        });
    } else {
      if (this.sub === null || this.sub === undefined) {
        return;
      }
      this.sub.unsubscribe();
    }
  }


  /**
   * HTTP REQ HANDLE
   * GET ATTRIBUTES BY ID
   */
  private addNewFlashSale(data: FlashSale) {
    this.flashSaleService.addNewFlashSale(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.templateForm.resetForm();
        this.storageService.removeSessionData('Flash_SALE');
        // this.pickedImage = this.placeholder;
        this.selectedProductIds = [];
        this.products = [];
      }, err => {
        console.log(err);
      });
  }
  private getSingleFlashSaleById() {
    const selectProductField = '-attributes -filterData -tags -ratingReview -discussion -warrantyServices -description';
    this.flashSaleService.getSingleFlashSaleById(this.id, selectProductField)
      .subscribe(res => {
        this.dealsOfTheDay = res.data;
        console.log(res.data);
        this.products = this.dealsOfTheDay.products as Product[];
        this.setFormData();
      }, error => {
        console.log(error);
      });
  }

  private editFlashSale(data: FlashSale) {
    this.flashSaleService.editFlashSale(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.storageService.removeSessionData('Flash_SALE');
      }, err => {
        console.log(err);
      });
  }

  private getSpecificProductsById(ids: string[]) {
    this.spinner.show();
    const selectProductField = '-attributes -filterData -tags -ratingReview -discussion -warrantyServices -description';
    this.subProduct = this.productService.getSpecificProductsById(ids, selectProductField)
      .subscribe(res => {
        this.products = res.data;
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    if (this.subProduct) {
      this.subProduct.unsubscribe();
    }
    if (this.needSessionDestroy) {
      this.storageService.removeSessionData('DEALS_OF_THE_DAY');
    }
  }
}
