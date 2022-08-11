import {Component, Input, OnInit} from '@angular/core';
import {interval, Subscription} from 'rxjs';
import {UtilsService} from '../../../services/utils.service';

@Component({
  selector: 'app-time-counter-one',
  templateUrl: './time-counter-one.component.html',
  styleUrls: ['./time-counter-one.component.scss']
})
export class TimeCounterOneComponent implements OnInit {

  private subscription: Subscription;

  @Input() endDate: Date;

  public dateNow = new Date();
  public dDay = new Date('Jul 24 2021 00:00:00');
  milliSecondsInASecond = 1000;
  hoursInADay = 24;
  minutesInAnHour = 60;
  SecondsInAMinute = 60;

  public timeDifference;
  public secondsToDday;
  public minutesToDday;
  public hoursToDday;
  public daysToDday;


  private getTimeDifference() {
    this.timeDifference = this.dDay.getTime() - new Date().getTime();
    this.allocateTimeUnits(this.timeDifference);
  }

  private allocateTimeUnits(timeDifference) {
    this.secondsToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute);
    this.minutesToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute);
    this.hoursToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay);
    this.daysToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute * this.hoursInADay));
  }


  constructor(
    private utilsService: UtilsService
  ) {
  }

  ngOnInit() {
    console.log('Here', this.endDate);
    if (this.endDate) {
      const f = this.utilsService.getDateString(this.endDate);
      this.dDay = new Date(f);
      this.subscription = interval(1000)
        .subscribe(x => {
          this.getTimeDifference();
        });
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
