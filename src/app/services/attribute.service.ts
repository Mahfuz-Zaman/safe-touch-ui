import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ProductAttribute} from '../interfaces/product-attribute';


const API_ATTRIBUTE = environment.apiBaseLink + '/api/product-attribute/';

@Injectable({
  providedIn: 'root'
})
export class AttributeService {

  constructor(
    private httpClient: HttpClient
  ) { }

  /**
   * ATTRIBUTES
   */
  addAttribute(data: ProductAttribute) {
    return this.httpClient.post<{message: string}>(API_ATTRIBUTE + 'add-attribute', data);
  }

  insertManyAttribute(data: ProductAttribute[]) {
    return this.httpClient.post<{message: string}>(API_ATTRIBUTE + 'add-multiple-attribute', data);
  }

  getAllAttributes() {
    return this.httpClient.get<{data: ProductAttribute[], message?: string}>(API_ATTRIBUTE + 'get-all-attributes');
  }

  getAttributeByAttributeId(id: string) {
    return this.httpClient.get<{data: ProductAttribute, message?: string}>(API_ATTRIBUTE + 'get-attribute-by-attribute-id/' + id);
  }

  editAttributeData(data: ProductAttribute) {
    return this.httpClient.put<{message: string}>(API_ATTRIBUTE + 'edit-attribute-by-attribute', data);
  }

  deleteAttribute(id: string) {
    return this.httpClient.delete<{message?: string}>(API_ATTRIBUTE + 'delete-attributes-by-id/' + id);
  }







}
