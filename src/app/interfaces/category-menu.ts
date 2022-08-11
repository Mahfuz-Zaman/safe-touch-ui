
export interface CategoryMenu {
  _id?: string;
  id: string;
  name: string;
  slug: string;
  icon?: string;
  hasChild: HasChild[];
  priority?: number;
}


export interface HasChild {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  hasChild: HasChild2[];
  priority?: number;
}


export interface HasChild2 {
  id: string;
  slug: string;
  icon?: string;
  name: string;
  hasChild: any[];
  priority?: number;
}

