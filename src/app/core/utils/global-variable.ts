import {environment} from '../../../environments/environment';

export const DATABASE_KEY = Object.freeze({
  loginToken: 'RAJARHAT_TOKEN_' + environment.VERSION,
  loggInSession: 'RAJARHAT_SESSION_' + environment.VERSION,
  loginTokenAdmin: 'RAJARHAT_ADMIN_TOKEN_' + environment.VERSION,
  loggInSessionAdmin: 'RAJARHAT_ADMIN_SESSION_' + environment.VERSION,
  loginTokenVendor: 'RAJARHAT_VENDOR_TOKEN_' + environment.VERSION,
  loggInSessionVendor: 'RAJARHAT_VENDOR_SESSION_' + environment.VERSION,
  cartsProduct: 'RAJARHAT_USER_CART_' + environment.VERSION,
  adminRoleData: 'RAJARHAT_ADMIN_ROLE_' + environment.VERSION,
  productFormData: 'RAJARHAT_PRODUCT_FORM_' + environment.VERSION,
  userCart: 'RAJARHAT_USER_CART_' + environment.VERSION,
  userCoupon: 'RAJARHAT_USER_COUPON_' + environment.VERSION,
});
