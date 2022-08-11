import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserDataService} from '../../../services/user-data.service';
import {UiService} from '../../../services/ui.service';
import {ReloadService} from '../../../services/reload.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UtilsService} from '../../../services/utils.service';
import {User} from '../../../interfaces/user';

@Component({
  selector: 'app-edit-basic-info',
  templateUrl: './edit-basic-info.component.html',
  styleUrls: ['./edit-basic-info.component.scss']
})
export class EditBasicInfoComponent implements OnInit {


  public formData: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userDataService: UserDataService,
    private uiService: UiService,
    private reloadService: ReloadService,
    public dialogRef: MatDialogRef<EditBasicInfoComponent>,
    public utilsService: UtilsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  ngOnInit(): void {

    this.formData = this.fb.group({
      fullName: [null, Validators.required],
      phoneNo: [null, Validators.required],
      email: [null, Validators.required],
      secondaryPhoneNo: null,
      gender: null,
      dateOfBirth: null,
      occupation: null,
      organization: null
    });

    this.setFormData();

  }

  private setFormData() {
    // this.formData.patchValue(this.data);
  }

  /**
   * ON SUBMIT FORM
   */

  onSubmit() {
    // const finalData: User = {
    //   fullName: this.formData.value.fullName,
    //   phoneNo: this.formData.value.phoneNo,
    //   email: this.formData.value.email,
    //   secondaryPhoneNo: this.formData.value.secondaryPhoneNo,
    //   gender: this.formData.value.gender,
    //   dateOfBirth: this.utilsService.getDateWithCurrentTime(this.formData.value.dateOfBirth),
    //   occupation: this.formData.value.occupation,
    //   organization: this.formData.value.organization
    // }

    // if (this.data) {
    //   finalData._id = this.data._id;
    // }

    // console.log(finalData);
    // this.editLoggedInUserData(finalData);
  }

  editLoggedInUserData(data: User) {
    // this.userDataService.editLoggedInUserData(data)
    //   .subscribe((res) => {
    //     this.uiService.success(res.message);
    //     this.reloadService.needRefreshUser$();
    //     this.dialogRef.close();
    //     // this.matDialog.closeAll();
    //   }, error => {
    //     console.log(error);
    //   });
  }
}
