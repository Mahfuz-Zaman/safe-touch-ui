import {Component, Input, OnInit} from '@angular/core';
import {FlashSale} from '../../../interfaces/flash-sale';

@Component({
  selector: 'app-deal-of-day-card',
  templateUrl: './deal-of-day-card.component.html',
  styleUrls: ['./deal-of-day-card.component.scss']
})
export class DealOfDayCardComponent implements OnInit {

  @Input() data: any;

  constructor() { }

  ngOnInit(): void {
  }

}
