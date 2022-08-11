import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {Banner} from '../../interfaces/banner';
import {BannerService} from '../../services/banner.service';

@Component({
  selector: 'app-deal-on-play',
  templateUrl: './offer-products.component.html',
  styleUrls: ['./offer-products.component.scss']
})
export class OfferProductsComponent implements OnInit {

  offerProduct?: Banner = null;

  // ID
  id?: string = null;


  constructor(
    private activatedRoute: ActivatedRoute,
    private bannerService: BannerService,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(param => {
      this.id = param.get('id');
      if (this.id) {
        this.getSingleDealOnPlayById();
      }
    });
  }

  /**
   * HTTP REQ HANDLE
   */

  private getSingleDealOnPlayById() {
    this.spinner.show();
    const selectProductField = '-attributes -filterData -tags -ratingReview -discussion -warrantyServices -description';
    this.bannerService.getSingleBannerById(this.id, selectProductField)
      .subscribe(res => {
        this.offerProduct = res.data;
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }


  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy(): void {

  }

}
