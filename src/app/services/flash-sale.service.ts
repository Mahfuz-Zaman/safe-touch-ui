import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Pagination} from '../interfaces/pagination';
import {FlashSale} from '../interfaces/flash-sale';

const API_FLASH_SALE = environment.apiBaseLink + '/api/flash-sale/';

@Injectable({
  providedIn: 'root'
})
export class FlashSaleService {

  constructor(
    private http: HttpClient,
  ) {
  }

  /**
   * Image Folder
   */

  addNewFlashSale(data: FlashSale) {
    return this.http.post<{ message: string }>(API_FLASH_SALE + 'add-new-flash-sale', data);
  }


  getAllFlashSale(pagination?: Pagination) {
    if (pagination) {
      let params = new HttpParams();
      params = params.append('pageSize', pagination.pageSize);
      params = params.append('page', pagination.currentPage);
      return this.http.get<{ data: FlashSale[], count: number, message?: string }>
      (API_FLASH_SALE + 'get-all-flash-sale-list', {params});
    } else {
      return this.http.get<{ data: FlashSale[], count: number, message?: string }>
      (API_FLASH_SALE + 'get-all-flash-sale-list');
    }
  }

  getSingleFlashSaleById(id: string, selectProductField?: string) {
    console.log(id, selectProductField);
    let params = new HttpParams();
    if (selectProductField) {
      params = params.append('select', selectProductField);
    }
    return this.http.get<{ data: FlashSale, message?: string }>(API_FLASH_SALE + 'get-flash-sale-by-id/' + id, {params});
  }


  editFlashSale(data: FlashSale) {
    return this.http.put<{ message: string }>(API_FLASH_SALE + 'edit-flash-sale', data);
  }

  deleteFlashSaleById(id: string) {
    return this.http.delete<{ message: string }>(API_FLASH_SALE + 'delete-flash-sale-by-id/' + id);
  }


}
