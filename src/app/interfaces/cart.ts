
import {Product} from './product';


export interface Cart {
  _id?: string;
  product: Product | any;
  selectedQty: number;
  user?: string;
}
