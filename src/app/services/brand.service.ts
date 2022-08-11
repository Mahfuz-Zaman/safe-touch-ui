import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Brand} from '../interfaces/brand';
import {ProductBrand} from '../interfaces/product-brand';

const API_BRAND = environment.apiBaseLink + '/api/brand/';
const API_URL_TOP_BRAND = environment.apiBaseLink + '/api/top-brands/';
const API_URL_OTHER_BRAND = environment.apiBaseLink + '/api/top-brands/';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor(
    private httpClient: HttpClient,
    private router: Router,
  ) {
  }

  /**
   * BRAND
   */
  addBrand(data: ProductBrand) {
    return this.httpClient.post<{message: string}>(API_BRAND + 'add-brand', data);
  }
  insertManyBrand(data: ProductBrand[]) {
    return this.httpClient.post<{message: string}>(API_BRAND + 'add-multiple-brand', data);
  }
  getAllBrands() {
    return this.httpClient.get<{data: ProductBrand[], message?: string}>(API_BRAND + 'get-all-brands');
  }

  getBrandByBrandID(id: string) {
    return this.httpClient.get<{data: ProductBrand, message?: string}>(API_BRAND + 'get-brand-by-brand-id/' + id);
  }
  editBrandData(data: ProductBrand) {
    return this.httpClient.put<{message?: string}>(API_BRAND + 'edit-brand-by-brand', data);
  }

  getBrandBySearch(id: string) {
    return this.httpClient.get<{data: ProductBrand, message?: string}>(API_BRAND + 'get-brand-by-search/' + id);
  }

  deleteBrand(id: string) {
    return this.httpClient.delete<{message?: string}>(API_BRAND + 'delete-brand-by-id/' + id);
  }


  /**
   * Additional BRAND
   */

  getAllPromotionalBrands() {
    return this.httpClient.get<{ data: Brand[] }>(API_URL_TOP_BRAND + 'get-all-promotional-brands/');
  }

  getAllOtherBrands() {
    return this.httpClient.get<{ data: Brand[], count: number }>(API_URL_OTHER_BRAND + 'get-all-brands/');
  }

}
