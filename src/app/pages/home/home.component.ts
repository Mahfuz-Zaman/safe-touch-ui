import {Component, OnInit} from '@angular/core';
import {Product} from '../../interfaces/product';
import {CarouselCtrService} from '../../services/carousel-ctr.service';
import {MenuService} from '../../services/menu.service';
import {ShopService} from '../../services/shop.service';
import {ProductCategory} from '../../interfaces/product-category';
import {CategoryService} from '../../services/category.service';
import {DealOnPlay} from '../../interfaces/deal-on-play';
import {FeaturedCategory} from '../../interfaces/featured-category';
import {DealOnPlayService} from '../../services/deal-on-play.service';
import {FeaturedCategoryService} from '../../services/featured-category.service';
import {FeaturedProduct} from '../../interfaces/featured-product';
import {FeaturedProductService} from '../../services/featured-product.service';
import {Select} from '../../interfaces/select';
import {CustomizationService} from '../../services/customization.service';
import {Carousel} from '../../interfaces/carousel';
import {FlashSale} from '../../interfaces/flash-sale';
import {FlashSaleService} from '../../services/flash-sale.service';
import {CategoryMenu} from '../../interfaces/category-menu';
import {BannerService} from '../../services/banner.service';
import {Banner} from '../../interfaces/banner';
import { User } from 'src/app/interfaces/user';
import { UserDataService } from 'src/app/services/user-data.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

   // User Data
   user: User = null;
   isUserAuth = false;

  // Category Menu
  categoryMenus: CategoryMenu[] = [];

  products: Product[] = [];

  carousels: Carousel[] = [
    {url: '/', image: null, title: '', _id: ''}
  ];

  brands: any[] = [];
  offers: any[] = [];


  brandList: any[] = [];
  electronics: any[] = [];
  onlyForYou: any[] = [];

  isOpenParent = false;


  // Store Data
  categories: ProductCategory[] = [];
  dealOnPlay: DealOnPlay[] = [];
  banner: Banner;
  allFlashSale: FlashSale[] = [];
  featuredCategory: FeaturedCategory[] = [];
  allFeaturedProduct: FeaturedProduct[] = [];
  activeFeaturedProduct: string;

  // Dummy Data
  featureProductTypes: Select[] = [
    {
      value: 'featured',
      viewValue: 'Featured',
    },
    {
      value: 'best-seller',
      viewValue: 'Best Seller',
    },
    {
      value: 'special-product',
      viewValue: 'Special Product',
    },
  ];



  constructor(
    public carouselCtrService: CarouselCtrService,
    private menuService: MenuService,
    private shopService: ShopService,
    private categoryService: CategoryService,
    private dealOnPlayService: DealOnPlayService,
    private flashSaleService: FlashSaleService,
    private featuredCategoryService: FeaturedCategoryService,
    private featuredProductService: FeaturedProductService,
    private customizationService: CustomizationService,
    private bannerService: BannerService,
    public userService: UserService,
    public userDataService: UserDataService,
  ) {
  }

  ngOnInit(): void {

    this.userService.getUserStatusListener().subscribe(() => {
      this.isUserAuth = this.userService.getUserStatus();
      if (this.isUserAuth) {
        this.getLoggedInUserInfo();
      }
    });
    this.isUserAuth = this.userService.getUserStatus();
    if (this.isUserAuth) {
      this.getLoggedInUserInfo();
    }

    // GET DATA
    this.getAllCategoryMenu();
    this.getAllCarousel();
    this.getAllCategory();
    this.getAllFlashSale();
    this.getAllDealOnPLay();
    this.getAllBanner();
    this.getAllFeaturedCategory();
    this.activeFeaturedProduct = this.featureProductTypes[0].value;
    this.getAllFeaturedProduct(this.featureProductTypes[0].value);

    this.brands = [
      {name: 'Brand 1', image: '/assets/images/junk/brand-1.png'},
      {name: 'Brand 2', image: '/assets/images/junk/brand-2.png'},
      {name: 'Brand 3', image: '/assets/images/junk/brand-3.png'},
      {name: 'Brand 4', image: '/assets/images/junk/brand-4.png'},
      {name: 'Brand 5', image: '/assets/images/junk/brand-5.png'},
      {name: 'Brand 2', image: '/assets/images/junk/brand-2.png'},
      {name: 'Brand 3', image: '/assets/images/junk/brand-3.png'},
      {name: 'Brand 4', image: '/assets/images/junk/brand-4.png'},
      {name: 'Brand 1', image: '/assets/images/junk/brand-1.png'}
    ];
  }


  /**
   * HTTP REQ HANDLE
   */

   private getLoggedInUserInfo() {
    const select = 'fullName profileImg';
    this.userDataService.getLoggedInUserInfo(select)
      .subscribe(res => {
        this.user = res.data;
      }, error => {
        console.log(error);
      });
  }

  private getAllCategoryMenu() {
    this.menuService.getAllCategoryMenuNoRepeat()
      .subscribe(res => {
        console.log(res.data)
        this.categoryMenus = res.data.slice(0, 8);
      }, error => {
        console.log(error);
      });
  }


  private getAllCarousel() {
    this.customizationService.getAllCarousel()
      .subscribe(res => {
        this.carousels = res.data;
      }, error => {
        console.log(error);
      });
  }

  private getAllCategory() {
    this.categoryService.getAllCategory()
      .subscribe(res => {
        this.categories = res.data;
      }, error => {
        console.log(error);
      });
  }

  private getAllFlashSale() {
    this.flashSaleService.getAllFlashSale()
      .subscribe(res => {
        this.allFlashSale = res.data;
        console.log(this.allFlashSale);
      }, error => {
        console.log(error);
      });
  }


  private getAllDealOnPLay() {
    this.dealOnPlayService.getAllDealOnPlay()
      .subscribe(res => {
        this.dealOnPlay = res.data;
        console.log(this.dealOnPlay);
      }, error => {
        console.log(error);
      });
  }

  private getAllBanner() {
    this.bannerService.getAllBanner(null, 'bigBanner')
      .subscribe(res => {
       this.banner = res.data ? res.data[0] : null;
      }, error => {
        console.log(error);
      });
  }

  private getAllFeaturedCategory() {
    this.featuredCategoryService.getAllFeaturedCategory()
      .subscribe(res => {
        this.featuredCategory = res.data;
      }, error => {
        console.log(error);
      });
  }

  public getAllFeaturedProduct(type: string) {
    this.activeFeaturedProduct = type;
    console.log(type);
    this.featuredProductService.getAllFeaturedProduct(null, type)
      .subscribe(res => {
        console.log(res.data);
        this.allFeaturedProduct = res.data;
      }, error => {
        console.log(error);
      });
  }


  seeMore() {

  }
}
