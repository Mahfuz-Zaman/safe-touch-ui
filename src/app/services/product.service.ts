import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import { Product } from '../interfaces/product';
import {Pagination} from '../interfaces/pagination';
import {ImageGallery} from '../interfaces/image-gallery';
import {ProductFilter} from '../interfaces/product-filter';

const API_PRODUCT = environment.apiBaseLink + '/api/product/';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private http: HttpClient
  ) {
  }

  /**
   * PRODUCT
   */

  addSingleProduct(data: any) {
    return this.http.post<{ message: string }>(API_PRODUCT + 'add-single-product', data);
  }

  insertManyProduct(data: any[]) {
    return this.http.post<{ message: string }>(API_PRODUCT + 'add-multiple-products', data);
  }

  getAllProducts(paginate: Pagination, filter?: ProductFilter) {
    return this.http.post<{ data: Product[], priceRange: any, count: number, message: string }>(API_PRODUCT + 'get-all-products', {paginate, filter});
  }
  getVendorProducts(filter?: ProductFilter) {
    return this.http.post<{ data: Product[], priceRange: any, count: number, message: string }>(API_PRODUCT + 'get-all-products', {filter});
  }

  getSingleProductBySlug(slug: string) {
    return this.http.get<{ data: any, message: string }>(API_PRODUCT + 'get-single-product-by-slug/' + slug);
  }

  getSingleProductById(id: string) {
    return this.http.get<{ data: any, message: string }>(API_PRODUCT + 'get-single-product-by-id/' + id);
  }

  editProductById(data: any) {
    return this.http.put<{ message: string }>(API_PRODUCT + 'edit-product-by-id', data);
  }

  deleteProductById(id: string) {
    return this.http.delete<{ message: string }>(API_PRODUCT + 'delete-product-by-id/' + id);
  }

  getRelatedProducts(data: any) {
    return this.http.get<{ data: any, message: string }>(API_PRODUCT + 'get-related-products/' + data.category + '/' + data.subCategory + '/' + data.id);
  }

  productFilterByQuery(query: any, paginate?: any, select?: any) {
    const data = {
      query,
      paginate,
      select
    };
    return this.http.post<{ data: Product[], priceRange: any, count: number, message: string }>(API_PRODUCT + 'product-filter-query', data);
  }

  getSearchProduct(searchTerm: string, pagination?: Pagination, sort?: string) {
    const paginate = pagination;
    let params = new HttpParams();
    params = params.append('q', searchTerm);
    params = params.append('s', sort);
    // params = params.append('pageSize', productPerPage);
    // params = params.append('page', currentPage);
    return this.http.post<{ data: Product[], count: number }>(API_PRODUCT + 'get-products-by-search', paginate, {params});
  }

  getSearchProductVendor(searchTerm: string, id: string, pagination?: Pagination, sort?: string) {
    const paginate = pagination;
    let params = new HttpParams();
    params = params.append('q', searchTerm);
    params = params.append('s', sort);
    // params = params.append('pageSize', productPerPage);
    // params = params.append('page', currentPage);
    return this.http.post<{ data: Product[], count: number }>(API_PRODUCT + 'get-vendor-products-by-search/' + id, paginate, {params});
  }

  getSpecificProductsById(ids: string[], select?: string) {
    return this.http.post<{ data: Product[] }>(API_PRODUCT + 'get-specific-products-by-ids', {ids, select});
  }




}
