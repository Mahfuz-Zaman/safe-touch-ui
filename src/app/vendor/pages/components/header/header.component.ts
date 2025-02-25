import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {VendorService} from '../../../../services/vendor.service';
import {Vendor} from '../../../../interfaces/vendor';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() sidenavNavToggle = new EventEmitter();

  vendorBaseUrl = environment.vendorBaseUrl;

  vendorData: Vendor = null;

  constructor(
    private vendorService: VendorService
  ) {
  }

  ngOnInit() {
    this.getUserData();
  }


  onToggleSidenav() {
    this.sidenavNavToggle.emit();
  }

  adminLogOut() {
    this.vendorService.vendorLogOut();
  }

  /**
   * HTTP Requested Data
   */
  private getUserData() {
    this.vendorService.getLoggedInVendor('phoneNo shopName vendorName username email')
      .subscribe(res => {
        this.vendorData = res.data;
      });
  }
}
