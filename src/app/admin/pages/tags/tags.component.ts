import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import {ProductTag} from '../../../interfaces/product-tag';
import {TagService} from '../../../services/tag.service';
import {Pagination} from '../../../interfaces/pagination';
import {UiService} from '../../../services/ui.service';
import {ReloadService} from '../../../services/reload.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {Subscription} from 'rxjs';
import {UtilsService} from '../../../services/utils.service';
import {ActivatedRoute, Router} from '@angular/router';
import * as XLSX from 'xlsx';
import {DownloadJsonDialogComponent} from '../../../shared/dialog-view/download-json-dialog/download-json-dialog.component';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {
  // Subscriptions
  private subAcRoute: Subscription;

  // DOWNLOADABLE
  dataTypeFormat = 'json';

  // Pagination
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 24;
  totalProductsStore = 0;

  tags: ProductTag[] = [];

  constructor(
    private dialog: MatDialog,
    private tagService: TagService,
    private uiService: UiService,
    private reloadService: ReloadService,
    private spinner: NgxSpinnerService,
    private utilsService: UtilsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.reloadService.refreshTags$
      .subscribe(() => {
        this.getAllTags();
      });
    // GET PAGE FROM QUERY PARAM
    this.subAcRoute = this.activatedRoute.queryParams.subscribe(qParam => {
      if (qParam && qParam.page) {
        this.currentPage = qParam.page;
      } else {
        this.currentPage = 1;
      }
      this.getAllTags();
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
        console.log('Data should be deleted');
        this.deleteTag(data);
      }
    });
  }

  public openConfirmUploadDialog(data: ProductTag[]) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Import Data!',
        message: 'Warning! All the existing data will be replace'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.insertManyAttribute(data);
      }
    });
  }

  /**
   * HTTP REQ HANDLE
   */

  private getAllTags() {
    this.spinner.show();
    const pagination: Pagination = {
      currentPage: String(1),
      pageSize: String(50)
    };
    this.tagService.getAllTagList(pagination)
      .subscribe(res => {
        this.tags = res.data;
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  private insertManyAttribute(data: ProductTag[]) {
    this.spinner.show();
    this.tagService.insertManyTag(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshTags$();
        this.spinner.hide();
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }

  /**
   * DELETE METHOD HERE
   */
  private deleteTag(id: string) {
    this.spinner.show();
    this.tagService.deleteTag(id)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshTags$();
        this.spinner.hide();
      }, error => {
        console.log(error);
        this.spinner.hide();
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
        // const dataString = JSON.stringify(jsonData) as any;

        // Modify Attributes
        const tags = jsonData.tags;
        const mTags: ProductTag[] = tags.map(m => {
          const tagNameString = m.tagName.toString().trim();
          return {
            ...m,
            ...{tagSlug: this.utilsService.transformToSlug(tagNameString)},
          } as ProductTag;
        });
        this.openConfirmUploadDialog(mTags);
      };
      reader.readAsBinaryString(file);
    } else {
      reader.readAsText(file, 'UTF-8');
      reader.onload = () => {
        const tags = JSON.parse(reader.result.toString());
        const mTags: ProductTag[] = tags.map(m => {
          return {
            _id: m._id ? m._id : null,
            tagName: m.tagName,
            tagSlug: m.tagSlug,
          } as ProductTag;
        });
        this.openConfirmUploadDialog(mTags);
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
    this.tagService.getAllTags()
      .subscribe(res => {
        const allData = res.data as ProductTag[];
        const date = this.utilsService.getDateString(new Date());
        // EXPORT XLSX
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(allData);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'tags');
        XLSX.writeFile(wb, `Tags_Backup_${date}.xlsx`);
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
    this.tagService.getAllTags()
      .subscribe(res => {
        const allData = res.data as ProductTag[];

        const blob = new Blob([JSON.stringify(allData, null, 2)], {type: 'application/json'});
        this.dialog.open(DownloadJsonDialogComponent, {
          maxWidth: '500px',
          data: {
            blobUrl: window.URL.createObjectURL(blob),
            backupType: 'tags'
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
