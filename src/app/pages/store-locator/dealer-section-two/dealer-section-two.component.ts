import { Component, Input, OnInit } from '@angular/core';
import { StoreInfo } from 'src/app/interfaces/store-info';

@Component({
  selector: 'app-dealer-section-two',
  templateUrl: './dealer-section-two.component.html',
  styleUrls: ['./dealer-section-two.component.scss']
})
export class DealerSectionTwoComponent implements OnInit {

  @Input() stores: StoreInfo[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
