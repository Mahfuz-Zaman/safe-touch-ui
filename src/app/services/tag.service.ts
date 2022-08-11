import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ProductTag} from '../interfaces/product-tag';
import {Pagination} from '../interfaces/pagination';


const API_TAG = environment.apiBaseLink + '/api/tag/';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * TAG
   */
  addTag(data: ProductTag) {
    return this.httpClient.post<{ message: string }>(API_TAG + 'add-single-tag', data);
  }

  insertManyTag(data: ProductTag[]) {
    return this.httpClient.post<{message: string}>(API_TAG + 'add-multiple-tag', data);
  }

  getAllTags() {
    return this.httpClient.post<{ data: ProductTag[], message?: string }>(API_TAG + 'get-all-tags', {});
  }

  getAllTagList(paginate?: Pagination) {
    return this.httpClient.post<{ data: ProductTag[], count: number, message: string }>(API_TAG + 'get-all-tags', {paginate});
  }

  getTagByTagId(id: string) {
    return this.httpClient.get<{ data: ProductTag, message?: string }>(API_TAG + 'get-tag-by-tag-id/' + id);
  }

  editTagData(data: ProductTag) {
    return this.httpClient.put<{message?: string}>(API_TAG + 'edit-tag-by-tag', data);
  }

  deleteTag(id: string) {
    return this.httpClient.delete<{ message?: string }>(API_TAG + 'delete-tag-by-id/' + id);
  }
}
