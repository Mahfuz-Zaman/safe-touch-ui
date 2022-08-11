import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Pagination} from '../interfaces/pagination';
import {DealsOfTheDay} from '../interfaces/deals-of-the-day';

const API_DEALS_OF_THE_DAY = environment.apiBaseLink + '/api/deals-of-the-day/';

@Injectable({
  providedIn: 'root'
})
export class DealsOfTheDayService {

  constructor(
    private http: HttpClient,
  ) {
  }

  /**
   * Image Folder
   */

  addNewDealsOfTheDay(data: DealsOfTheDay) {
    return this.http.post<{ message: string }>(API_DEALS_OF_THE_DAY + 'add-new-deals-of-the-day', data);
  }


  getAllDealsOfTheDay(pagination?: Pagination) {
    if (pagination) {
      let params = new HttpParams();
      params = params.append('pageSize', pagination.pageSize);
      params = params.append('page', pagination.currentPage);
      return this.http.get<{ data: DealsOfTheDay[], count: number, message?: string }>
      (API_DEALS_OF_THE_DAY + 'get-all-deals-of-the-day-list', {params});
    } else {
      return this.http.get<{ data: DealsOfTheDay[], count: number, message?: string }>
      (API_DEALS_OF_THE_DAY + 'get-all-deals-of-the-day-list');
    }
  }

  getSingleDealsOfTheDayById(id: string, selectProductField?: string) {
    console.log(id, selectProductField);
    let params = new HttpParams();
    if (selectProductField) {
      params = params.append('select', selectProductField);
    }
    return this.http.get<{ data: DealsOfTheDay, message?: string }>(API_DEALS_OF_THE_DAY + 'get-deals-of-the-day-by-id/' + id, {params});
  }


  editDealsOfTheDay(data: DealsOfTheDay) {
    return this.http.put<{ message: string }>(API_DEALS_OF_THE_DAY + 'edit-deals-of-the-day-by-id', data);
  }

  deleteDealsOfTheDayById(id: string) {
    return this.http.delete<{ message: string }>(API_DEALS_OF_THE_DAY + 'delete-deals-of-the-day-by-id/' + id);
  }


}
