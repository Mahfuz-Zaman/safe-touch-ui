import {Component, OnInit} from '@angular/core';
import localeBn from '@angular/common/locales/bn';
import {AdminService} from './services/admin.service';
import {Router} from '@angular/router';
import {UserService} from './services/user.service';
import {registerLocaleData} from '@angular/common';
import { VendorService } from './services/vendor.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private adminService: AdminService,
    private userService: UserService,
    private vendorService: VendorService,
    private router: Router
  ) {
    registerLocaleData(localeBn, 'bn');
    this.userService.autoUserLoggedIn();
    this.adminService.autoAdminLoggedIn();
    this.vendorService.autoVendorLoggedIn();
  }

  ngOnInit(): void {
    // this.router.events.subscribe((evt) => {
    //   if (!(evt instanceof NavigationEnd)) {
    //     return;
    //   }
    //   window.scrollTo(0, 0);
    // });
  }


}
