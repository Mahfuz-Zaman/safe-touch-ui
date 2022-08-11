import { Component, Input, OnInit } from '@angular/core';
import { NewsletterService } from 'src/app/services/newsletter.service';
import { UiService } from 'src/app/services/ui.service';
import {ShopInfo} from '../../../interfaces/shop-info';
import {ShopService} from '../../../services/shop.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  @Input() shopInfo: ShopInfo;

  email;

  socialIcons = ['fab fa-facebook-f', 'fab fa-youtube', 'fab fa-twitter', 'fab fa-instagram', 'fab fa-linkedin-in'];

  constructor(
    private shopService: ShopService,
    private newsletterService: NewsletterService,
    private uiService: UiService
  ) { }

  ngOnInit(): void {
    
  }

  /**
   * HTTP REQ HANDLE
   * GET ATTRIBUTES BY ID
   */

  public onSubmitEmail() {
    console.log(this.email);
    this.newsletterService.addNewsletter({email: this.email})
    .subscribe( res => {
      this.uiService.success(res.message);
    }, err => {
      console.log(err);
    });
  }

}