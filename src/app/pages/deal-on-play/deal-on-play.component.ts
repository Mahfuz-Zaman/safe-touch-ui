import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DealOnPlayService} from '../../services/deal-on-play.service';
import {DealOnPlay} from '../../interfaces/deal-on-play';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-deal-on-play',
  templateUrl: './deal-on-play.component.html',
  styleUrls: ['./deal-on-play.component.scss']
})
export class DealOnPlayComponent implements OnInit {

  dealOnPlay?: DealOnPlay = null;

  // ID
  id?: string = null;


  constructor(
    private activatedRoute: ActivatedRoute,
    private dealOnPlayService: DealOnPlayService,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(param => {
      this.id = param.get('id');
      if (this.id) {
        this.getSingleDealOnPlayById();
      }
    })
  }


  /**
   * HTTP REQ HANDLE
   */

  private getSingleDealOnPlayById() {
    this.spinner.show();
    const selectProductField = '-attributes -filterData -tags -ratingReview -discussion -warrantyServices -description';
    this.dealOnPlayService.getSingleDealOnPlayById(this.id, selectProductField)
      .subscribe(res => {
        this.dealOnPlay = res.data;
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }


  ngOnDestroy(): void {

  }

}
