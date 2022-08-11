import { Address } from "./address";
import { Cart } from "./cart";
import { Coupon } from "./coupon";
import { Order } from "./order";

export interface User {
  _id?: string;
  fullName: string;
  username?: string;
  gender?: string;
  birthdate?: Date;
  email?: string;
  phoneNo?: string;
  address?: string;
  profileImg?: string;
  password?: string;
  isPhoneVerified?: boolean;
  isEmailVerified?: boolean;
  registrationType?: string;
  registrationAt?: Date;
  hasAccess?: boolean;
  usedCoupons?: Coupon[] | string[];
  wishlists?: string[];
  carts?: Cart[] | string[];
  checkouts?: Order[] | string[];
  addresses?: Address[] | string[];
  createdAt?: any;
  updatedAt?: any;
}
