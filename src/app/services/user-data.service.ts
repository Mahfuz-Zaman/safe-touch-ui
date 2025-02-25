import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {User} from '../interfaces/user';
import {Cart} from '../interfaces/cart';
import {DATABASE_KEY} from '../core/utils/global-variable';
import {Address} from '../interfaces/address';
import {Pagination} from '../interfaces/pagination';
import {Order} from '../interfaces/order';
import { Product } from '../interfaces/product';
import {ProductBrand} from '../interfaces/product-brand';

const API_USER = environment.apiBaseLink + '/api/user/';
const API_CART = environment.apiBaseLink + '/api/cart/';
const API_WISHLIST = environment.apiBaseLink + '/api/wishlist/';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {


  constructor(
    private httpClient: HttpClient,
  ) {
  }

  /**
   * USER BASIC DATA
   */

  getLoggedInUserInfo(select?: string) {
    if (select) {
      let params = new HttpParams();
      params = params.append('select', select);
      return this.httpClient.get<{ data: User, message?: string }>(API_USER + 'logged-in-user-data', {params});
    } else {
      return this.httpClient.get<{ data: User, message?: string }>(API_USER + 'logged-in-user-data');
    }
  }

  editLoginUserInfo(data: any) {
    return this.httpClient.put<{ message?: string }>(API_USER + 'edit-logged-in-user-data', data);
  }


  // router.get('/edit-logged-in-user-data', checkAuth, controller.editLoginUserInfo);

  /**
   * PRODUCT CART
   * CART WITH LOCAL STORAGE
   */

  addCartProductToLocalStorage(cartItem: Cart) {
    // console.log(product);
    const items = JSON.parse(localStorage.getItem(DATABASE_KEY.cartsProduct));

    let carts;

    if (items === null) {
      carts = [];
      carts.push(cartItem);
    } else {
      carts = items;
      const fIndex = carts.findIndex((o) => o._id === cartItem._id);
      if (fIndex === -1) {
        carts.push(cartItem);
      }
    }
    localStorage.setItem(DATABASE_KEY.cartsProduct, JSON.stringify(carts));
  }

  getCartProductFromLocalStorage(): Cart[] {
    const carts = localStorage.getItem(DATABASE_KEY.cartsProduct);
    if (carts === null) {
      return [];
    }
    return JSON.parse(carts) as Cart[];
  }

  deleteCartProductFromLocalStorage(id: string) {
    const items = JSON.parse(localStorage.getItem(DATABASE_KEY.cartsProduct));
    const filtered = items.filter(el => el._id !== id);
    localStorage.setItem(DATABASE_KEY.cartsProduct, JSON.stringify(filtered));
  }

  /**
   * USER ADDRESS
   */

  getAllAddress(pagination?: Pagination, select?: string) {
    let params = new HttpParams();

    if (pagination) {
      params = params.append('pageSize', pagination.pageSize);
      params = params.append('page', pagination.currentPage);
      if (select) {
        params = params.append('select', select);
      }
      return this.httpClient.get<{ data: Address[], count: number, message?: string }>
      (API_USER + 'get-addresses', {params});
    } else {
      if (select) {
        params = params.append('select', select);
      }
      return this.httpClient.get<{ data: Address[], count: number, message?: string }>
      (API_USER + 'get-addresses', {params});
    }
  }

  addToAddress(address: Address) {
    return this.httpClient.post<{ message: string }>(API_USER + 'add-address', address);
  }

  editAddress(address: Address) {
    return this.httpClient.put<{ message: string }>(API_USER + 'edit-address', address);
  }

  deleteAddress(addressId: string) {
    return this.httpClient.delete<{ message: string }>(API_USER + '/delete-address/' + addressId);
  }


  /**
   * CART
   */
  addItemToUserCart(data: Cart) {
    return this.httpClient.post<{ message: string }>(API_CART + 'add-to-cart', data);
  }

  addSingleItemToCart(data: Cart) {
    return this.httpClient.post<{ message: string }>(API_CART + 'add-to-cart', data);
  }

  getCartItemList() {
    return this.httpClient.get<{ data: any, message: string }>(API_CART + 'get-cart-items-by-user');
  }

  incrementCartQuantity(cartId: string) {
    return this.httpClient.post<{ message: string }>(API_CART + 'increment-cart-item-quantity', {cartId});
  }

  decrementCartQuantity(cartId: string) {
    return this.httpClient.post<{ message: string }>(API_CART + 'decrement-cart-item-quantity', {cartId});
  }

  removeCartItem(cartId: string) {
    return this.httpClient.delete<{ message: string }>(API_CART + 'remove-cart-item/' + cartId);
  }

  countCartItem() {
    return this.httpClient.get<{ data: number }>(API_CART + 'cart-item-count');
  }

  getCartStatusOnBook(bookId: string) {
    return this.httpClient.get<{ data: any }>(API_CART + 'get-status-book-on-cart/' + bookId);
  }

  /**
   * WISHLIST
   */

    addToWishlist(productId: string) {
      return this.httpClient.get<{ message: string }>(API_WISHLIST + 'add-to-wishlist/' + productId);
    }

    getProductsFromWishlist() {
      return this.httpClient.get<{ products: Product[], message: string }>(API_WISHLIST + 'get-all-product-from-wishlist');
    }

    deleteProductByProductIdFromWishlist(productId: string) {
      return this.httpClient.delete<{ message: string }>(API_WISHLIST + 'delete-product-from-wishlist-by-id/' + productId);
    }

    getProductStatusOnWishlist(productId: string) {
      return this.httpClient.get<{ exists: boolean, message: string }>(API_WISHLIST + 'get-status-on-wishlist-by-id/' + productId);
    }

  /**
   * ADMIN ACCESS
   * CUSTOMER
   */
  getCustomerLists(pagination?: Pagination) {
    if (pagination) {
      let params = new HttpParams();
      params = params.append('pageSize', pagination.pageSize);
      params = params.append('page', pagination.currentPage);
      return this.httpClient.get<{ data: User[], count: number, message?: string }>(API_USER + 'get-all-user-list', {params});
    } else {
      return this.httpClient.get<{ data: User[], count: number, message?: string }>(API_USER + 'get-all-user-list');
    }
  }
  getUserByUserID(id: string) {
    return this.httpClient.get<{data: User, message?: string}>(API_USER + 'get-user-by-user-id/' + id);
  }

  editUserAccess(userId: string, data: object) {
    return this.httpClient.put<{ message: string }>(API_USER + 'edit-user-access/' + userId, data);
  }


}
