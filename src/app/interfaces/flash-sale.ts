import {Product} from './product';

export interface FlashSale {
  _id: string;
  name: string;
  slug: string;
  desc: string;
  startDate: Date;
  endDate: Date;
  priority: number;
  products: string[] | Product[];
}
