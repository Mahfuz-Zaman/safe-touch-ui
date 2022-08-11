import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ProductCategory} from '../interfaces/product-category';


const API_CATEGORY = environment.apiBaseLink + '/api/product-category/';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * CATEGORY
   */

  addCategory(data: ProductCategory) {
    return this.httpClient.post<{ message: string }>(API_CATEGORY + 'add-category', data);
  }
  insertManyCategory(data: ProductCategory[]) {
    return this.httpClient.post<{ message: string }>(API_CATEGORY + 'add-multiple-category', data);
  }

  getAllCategory() {
    return this.httpClient.get<{ data: ProductCategory[], message?: string }>(API_CATEGORY + 'get-all-categories');
  }

  getCategoryByCategoryId(id: string) {
    return this.httpClient.get<{ data: ProductCategory, message?: string }>(API_CATEGORY + 'get-category-by-category-id/' + id);
  }

  editCategoryData(data: ProductCategory) {
    return this.httpClient.put<{message: string}>(API_CATEGORY + 'edit-category-by-category', data);
  }

  getCategoryBySearch(id: string) {
    return this.httpClient.get<{ data: ProductCategory, message?: string }>(API_CATEGORY + 'get-category-by-search/' + id);
  }

  deleteCategory(id: string) {
    return this.httpClient.delete<{ message?: string }>(API_CATEGORY + 'delete-category-by-id/' + id);
  }

  getCategoryByCategorySlug(slug: string) {
    return this.httpClient.get<{ data: ProductCategory, message?: string }>(API_CATEGORY + 'get-category-by-category-slug/' + slug);
  }

}
