import { Component, OnInit } from '@angular/core';
import {DealsOfTheDay} from '../../interfaces/deals-of-the-day';
import {DealsOfTheDayService} from '../../services/deals-of-the-day.service';
import {DealOnPlay} from '../../interfaces/deal-on-play';
import {DealOnPlayService} from '../../services/deal-on-play.service';
import {Product} from '../../interfaces/product';

@Component({
  selector: 'app-offer-view',
  templateUrl: './offer-view.component.html',
  styleUrls: ['./offer-view.component.scss']
})
export class OfferViewComponent implements OnInit {

  allDealsOfTheDay: DealsOfTheDay[] = [];
  dealOnPlay: DealOnPlay[] = [];
  dealOnPlayProducts: Product[] = [];

  constructor(
    private dealsOfTheDayService: DealsOfTheDayService,
    private dealOnPlayService: DealOnPlayService,
  ) { }

  ngOnInit(): void {
    this.getAllDealsOfTheDay();
    this.getAllDealOnPLay();
  }

  /**
   * HTTP REQ
   */
  private getAllDealsOfTheDay() {
    this.dealsOfTheDayService.getAllDealsOfTheDay()
      .subscribe(res => {
        this.allDealsOfTheDay = res.data;
      }, error => {
        console.log(error);
      });
  }

  private getAllDealOnPLay() {
    this.dealOnPlayService.getAllDealOnPlay()
      .subscribe(res => {
        this.dealOnPlay = res.data;
        if (this.dealOnPlay && this.dealOnPlay.length) {
         this.dealOnPlay.forEach((f) => {
           if (f.products && f.products.length > 0) {
             f.products.forEach((f2) => {
               this.dealOnPlayProducts.push(f2 as Product);
             });
           }
         });
        }
        console.log(this.dealOnPlayProducts);
      }, error => {
        console.log(error);
      });
  }



}
