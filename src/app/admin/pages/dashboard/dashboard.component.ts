import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DataService} from '../../../services/data.service';
import {AdminService} from '../../../services/admin.service';
import {AdminDataService} from '../../../services/admin-data.service';
import {StoredDataService} from '../../../services/stored-data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {


  constructor(
    private router: Router,
    private dataService: DataService,
    private adminService: AdminService,
    private storedDataService: StoredDataService,
  ) {
  }

  ngOnInit() {
    console.log('Iam here');
    // Access Control Checker
    const hasAccess = this.storedDataService.checkRoleAccess(this.router.url);
    console.log('<<<<<<<<HAS ACCESS >>>>>>>>>> ' + hasAccess);
    // if (!hasAccess) {
    //   this.router.navigate(['/']);
    //   return;
    // }

    this.getUserData();
    // this.countsCollectionsDocuments();
  }


  /**
   * HTTP REQ HANDLE
   */

  // private countsCollectionsDocuments() {
  //   this.dataService.countsCollectionsDocuments()
  //     .subscribe(res => {
  //       this.counts = res.data;
  //     }, error => {
  //       console.log(error);
  //     });
  // }

  /**
   * HTTP Requested Data
   */
  private getUserData() {
    this.adminService.getAdminShortData()
      .subscribe(res => {
        console.log(res.data);
      });
  }

}
