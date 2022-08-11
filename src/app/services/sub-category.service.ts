import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ProductSubCategory} from '../interfaces/product-sub-category';
import {ProductCategory} from '../interfaces/product-category';

const API_SUB_CATEGORY = environment.apiBaseLink + '/api/product-sub-category/';

@Injectable({
  providedIn: 'root'
})
export class SubCategoryService {

  constructor(
    private httpClient: HttpClient
  ) { }

  /**
   * SUB-CATEGORY
   */

  addSubCategory(data: ProductSubCategory) {
    return this.httpClient.post<{message: string}>(API_SUB_CATEGORY + 'add-sub-category', data);
  }

  insertManySubCategory(data: ProductSubCategory[]) {
    return this.httpClient.post<{ message: string }>(API_SUB_CATEGORY + 'add-multiple-sub-category', data);
  }

  getAllSubCategory() {
    return this.httpClient.get<{data: ProductSubCategory[], message?: string}>(API_SUB_CATEGORY + 'get-all-sub-categories');
  }

  getSubCategoryByCategoryId(id: string) {
    return this.httpClient.get<{data: ProductSubCategory[], message?: string}>(API_SUB_CATEGORY + 'get-sub-category-by-category-id/' + id);
  }

  editSubCategoryData(data: ProductSubCategory) {
    return this.httpClient.put<{message: string}>(API_SUB_CATEGORY + 'edit-sub-category-by-sub-category', data);
  }


  getSubCategoryBySubCategoryId(id: string) {
    // tslint:disable-next-line:max-line-length
    return this.httpClient.get<{data: ProductSubCategory, message?: string}>(API_SUB_CATEGORY + 'get-sub-category-by-sub-category-id/' + id);
  }
  getSubCategoryBySearch(id: string) {
    return this.httpClient.get<{data: ProductSubCategory, message?: string}>(API_SUB_CATEGORY + 'get-sub-category-by-search/' + id);
  }

  deleteSubCategory(id: string) {
    return this.httpClient.delete<{message?: string}>(API_SUB_CATEGORY + 'delete-sub-category-by-id/' + id);
  }

  getSubCategoryBySubCategorySlug(slug: string) {
    // tslint:disable-next-line:max-line-length
    return this.httpClient.get<{data: ProductSubCategory, message?: string}>(API_SUB_CATEGORY + 'get-sub-category-by-sub-category-slug/' + slug);
  }

}
