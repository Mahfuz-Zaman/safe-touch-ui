import {MenuAdmin} from '../../interfaces/menu-admin';
import {environment} from '../../../environments/environment';


export const menuItemsAdmin: MenuAdmin[] = [

  // Parent Dashboard
  {
    id: '1',
    title: 'Dashboard',
    icon: 'dashboard',
    hasSubMenu: false,
    parentId: null,
    routerLink: 'dashboard',
    href: null,
    target: null
  },
  // Parent Customization
  {
    id: '2',
    title: 'Customization',
    icon: 'dashboard_customize',
    hasSubMenu: true,
    parentId: null,
    routerLink: null,
    href: null,
    target: null
  },
  {
    id: 'a1',
    title: 'Category Menu',
    icon: 'follow_the_signs',
    hasSubMenu: false,
    parentId: '2',
    routerLink: 'category-menu',
    href: null,
    target: null
  },

  {
    id: 'a2',
    title: 'Carousel',
    icon: 'follow_the_signs',
    hasSubMenu: false,
    parentId: '2',
    routerLink: 'carousel',
    href: null,
    target: null
  },
  {
    id: 'a3',
    title: 'Shop Info',
    icon: 'follow_the_signs',
    hasSubMenu: false,
    parentId: '2',
    routerLink: 'shop-info',
    href: null,
    target: null
  },
  // Parent Products
  {
    id: '3',
    title: 'Categories',
    icon: 'category',
    hasSubMenu: true,
    parentId: null,
    routerLink: null,
    href: null,
    target: null
  },
  {
    id: 'b1',
    title: 'Attributes',
    icon: 'follow_the_signs',
    hasSubMenu: false,
    parentId: '3',
    routerLink: 'attributes',
    href: null,
    target: null
  },
  {
    id: 'b10',
    title: 'Tags',
    icon: 'follow_the_signs',
    hasSubMenu: false,
    parentId: '3',
    routerLink: 'tags',
    href: null,
    target: null
  },
  {
    id: 'b2',
    title: 'Brands',
    icon: 'follow_the_signs',
    hasSubMenu: false,
    parentId: '3',
    routerLink: 'brands',
    href: null,
    target: null
  },
  {
    id: 'b3',
    title: 'Categories',
    icon: 'follow_the_signs',
    hasSubMenu: false,
    parentId: '3',
    routerLink: 'categories',
    href: null,
    target: null
  },
  {
    id: 'b3',
    title: 'Sub Categories',
    icon: 'follow_the_signs',
    hasSubMenu: false,
    parentId: '3',
    routerLink: 'sub-categories',
    href: null,
    target: null
  },
  // Parent Products
  {
    id: '100',
    title: 'Products',
    icon: 'view_list',
    hasSubMenu: true,
    parentId: null,
    routerLink: null,
    href: null,
    target: null
  },
  {
    id: '100b1',
    title: 'Products List',
    icon: 'follow_the_signs',
    hasSubMenu: false,
    parentId: '100',
    routerLink: 'products',
    href: null,
    target: null
  },
  {
    id: '100b2',
    title: 'Add Product',
    icon: 'follow_the_signs',
    hasSubMenu: false,
    parentId: '100',
    routerLink: 'add-product',
    href: null,
    target: null
  },
  // Parent Offer
  {
    id: '745Z',
    title: 'Offers',
    icon: 'local_offer',
    hasSubMenu: true,
    parentId: null,
    routerLink: null,
    href: null,
    target: null
  },
  {
    id: '74RX',
    title: 'Deal on Play',
    icon: 'follow_the_signs',
    hasSubMenu: false,
    parentId: '745Z',
    routerLink: 'deal-on-play',
    href: null,
    target: null
  },
  {
    id: '74RY',
    title: 'Flash Sale',
    icon: 'follow_the_signs',
    hasSubMenu: false,
    parentId: '745Z',
    routerLink: 'flash-sale',
    href: null,
    target: null
  },
  {
    id: '74BRY',
    title: 'Banner',
    icon: 'follow_the_signs',
    hasSubMenu: false,
    parentId: '745Z',
    routerLink: 'banner',
    href: null,
    target: null
  },
  // {
  //   id: '74RZ',
  //   title: 'Featured Product',
  //   icon: 'follow_the_signs',
  //   hasSubMenu: false,
  //   parentId: '745Z',
  //   routerLink: 'featured-product',
  //   href: null,
  //   target: null
  // },
  {
    id: '74RZ2',
    title: 'Featured Category',
    icon: 'follow_the_signs',
    hasSubMenu: false,
    parentId: '745Z',
    routerLink: 'featured-category',
    href: null,
    target: null
  },
  // Parent Gallery Folder
  {
    id: '45x',
    title: 'Image Folder',
    icon: 'folder',
    hasSubMenu: false,
    parentId: null,
    routerLink: 'image-folder',
    href: null,
    target: null
  },
  // Parent Gallery
  {
    id: '4',
    title: 'Image Gallery',
    icon: 'collections',
    hasSubMenu: false,
    parentId: null,
    routerLink: 'image-gallery',
    href: null,
    target: null
  },
  // Parent Additional Pages
  {
    id: '45x',
    title: 'Additional Pages',
    icon: 'layers',
    hasSubMenu: false,
    parentId: null,
    routerLink: 'additional-pages',
    href: null,
    target: null
  },
  // Parent Additional Pages
  // {
  //   id: '45x',
  //   title: 'Shipping Charge',
  //   icon: 'attach_money',
  //   hasSubMenu: false,
  //   parentId: null,
  //   routerLink: 'shipping-charge',
  //   href: null,
  //   target: null
  // },
  // Parent Sales
  {
    id: '4',
    title: 'Sales',
    icon: 'local_mall',
    hasSubMenu: true,
    parentId: null,
    routerLink: null,
    href: null,
    target: null
  },
  {
    id: 'c1',
    title: 'Orders',
    icon: 'follow_the_signs',
    hasSubMenu: false,
    parentId: '4',
    routerLink: 'orders',
    href: null,
    target: null
  },
  {
    id: 'c1',
    title: 'Transactions',
    icon: 'follow_the_signs',
    hasSubMenu: false,
    parentId: '4',
    routerLink: 'transactions',
    href: null,
    target: null
  },
  // Roles Users
  {
    id: '51',
    title: 'Roles',
    icon: 'offline_bolt',
    hasSubMenu: false,
    parentId: null,
    routerLink: 'roles',
    href: null,
    target: null
  },
  // Parent Users
  {
    id: '5',
    title: 'Users',
    icon: 'group_add',
    hasSubMenu: false,
    parentId: null,
    routerLink: 'users',
    href: null,
    target: null
  },
  // Vendors
  {
    id: '6346',
    title: 'Vendors',
    icon: 'people',
    hasSubMenu: false,
    parentId: null,
    routerLink: 'vendors',
    href: null,
    target: null
  },
  // Parent Customers
  {
    id: '6',
    title: 'Customers',
    icon: 'people',
    hasSubMenu: false,
    parentId: null,
    routerLink: 'customers',
    href: null,
    target: null
  },
  {
    id: '412',
    title: 'Blogs',
    icon: 'people',
    hasSubMenu: false,
    parentId: null,
    routerLink: 'blogs',
    href: null,
    target: null
  },
  // Parent Newsletter
  {
    id: '7',
    title: 'Newsletter',
    icon: 'drafts',
    hasSubMenu: false,
    parentId: null,
    routerLink: 'newsletter',
    href: null,
    target: null
  },
  // Parent Coupons
  {
    id: '8',
    title: 'Coupons',
    icon: 'vpn_key',
    hasSubMenu: false,
    parentId: null,
    routerLink: 'coupons',
    href: null,
    target: null
  },
  // Parent StoreInfo
  {
    id: '777',
    title: 'Store Info',
    icon: 'vpn_key',
    hasSubMenu: false,
    parentId: null,
    routerLink: 'store-info',
    href: null,
    target: null
  },
  // Parent Reviews
  {
    id: '9',
    title: 'Reviews',
    icon: 'reviews',
    hasSubMenu: false,
    parentId: null,
    routerLink: 'reviews',
    href: null,
    target: null
  },
  // Parent Support
  {
    id: '10',
    title: 'Support',
    icon: 'support_agent',
    hasSubMenu: false,
    parentId: null,
    routerLink: null,
    href: 'https://softlabit.com/',
    target: '_blank'
  },

];
