import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CustomizationService} from '../../services/customization.service';

@Component({
  selector: 'app-extra-page-view',
  templateUrl: './additional-page-view.component.html',
  styleUrls: ['./additional-page-view.component.scss']
})
export class AdditionalPageViewComponent implements OnInit {

  html: string = '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d228.24261120780326!2d90.38189372680377!3d23.751594820762854!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDQ1JzA2LjIiTiA5MMKwMjInNTQuOSJF!5e0!3m2!1sen!2sbd!4v1627219620012!5m2!1sen!2sbd"width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>'

  slug: string = null;
  pageInfo: any = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private customizationService: CustomizationService,
  ) {
  }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(param => {
      this.slug = param.get('pageSlug');
      this.getPageInfo();
    });

  }


  private getPageInfo() {
    this.customizationService.getPageInfoBySlug(this.slug)
      .subscribe(res => {
        this.pageInfo = res.data;
        console.log(this.pageInfo);
      }, error => {
        console.log(error);
      });
  }


}
