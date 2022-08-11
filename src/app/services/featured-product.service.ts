import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Pagination} from '../interfaces/pagination';
import {FeaturedProduct} from '../interfaces/featured-product';

const API_FEATURED_PRODUCT = environment.apiBaseLink + '/api/featured-product/';

@Injectable({
  providedIn: 'root'
})
export class FeaturedProductService {

  constructor(
    private http: HttpClient,
  ) {
  }

  /**
   * Image Folder
   */

  addNewFeaturedProduct(data: FeaturedProduct) {
    return this.http.post<{ message: string }>(API_FEATURED_PRODUCT + 'add-new-featured-product', data);
  }


  getAllFeaturedProduct(pagination?: Pagination, queryField?: string) {
    let params = new HttpParams();
    if (pagination) {
      params = params.append('pageSize', pagination.pageSize);
      params = params.append('page', pagination.currentPage);
    }
    if (queryField) {
      params = params.append('queryField', queryField);
    }
    return this.http.get<{ data: FeaturedProduct[], count: number, message?: string }>
    (API_FEATURED_PRODUCT + 'get-all-featured-product-list', {params});
  }

  getSingleFeaturedProductById(id: string, selectProductField?: string) {
    console.log(id, selectProductField);
    let params = new HttpParams();
    if (selectProductField) {
      params = params.append('select', selectProductField);
    }
    return this.http.get<{ data: FeaturedProduct, message?: string }>(API_FEATURED_PRODUCT + 'get-featured-product-by-id/' + id, {params});
  }


  editFeaturedProduct(data: FeaturedProduct) {
    return this.http.put<{ message: string }>(API_FEATURED_PRODUCT + 'edit-featured-product-by-id', data);
  }

  deleteFeaturedProductById(id: string) {
    return this.http.delete<{ message: string }>(API_FEATURED_PRODUCT + 'delete-featured-product-by-id/' + id);
  }


}
