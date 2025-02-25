import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {UiService} from '../../../services/ui.service';
import {TagService} from '../../../services/tag.service';
import {ShopInfo} from '../../../interfaces/shop-info';
import {ShopService} from '../../../services/shop.service';
import {Select} from '../../../interfaces/select';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-footer-info',
  templateUrl: './shop-info.component.html',
  styleUrls: ['./shop-info.component.scss']
})
export class ShopInfoComponent implements OnInit {


  dataForm?: FormGroup;
  addressesDataArray?: FormArray;
  emailsDataArray?: FormArray;
  phonesDataArray?: FormArray;
  downloadsUrlsArray?: FormArray;
  socialLinksArray?: FormArray;


  shopInfo: ShopInfo;
  isLoading = false;

  // Store Data from param
  id?: string;

  // Dummy Data
  downloadTypes: Select[] = [
    {value: 0, viewValue: 'Play Store'},
    {value: 1, viewValue: 'App Store'}
  ];

  socialTypes: Select[] = [
    {value: 0, viewValue: 'Facebook'},
    {value: 1, viewValue: 'YouTube'},
    {value: 2, viewValue: 'Twitter'},
    {value: 3, viewValue: 'Instagram'},
    {value: 4, viewValue: 'LinkedIn'}
  ];

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private uiService: UiService,
    private tagService: TagService,
    private router: Router,
    private shopService: ShopService,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    // INIT FORM
    this.initFormGroup();

    // GET DATA
    this.getShopInfo();

  }


  /**
   * INIT FORM
   */
  private initFormGroup() {

    this.dataForm = this.fb.group({
      siteName: [null, Validators.required],
      shortDescription: [null],
      navLogo: [null],
      footerLogo: [null],
      othersLogo: [null],
      addresses: this.fb.array([]),
      emails: this.fb.array([]),
      phones: this.fb.array([]),
      downloadUrls: this.fb.array([]),
      socialLinks: this.fb.array([]),
    });

    this.addressesDataArray = this.dataForm.get('addresses') as FormArray;
    this.emailsDataArray = this.dataForm.get('emails') as FormArray;
    this.phonesDataArray = this.dataForm.get('phones') as FormArray;
    this.downloadsUrlsArray = this.dataForm.get('downloadUrls') as FormArray;
    this.socialLinksArray = this.dataForm.get('socialLinks') as FormArray;

  }


  /**
   * FORM ARRAY BUILDER
   */
  onAddNewShopObject(formControl: string) {
    const f = this.fb.group({
      type: [null],
      value: [null, Validators.required]
    });
    (this.dataForm?.get(formControl) as FormArray).push(f);
  }

  /**
   * REMOVE FORM BUILDER OBJECT
   */
  removeFormArrayField(formControl: string, index: number) {
    let formDataArray: FormArray;
    switch (formControl) {
      case 'addresses': {
        formDataArray = this.addressesDataArray;
        break;
      }
      case 'emails': {
        formDataArray = this.emailsDataArray;
        break;
      }
      case 'phones': {
        formDataArray = this.phonesDataArray;
        break;
      }
      case 'downloadUrls': {
        formDataArray = this.downloadsUrlsArray;
        break;
      }
      case 'socialLinks': {
        formDataArray = this.socialLinksArray;
        break;
      }
      default: {
        formDataArray = null;
        break;
      }
    }
    formDataArray?.removeAt(index);
  }


  /**
   * SET DATA
   */
  private setData() {
    this.shopInfo.addresses.map(m => {
      const f = this.fb.group({
        type: [m.type],
        value: [m.value, Validators.required],
      });
      (this.dataForm?.get('addresses') as FormArray).push(f);
    });

    this.shopInfo.emails.map(m => {
      const f = this.fb.group({
        type: [m.type],
        value: [m.value, Validators.required],
      });
      (this.dataForm?.get('emails') as FormArray).push(f);
    });

    this.shopInfo.phones.map(m => {
      const f = this.fb.group({
        type: [m.type],
        value: [m.value, Validators.required],
      });
      (this.dataForm?.get('phones') as FormArray).push(f);
    });

    this.shopInfo.downloadUrls.map(m => {
      const f = this.fb.group({
        type: [m.type],
        value: [m.value, Validators.required],
      });
      (this.dataForm?.get('downloadUrls') as FormArray).push(f);
    });

    this.shopInfo.socialLinks.map(m => {
      const f = this.fb.group({
        type: [m.type],
        value: [m.value, Validators.required],
      });
      (this.dataForm?.get('socialLinks') as FormArray).push(f);
    });


    this.dataForm.patchValue(this.shopInfo);
  }


  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required fields');
      return;
    }

    if (this.shopInfo) {
      const finalData = {...this.dataForm.value, ...{_id: this.shopInfo._id}};
      this.updateShopInfo(finalData);
    } else {
      this.addShopInfo(this.dataForm.value);
    }

  }


  /**
   * HTTP REQ HANDLE
   * GET ATTRIBUTES BY ID
   */

  private addShopInfo(data: any) {
    this.spinner.show();
    this.shopService.addShopInfo(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
        console.log(err);
      });
  }


  private getShopInfo() {
    this.spinner.show();
    this.shopService.getShopInfo()
      .subscribe(res => {
        this.shopInfo = res.data;
        if (this.shopInfo) {
          this.setData();
        }
        this.spinner.hide();

      }, err => {
        this.spinner.hide();
        console.log(err);
      });
  }


  private updateShopInfo(data: ShopInfo) {
    this.spinner.show();
    this.shopService.updateShopInfo(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
        console.log(err);
      });
  }


}
