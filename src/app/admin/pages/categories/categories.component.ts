import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import {CategoryService} from '../../../services/category.service';
import {ProductCategory} from '../../../interfaces/product-category';
import {UiService} from '../../../services/ui.service';
import {ReloadService} from '../../../services/reload.service';
import {Subscription} from 'rxjs';
import * as XLSX from 'xlsx';
import {DownloadJsonDialogComponent} from '../../../shared/dialog-view/download-json-dialog/download-json-dialog.component';
import {NgxSpinnerService} from 'ngx-spinner';
import {UtilsService} from '../../../services/utils.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  // Subscriptions
  private subAcRoute: Subscription;

  // Demo list of parent categories
  categories: ProductCategory[] = [];

  // Pagination
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 24;
  totalProductsStore = 0;

  // DOWNLOADABLE
  dataTypeFormat = 'json';

  constructor(
    private dialog: MatDialog,
    private categoryService: CategoryService,
    private uiService: UiService,
    private reloadService: ReloadService,
    private spinner: NgxSpinnerService,
    private utilsService: UtilsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.reloadService.refreshCategories$
      .subscribe(() => {
        this.getAllCategory();
      });
    // GET PAGE FROM QUERY PARAM
    this.subAcRoute = this.activatedRoute.queryParams.subscribe(qParam => {
      if (qParam && qParam.page) {
        this.currentPage = qParam.page;
      } else {
        this.currentPage = 1;
      }
      this.getAllCategory();
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
        this.deleteCategory(data);
      }
    });
  }

  public openConfirmUploadDialog(data: ProductCategory[]) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Import Data!',
        message: 'Warning! All the existing data will be replace'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.insertManyCategory(data);
      }
    });
  }


  /**
   * HTTP REQ HANDLE
   */

  private getAllCategory() {
    this.categoryService.getAllCategory()
      .subscribe(res => {
        console.log(res);
        this.categories = res.data;
      }, error => {
        console.log(error);
      });
  }

  private insertManyCategory(data: ProductCategory[]) {
    this.spinner.show();
    this.categoryService.insertManyCategory(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshCategories$();
        this.spinner.hide();
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }


  /**
   * DELETE METHOD HERE
   */
  private deleteCategory(id: string) {
    this.categoryService.deleteCategory(id)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshCategories$();
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
        const allData = jsonData.categories;
        console.log(allData);
        const mData: ProductCategory[] = allData.map(m => {
          const dataNameFieldString = m.categoryName.toString().trim();
          return {
            ...m,
            ...{categorySlug: this.utilsService.transformToSlug(dataNameFieldString)},
            ...{attributes: m.attributes ? m.attributes.toString().trim().split('#') : null}
          } as ProductCategory;
        });
        this.openConfirmUploadDialog(mData);
      };
      reader.readAsBinaryString(file);
    } else {
      reader.readAsText(file, 'UTF-8');
      reader.onload = () => {
        const categories = JSON.parse(reader.result.toString());
        const mCategories: ProductCategory[] = categories.map(m => {
          return {
            _id: m._id ? m._id : null,
            readOnly: m.readOnly ? m.readOnly : false,
            categoryName: m.categoryName,
            categorySlug: m.categorySlug,
            priority: m.priority,
            attributes: m.attributes,
            image: m.image,
          } as ProductCategory;
        });
        this.openConfirmUploadDialog(mCategories);
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
    this.categoryService.getAllCategory()
      .subscribe(res => {
        const allData = res.data as ProductCategory[];
        const mData = allData.map(m => {
          return {
            ...m,
            attributes: m.attributes && m.attributes?.length > 0 ? this.utilsService.arrayToString(m.attributes.map(m2 => m2._id), '#') : null
          };
        });

        const date = this.utilsService.getDateString(new Date());
        // EXPORT XLSX
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mData);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'categories');
        XLSX.writeFile(wb, `Categories_Backup_${date}.xlsx`);
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
    this.categoryService.getAllCategory()
      .subscribe(res => {
        const allData = res.data as ProductCategory[];

        const blob = new Blob([JSON.stringify(allData, null, 2)], {type: 'application/json'});
        this.dialog.open(DownloadJsonDialogComponent, {
          maxWidth: '500px',
          data: {
            blobUrl: window.URL.createObjectURL(blob),
            backupType: 'categories'
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
