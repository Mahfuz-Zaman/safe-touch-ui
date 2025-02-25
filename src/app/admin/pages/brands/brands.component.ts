import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import {BrandService} from '../../../services/brand.service';
import {ProductBrand} from '../../../interfaces/product-brand';
import {UiService} from '../../../services/ui.service';
import {ReloadService} from '../../../services/reload.service';
import {Subscription} from 'rxjs';
import * as XLSX from 'xlsx';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {UtilsService} from '../../../services/utils.service';
import {DownloadJsonDialogComponent} from '../../../shared/dialog-view/download-json-dialog/download-json-dialog.component';

@Component({
  selector: 'app-parent-categories',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss']
})
export class BrandsComponent implements OnInit {

  // Subscriptions
  private subAcRoute: Subscription;
  // Demo list of parent categories
  brands: ProductBrand[] = [];
  // Pagination
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 24;
  totalProductsStore = 0;

  // DOWNLOADABLE
  dataTypeFormat = 'json';

  constructor(
    private dialog: MatDialog,
    private brandService: BrandService,
    private uiService: UiService,
    private reloadService: ReloadService,
    private spinner: NgxSpinnerService,
    private utilsService: UtilsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.reloadService.refreshBrands$
      .subscribe(() => {
        this.getAllBrands();
      });
    // GET PAGE FROM QUERY PARAM
    this.subAcRoute = this.activatedRoute.queryParams.subscribe(qParam => {
      if (qParam && qParam.page) {
        this.currentPage = qParam.page;
      } else {
        this.currentPage = 1;
      }
      this.getAllBrands();
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
        message: 'Are you sure you want delete this category?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deleteBrand(data);
      }
    });
  }

  public openConfirmUploadDialog(data: ProductBrand[]) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Import Data!',
        message: 'Warning! All the existing data will be replace'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.insertManyBrand(data);
      }
    });
  }

  /**
   * HTTP REQ HANDLE
   */

  private getAllBrands() {
    this.brandService.getAllBrands()
      .subscribe(res => {
        this.brands = res.data;
      }, error => {
        console.log(error);
      });
  }
  private insertManyBrand(data: ProductBrand[]) {
    this.spinner.show();
    this.brandService.insertManyBrand(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshBrands$();
        this.spinner.hide();
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }

  /**
   * DELETE METHOD HERE
   */
  private deleteBrand(id: string) {
    this.brandService.deleteBrand(id)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshBrands$();
      }, error => {
        console.log(error);
      });
  }

  /**
   * PAGINATION CHANGE
   */
  public onPageChanged(event: any) {
    this.router.navigate([], {queryParams: {page: event}});
  }

  /**
   * IMPORT EXCEL DATA
   * FILE CHANGE EVENT
   */

  onFileChange(ev) {
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    if (this.dataTypeFormat === 'excel') {
      reader.onload = (event) => {
        const data = reader.result;
        workBook = XLSX.read(data, {type: 'binary'});
        jsonData = workBook.SheetNames.reduce((initial, name) => {
          const sheet = workBook.Sheets[name];
          initial[name] = XLSX.utils.sheet_to_json(sheet);
          return initial;
        }, {});

        // Modify Attributes
        const allData = jsonData.brands;
        const mData: ProductBrand[] = allData.map(m => {
          const dataNameFieldString = m.brandName.toString().trim();
          return {
            ...m,
            ...{brandSlug: this.utilsService.transformToSlug(dataNameFieldString)},
          } as ProductBrand;
        });
        this.openConfirmUploadDialog(mData);
      };
      reader.readAsBinaryString(file);
    } else {
      reader.readAsText(file, 'UTF-8');
      reader.onload = () => {
        const brands = JSON.parse(reader.result.toString());
        const mBrands: ProductBrand[] = brands.map(m => {
          return {
            _id: m._id ? m._id : null,
            readOnly: m.readOnly ? m.readOnly : false,
            brandName: m.brandName,
            brandSlug: m.brandSlug,
            image: m.image,
          } as ProductBrand;
        });
        this.openConfirmUploadDialog(mBrands);
      };
      reader.onerror = (error) => {
        console.log(error);
      };
    }
  }

  exportDataToFile() {
    if (this.dataTypeFormat === 'json') {
      this.exportAsAJson();
    } else {
      this.exportToExcel();
    }
  }

  /**
   * EXPORTS TO EXCEL
   */
  exportToExcel() {
    this.spinner.show();
    this.brandService.getAllBrands()
      .subscribe(res => {
        const allData = res.data as ProductBrand[];
        const date = this.utilsService.getDateString(new Date());
        // EXPORT XLSX
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(allData);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'brands');
        XLSX.writeFile(wb, `Brands_Backup_${date}.xlsx`);
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  /**
   * DOWNLOADABLE JSON
   */
  exportAsAJson() {
    this.brandService.getAllBrands()
      .subscribe(res => {
        const allData = res.data as ProductBrand[];

        const blob = new Blob([JSON.stringify(allData, null, 2)], {type: 'application/json'});
        this.dialog.open(DownloadJsonDialogComponent, {
          maxWidth: '500px',
          data: {
            blobUrl: window.URL.createObjectURL(blob),
            backupType: 'brands'
          }
        });
      }, error => {
        console.log(error);
      });

  }


  /**
   * ON DESTROY
   */
  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy() {
    if (this.subAcRoute) {
      this.subAcRoute.unsubscribe();
    }
  }
}
