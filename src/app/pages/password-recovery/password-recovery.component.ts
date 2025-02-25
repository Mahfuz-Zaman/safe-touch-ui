import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {UiService} from '../../services/ui.service';
import {Router} from '@angular/router';
import {WindowService} from '../../services/window.service';
import {AngularFireAuth} from '@angular/fire/auth';
import firebase from 'firebase';
import {NgForm} from '@angular/forms';
import auth = firebase.auth;

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.scss']
})
export class PasswordRecoveryComponent implements OnInit, AfterViewInit, OnDestroy {

  phoneNo: string = null;
  phoneMatched = false;
  otp: string = null;
  otpMatched = false;
  password: string = null;

  // Phone Verification
  timeInstance = null;
  countDown = 0;
  windowRef: any;
  // verificationCode: string;
  public sendVerificationCode = false;
  public showVerificationCodeField = false;

  constructor(
    private userService: UserService,
    private uiService: UiService,
    private router: Router,
    private afAuth: AngularFireAuth,
    private win: WindowService,
  ) {
  }

  ngOnInit(): void {
    this.windowRef = this.win.windowRef;
  }

  ngAfterViewInit() {
    // this.windowRef.recaptchaVerifier = new auth.RecaptchaVerifier('recaptcha-container',
    //   {
    //     size: 'invisible'
    //   });

    setTimeout(() => {
      this.windowRef.recaptchaVerifier = new auth.RecaptchaVerifier('recaptcha-container',
        {
          size: 'invisible'
        });
    }, 500);


  }

  onPhoneFormSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }
    this.phoneNo = form.value.phoneNo;
    this.checkAndGetUserByPhone();
  }

  onRecoverFormSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }
    this.otp = form.value.otp;
    // this.matchOTP();
    this.verifyLoginCode();
  }

  onResetFormSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }
    this.password = form.value.password;
    this.editPassword();
  }


  /**
   * HTTP REQ HANDLE
   */

  private checkAndGetUserByPhone() {
    this.userService.checkAndGetUserByPhone(this.phoneNo)
      .subscribe(res => {
        // const status = res.data;
        const status = true;
        // const message = res.message;
        if (status) {
          // this.uiService.success(message);
          this.phoneMatched = true;
          this.sendLoginCode();
          // this.getOTP();
        } else {
          // this.uiService.warn(message);
        }
      }, error => {
        console.log(error);
      });
  }

  // private getOTP() {
  //   this.userService.otpFromApi(this.phoneNo)
  //   .subscribe( res => {
  //     this.otpFromApi = res.data;
  //   }, error => {
  //     console.log(error);
  //   });
  // }

  private editPassword() {
    console.log(this.phoneNo);
    console.log(this.password);
    // this.userService.editPassword({phoneNo: this.phoneNo, password: this.password})
    //   .subscribe(res => {
    //     this.uiService.success(res.message);
    //     this.router.navigate(['/dashboard']);
    //   }, error => {
    //     console.log(error);
    //   });
  }


  /**
   * PHONE VERIFICATION
   */

  // Send Code..
  sendLoginCode() {

    const appVerifier = this.windowRef.recaptchaVerifier;

    const finalPhoneNo = '+88' + this.phoneNo;

    this.afAuth.signInWithPhoneNumber(finalPhoneNo, appVerifier)
      .then(result => {
        this.showVerificationCodeField = true;
        // console.log('Send verification code..');
        this.sendVerificationCode = true;
        this.windowRef.confirmationResult = result;

      })
      .catch(error => {
        console.log(error);
        // console.log('Error!!!');
        this.uiService.warn(error.message);
        // console.log(error);
        // this.uiService.showToastMessage('Something went wrong! Please try again.');
      });

    this.countTime(60);
    this.showVerificationCodeField = true;

  }

  // Resent Verification Code...
  resendLoginCode() {
    clearInterval(this.timeInstance);
    this.sendLoginCode();
  }

  // Verify Code..
  verifyLoginCode() {
    this.windowRef.confirmationResult
      .confirm(this.otp)
      .then((credential) => {
        this.otpMatched = true;
        // Reset Value..
        this.showVerificationCodeField = false;
        this.sendVerificationCode = false;
        this.otp = '';
        this.windowRef.confirmationResult = null;

      })
      .catch(error => this.uiService.wrong('ERROR Code! Incorrect code entered?'));
  }

  // CountDown...
  countTime(time?) {
    const count = (num) => () => {
      this.countDown = num;
      // console.log(num);
      num = num === 0 ? 0 : num - 1;
      if (num <= 0) {
        clearInterval(this.timeInstance);
        this.countDown = 0;
      }
    };

    this.timeInstance = setInterval(count(time), 1000);
  }

  ngOnDestroy() {
    if (this.timeInstance !== null && this.timeInstance !== undefined) {
      clearInterval(this.timeInstance);
    }

    this.otpMatched = false;
  }

}
