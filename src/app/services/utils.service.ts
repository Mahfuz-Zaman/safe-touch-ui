import {Inject, Injectable} from '@angular/core';
import * as moment from 'moment';
import {LocationData} from '../interfaces/location';
import {LOCATIONS_DATA} from '../core/utils/location';
import {DAYS, MONTHS, YEARS} from '../core/utils/birthdate';
import {DOCUMENT} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) {
  }


  /**
   * UTILS
   */

  getDateWithCurrentTime(date: Date): Date {
    console.log(date);
    const _ = moment();
    // const newDate = moment(date).add({hours: _.hour(), minutes:_.minute() , seconds:_.second()});
    const newDate = moment(date).add({hours: _.hour(), minutes: _.minute()});
    // return newDate.toDate();
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();
    const h = date.getHours();
    const min = date.getMinutes();
    const formatDate = new Date(y, m, d, h, min);
    console.log(formatDate);
    return formatDate;
  }

  getDateString(date: Date): string {
    return moment(date).format('YYYY-MM-DD');
  }


  getStartEndDate(date: Date, stringDate?: boolean): {firstDay: string | Date, lastDay: string | Date} {
    const y = date.getFullYear();
    const m = date.getMonth();

    const firstDate = new Date(y, m, 1);
    const lastDay = new Date(y, m + 1, 0);

    if (stringDate) {
      return {
        firstDay: this.getDateString(firstDate),
        lastDay: this.getDateString(lastDay),
      };
    }
    return {
      firstDay: new Date(y, m, 1),
      lastDay: new Date(y, m + 1, 0),
    };
  }





  /**
   * VALIDATE EMAIL
   */
  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }


  /**
   * LOCATIONS
   */
  get locationData(): LocationData[] {
    return LOCATIONS_DATA;
  }

  /**
   * BIRTH DATE DATA
   */
  get birthDays(): string[] {
    return DAYS;
  }

  get birthYears(): string[] {
    return YEARS;
  }

  get birthMonths(): string[] {
    return MONTHS;
  }

  /**
   * GENDERS
   */
  get genders(): string[] {
    return ['Male', 'Female', 'Others'];
  }

  /**
   * GENERATE USER NAME
   */
  public slugWithoutSymbol(str?: string): string {
    if (str) {
      const rs = str.replace(/[^a-zA-Z ]/g, '');
      const rw = rs.replace(/\s/g, '');
      return rw.trim().toLowerCase();
    } else {
      return '';
    }
  }

  /**
   * GENERATE SLUG
   */

  public transformToSlug(value: string): string {
    return (
      (value as string)
        .trim().replace(/[^A-Z0-9]+/ig, '-').toLowerCase()
    );
  }

  /**
   * GET RANDOM NUMBER
   */
  getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getImageName(originalName: string): string {
    const array = originalName.split('.');
    array.pop();
    return array.join('');
  }

  getPopString(originalName: string) {
    const s = originalName.split('/').pop() as string;
    const array = s.split('.');
    array.pop();
    return array.join('');
  }

  /**
   * MERGE TWO SAME OBJECT ARRAY UNIQUE
   */

  mergeArrayUnique(array1: any[], array2: any[]): any[] {
    const array = array1.concat(array2);
    const a = array.concat();
    for (let i = 0; i < a.length; ++i) {
      for (let j = i + 1; j < a.length; ++j) {
        if (a[i]._id === a[j]._id) {
          a.splice(j--, 1);
        }
      }
    }
    return a;
  }

  mergeArrayString(array1: string[], array2: string[]): string[] {
    const c = array1.concat(array2);
    return  c.filter((item, pos) => c.indexOf(item) === pos);
  }

  /**
   * REMOVE QUERY & HOST FROM URL
   */

  urlToRouter(url: string, removeHost?: boolean): string {
    const baseUrl = new URL(document.location.href).origin;
    const d = decodeURIComponent(url);
    const ru = d.replace(/\?.*/, '');
    let res;
    if (removeHost) {
      res = ru.replace(baseUrl, '');
    } else {
      res = ru;
    }
    return res;
  }

  removeUrlQuery(url: string) {
    if (url) {
      return url.replace(/\?.*/, '');
    }
  }

  getHostBaseUrl() {
    return new URL(document.location.href).origin;
  }

  /**
   * ARRAY VALUE
   */

  createArray(i: number) {
    return new Array(i);
  }

  arrayToString(array: any[], separator?: string) {
    if (separator) {
      return array.join(separator);
    } else {
      array.join();
    }
  }

  /**
   * MARGE ARRAY UNIQUE
   * @private
   */
  public margeMultipleArrayUnique<T>(uniqueBy: string, arr1: T[], arr2: T[]): T[] {

    const result = [...new Map([...arr1, ...arr2]
      .map((item) => [item[uniqueBy], item])).values()];

    return result as T[];
  }

  /**
   * SLUG
   */
   convertStringToSlug(data: string) {
    return data?.trim().replace(/[^A-Z0-9]+/ig, '-').toLowerCase();
  }


}
