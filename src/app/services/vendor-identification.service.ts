import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {VendorIdentification} from '../interfaces/vendor-identification';

const API_VENDOR_IDENTIFICATION = environment.apiBaseLink + '/api/vendor-identification/';

@Injectable({
  providedIn: 'root'
})
export class VendorIdentificationService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * FooterData
   */

  addVendorIdentificationData(data: VendorIdentification) {

    console.log(data);
    return this.httpClient.post<{ message: string }>(API_VENDOR_IDENTIFICATION + 'add-vendor-identification-data', data);

  }

  getVendorIdentificationData() {
    return this.httpClient.get<{ data: VendorIdentification, message?: string }>(API_VENDOR_IDENTIFICATION + 'get-vendor-identification-data');
  }

  updateVendorIdentificationData(data: VendorIdentification) {
    return this.httpClient.put<{ message: string }>(API_VENDOR_IDENTIFICATION + 'update-vendor-identification-data', data);
  }


}
