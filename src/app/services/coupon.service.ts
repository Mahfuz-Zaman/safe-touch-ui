import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Coupon} from '../interfaces/coupon';
import {ProductBrand} from '../interfaces/product-brand';

const API_COUPON = environment.apiBaseLink + '/api/coupon/';

@Injectable({
  providedIn: 'root'
})
export class CouponService {


  constructor(
    private http: HttpClient
  ) {
  }

  /**
   * COUPON
   * Admin
   */

  addNewCoupon(data: Coupon) {
    return this.http.post<{ message: string }>(API_COUPON + 'add-coupon', data);
  }

  getAllCoupons() {
    return this.http.get<{ data: Coupon[], message: string }>(API_COUPON + 'get-all-coupons');
  }

  getCouponCouponId(id: string) {
    return this.http.get<{data: Coupon, message?: string}>(API_COUPON + 'get-coupon-by-coupon-id/' + id);
  }

  deleteCoupon(id: string) {
    return this.http.delete<{ message: string }>(API_COUPON + 'delete-coupon-by-id/' + id);
  }

  editCouponData(data: Coupon) {
    return this.http.put<{ message: string }>(API_COUPON + 'edit-coupon', data);
  }

  /**
   * COUPON
   * User
   */

  checkCoupon(couponCode: string) {
    return this.http.get<{ data: Coupon, message: string }>(API_COUPON + 'use-coupon/' + couponCode);
  }

  useCoupon(couponId: string) {
    return this.http.put<{ message: string }>(API_COUPON + 'coupon-used/', {couponId});
  }


}

