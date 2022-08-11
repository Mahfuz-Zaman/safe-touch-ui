import {Product} from './product';

export interface DealsOfTheDay{
  _id: string;
  name: string;
  desc: string;
  slug: string;
  startDate: Date;
  endDate: Date;
  priority: number;
  product: string | Product;
}
