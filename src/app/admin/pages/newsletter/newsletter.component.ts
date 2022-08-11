import {Component, OnInit} from '@angular/core';
import {NewsletterService} from '../../../services/newsletter.service';
import {Newsletter} from '../../../interfaces/newsletter';
import {ReloadService} from '../../../services/reload.service';
import {MatDialog} from '@angular/material/dialog';
import {UiService} from '../../../services/ui.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import {Pagination} from '../../../interfaces/pagination';

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.scss']
})
export class NewsletterComponent implements OnInit {

  public newsletters: Newsletter[] = [];
  holdPrevData: Newsletter[] = [];

  // Pagination
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 48;

  constructor(
    private reloadService: ReloadService,
    private dialog: MatDialog,
    private uiService: UiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private newsletterService: NewsletterService,
  ) {
  }

  ngOnInit(): void {
    this.reloadService.refreshNewsletter$.subscribe(() => {
      this.getNewsletters();
    });

    this.activatedRoute.queryParams.subscribe(qParam => {
      if (qParam && qParam.page) {
        this.currentPage = qParam.page;
      } else {
        this.currentPage = 1;
      }
      this.getNewsletters();
    });
  }

  public remove(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Action',
        message: 'Are you sure you want remove this data?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deleteNewsletter(id);
      }
    });
  }

  /**
   * HTTP REQ HANDLE
   */
  private getNewsletters() {
    this.spinner.show();
    const pagination: Pagination = {
      pageSize: this.productsPerPage.toString(),
      currentPage: this.currentPage.toString()
    };
    this.newsletterService.getNewsletters(pagination)
      .subscribe(res => {
        this.newsletters = res.data;
        this.holdPrevData = res.data;
        this.totalProducts = res.count;
        this.spinner.hide();
      }, error => {
        console.log(error);
      });
  }

  private deleteNewsletter(id: string) {
    this.newsletterService.deleteNewsletter(id)
      .subscribe(res => {
        this.reloadService.needRefreshNewsletter$();
        this.uiService.success(res.message);
      }, error => {
        console.log(error);
      });
  }

  /**
   * NGX PAGINATION CHANGED
   */

  public onPageChanged(event) {
    this.router.navigate([], {queryParams: {page: event}});
    this.getPageFromQueryParam();
  }

  private getPageFromQueryParam() {
    setTimeout(() => {
      this.activatedRoute.queryParams.subscribe(param => {
        this.currentPage = param.page;
        window.scrollTo(0, 0);
      });
    }, 200);
  }

}
