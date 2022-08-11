import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Vendor} from '../interfaces/vendor';
import { VendorPayment } from '../interfaces/vendor-payment';

const API_VENDOR_PAYMENT = environment.apiBaseLink + '/api/vendor-payment/';


@Injectable({
  providedIn: 'root'
})
export class VendorPaymentService {

  constructor(
    private httpClient: HttpClient
  ) {
  }


  // getAllVendorPaymentByVendorId(id: string) {
  //   return this.httpClient.get<{ data: Vendor[], message: string }>(API_VENDOR_PAYMENT + 'get-all-vendor-list/' + id);
  // }

  makeVendorPayment(data: any) {
    return this.httpClient.post<{ data?: Vendor[], message: string }>(API_VENDOR_PAYMENT + 'make-vendor-payment', data);
  }

  // getVendorsByFilter(query: any) {
  //   return this.httpClient.post<{ data: Vendor[], message: string }>(API_VENDOR_PAYMENT + 'get-vendor-list-by-filter', query);
  // }

  changePaymentStatusById(data: any) {
    return this.httpClient.post<{ message: string }>(API_VENDOR_PAYMENT + 'update-payment-status', data);
  }

  getVendorPayments(id: string) {
    console.log(id);
    return this.httpClient.get<{ data?: VendorPayment[], message: string }>(API_VENDOR_PAYMENT + 'get-vendor-payments/' + id);
  }

}
