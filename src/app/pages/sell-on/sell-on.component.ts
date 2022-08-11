import { Component, OnInit } from '@angular/core';
import {CarouselCtrService} from '../../services/carousel-ctr.service';
import SwiperCore, {Navigation} from 'swiper';

// install Swiper modules
SwiperCore.use([Navigation]);

@Component({
  selector: 'app-sell-on',
  templateUrl: './sell-on.component.html',
  styleUrls: ['./sell-on.component.scss']
})
export class SellOnComponent implements OnInit {

  constructor(
    public carouselCtrService: CarouselCtrService
  ) { }

  ngOnInit(): void {
  }

}
