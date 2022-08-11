import {Pipe, PipeTransform} from '@angular/core';
import {Product} from '../../interfaces/product';
import {DiscountTypeEnum} from '../../enum/discount-type.enum';

@Pipe({
  name: 'price'
})
export class PricePipe implements PipeTransform {

  transform(product: Product, type: string, quantity?: number): number {

    if (product) {
      switch (type) {
        case 'priceWithDiscount': {
          if (product.discountType === DiscountTypeEnum.PERCENTAGE) {
            const disPrice = (product?.discountAmount / 100) * product?.price;
            if (quantity) {
              return Math.floor((product?.price - disPrice) * quantity);
            }
            return Math.floor(product?.price - disPrice);
          } else {
            if (quantity) {
              return Math.floor((product?.price - product.discountAmount) * quantity);
            }
            return Math.floor(product?.price - product.discountAmount);
          }
        }
        case 'discountPrice': {
          if (product.discountType === DiscountTypeEnum.PERCENTAGE) {
            if (quantity) {
              return Math.floor(((product?.discountAmount / 100) * product?.price) * quantity);
            }
            return Math.floor((product?.discountAmount / 100) * product?.price);
          } else {
            if (quantity) {
              return Math.floor(product?.discountAmount * quantity);
            }
            return Math.floor(product?.discountAmount);
          }
        }
        default: {
          return Math.floor(product?.price);
        }
      }
    }

  }

}
