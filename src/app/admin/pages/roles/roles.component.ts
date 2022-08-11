import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import {AdminDataService} from '../../../services/admin-data.service';
import {ReloadService} from '../../../services/reload.service';
import {UiService} from '../../../services/ui.service';
import {AdminRole} from '../../../interfaces/admin-role';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-users',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {

  // Store Data
  adminRoles: AdminRole[] = [];


  constructor(
    private dialog: MatDialog,
    private adminDataService: AdminDataService,
    private reloadService: ReloadService,
    private uiService: UiService,
    private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit(): void {
    this.reloadService.refreshRoles$.subscribe(() => {
      this.getRolesData();
    });
    this.getRolesData();
  }

  /**
   * HTTP REQ HANDLE
   */
  private getRolesData() {
    this.spinner.show();
    this.adminDataService.getRolesData()
      .subscribe(res => {
        this.spinner.hide();
        this.adminRoles = res.data;
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  private deleteAdminRoleById(id: string) {
    this.spinner.show();
    this.adminDataService.deleteAdminRoleById(id)
      .subscribe(res => {
        this.spinner.hide();
        this.uiService.success(res.message);
        this.reloadService.needRefreshRoles$();
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }


  /**
   * COMPONENT DIALOG VIEW
   */
  public openConfirmDialog(data?: AdminRole) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want delete this role?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deleteAdminRoleById(data._id);
      }
    });
  }
}
