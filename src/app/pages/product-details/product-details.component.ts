import {Component, OnInit, ViewChild} from '@angular/core';
import {ProductService} from '../../services/product.service';
import {UtilsService} from '../../services/utils.service';
import {NgForm} from '@angular/forms';
import {Cart} from '../../interfaces/cart';
import {UserDataService} from '../../services/user-data.service';
import {UserService} from '../../services/user.service';
import {ReloadService} from '../../services/reload.service';
import {ActivatedRoute} from '@angular/router';
import {CarouselCtrService} from '../../services/carousel-ctr.service';
import {UiService} from 'src/app/services/ui.service';
import {Product} from '../../interfaces/product';
import {CartService} from '../../services/cart.service';
import {ReviewControl} from '../../interfaces/review-control';
import {ReviewControlService} from '../../services/review-control.service';
import {NgxSpinnerService} from 'ngx-spinner';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  // All Product
  productSlug: string = null;
  relatedProducts: Product[] = [];
  product?: Product;
  productSpecial: any[] = [];

  // Reviews
  allReviews: ReviewControl[] = [];

  // Image Zoom & View Area
  @ViewChild('zoomViewer', {static: true}) zoomViewer;
  image: any;
  zoomImage: any;

  user: User;
  isUserAuth = false;

  // Quantity
  selectedQty = 1;

  // CARTS
  carts: Cart[] = [];
  existsInCart = false;

  // WISHLIST
  existsInWishlist = false;

  // Image Loader
  isImgLoaded = false;
  isSmImgLoad = false;

  // View Container
  viewContainer = 'desc';
  viewPolicy = 'delivery';


  constructor(
    private productService: ProductService,
    private utilsService: UtilsService,
    private userDataService: UserDataService,
    private userService: UserService,
    private reloadService: ReloadService,
    private activatedRoute: ActivatedRoute,
    public carouselCtrService: CarouselCtrService,
    public uiService: UiService,
    private cartService: CartService,
    private reviewControlService: ReviewControlService,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {

    // this.zoomViewer.nativeElement.children[0].style.display = 'none';

    this.activatedRoute.paramMap.subscribe(param => {
      this.productSlug = param.get('slug');
      this.getSingleProductBySlug();
    });

    this.reloadService.refreshCart$.subscribe(() => {
      this.getCartsItems();
    });

    this.isUserAuth = this.userService.getUserStatus();

  }


  /**
   * HTTP REQ HANDLE
   */

  private getSingleProductBySlug() {
    this.spinner.show();
    this.productService.getSingleProductBySlug(this.productSlug)
      .subscribe(res => {
        this.product = res.data;
        if (this.product) {
          this.setDefaultImage();
          this.getRelatedProducts();
          this.getCartsItems();
          this.getAllReviewsByQuery();
          this.productStatusOnWishlist(this.product._id);
        }
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  private getAllReviewsByQuery() {
    const query = {
      product: this.product._id,
      status: true
    };
    this.reviewControlService.getAllReviewsByQuery(null, null, query)
      .subscribe(res => {
        this.allReviews = res.data;
      }, error => {
        console.log(error);
      });
  }

  private getRelatedProducts() {
    const data = {
      // @ts-ignore
      category: this.product.category._id,
      // @ts-ignore
      subCategory: this.product.subCategory._id,
      id: this.product._id,
    };
    this.productService.getRelatedProducts(data)
      .subscribe( res => {
        this.relatedProducts = res.data;
      }, error => {
        console.log(error);
      });
  }



  addItemToCartDB(data: Cart) {
    this.userDataService.addItemToUserCart(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshCart$();
      }, error => {
        console.log(error);
      });
  }

  /**
   * IMAGE ZOOM & VIEW AREA
   */
  public onMouseMove(e) {
    if (window.innerWidth >= 1099) {
      const image = e.currentTarget;
      const offsetX = e.offsetX;
      const offsetY = e.offsetY;
      const x = offsetX / image.offsetWidth * 100;
      const y = offsetY / image.offsetHeight * 100;
      const zoom = this.zoomViewer.nativeElement.children[0];
      if (zoom) {
        zoom.style.backgroundPosition = x + '% ' + y + '%';
        zoom.style.display = 'block';
        zoom.style.height = image.height + 'px';
        zoom.style.width = image.width + 'px';
      }
    }
  }

  public onMouseLeave(event) {
    this.zoomViewer.nativeElement.children[0].style.display = 'none';
  }

  public selectImage(image: any) {
    this.image = image;
    this.zoomImage = image;
  }

  private setDefaultImage() {
    // this.image = this.product.images !== null ? this.product.images[0].big : '/assets/images/junk/Nokia 3310.jpg';
    this.image = this.product.images && this.product.images.length > 0 ? this.product.images[0] : '/assets/images/placeholder/test.png';
    // this.zoomImage = this.product.images[0].big;
    this.zoomImage = this.image;
  }

  /**
   * WISHLIST
   */

   addToWishlist(productID) {
     this.userDataService.addToWishlist(productID)
     .subscribe( res => {
       if (res.message == 'Added to wishlist successfully!') {
        this.existsInWishlist = true
        this.uiService.success(res.message);
       } else {
        this.uiService.warn(res.message);
       }
     }, err=> {

     });
  }

  productStatusOnWishlist(productId) {
    this.isUserAuth = this.userService.getUserStatus();
    if (this.isUserAuth) {
      this.userDataService.getProductStatusOnWishlist(productId)
      .subscribe( res => {
        if (res.exists) {
          this.existsInWishlist = true;
        } else {
          this.existsInWishlist = false;
        }
      }, err => {
        console.log(err);  
      });
    } else {
      this.existsInWishlist = false;
    }
  }

  /**
   * QUANTITY CONTROL
   */

  incrementQty() {
    this.selectedQty += 1;
  }

  decrementQty() {
    if (this.selectedQty === 1) {
      this.uiService.warn('Minimum Quantity is selected');
      return;
    }
    this.selectedQty -= 1;
  }

  /**
   * CART FUNCTIONALITY
   */

  addToCart() {
    const data: Cart = {
      product: this.product?._id,
      selectedQty: this.selectedQty,
    };


    if (this.userService.getUserStatus()) {
      this.addItemToCartDB(data);
    } else {
      this.cartService.addCartItemToLocalStorage(data);
      this.reloadService.needRefreshCart$();
    }
  }

  // GET CARTS DATA
  private getCartsItems() {
    if (this.userService.getUserStatus()) {
      this.getCartItemList();
    } else {
      this.getCarsItemFromLocal();
    }

  }

  private getCartItemList() {
    this.cartService.getCartItemList()
      .subscribe(res => {
        this.carts = res.data;
        // @ts-ignore
        const existsOnCart = this.carts.find(item => item.product._id === this.product._id);
        if (existsOnCart) {
          this.existsInCart = true;
          this.selectedQty = existsOnCart.selectedQty;
        }
      }, error => {
        console.log(error);
      });
  }

  private getCarsItemFromLocal() {
    const items = this.cartService.getCartItemFromLocalStorage();

    if (items && items.length > 0) {
      const ids: string[] = items.map(m => m.product as string);
      this.productService.getSpecificProductsById(ids, 'productName productSlug  price discountType discountAmount  quantity images')
        .subscribe(res => {
          const products = res.data;
          if (products && products.length > 0) {
            this.carts = items.map(t1 => ({...t1, ...{product: products.find(t2 => t2._id === t1.product)}}));
            // @ts-ignore
            const existsOnCart = this.carts.find(item => item.product._id === this.product._id);
            if (existsOnCart) {
              this.existsInCart = true;
              this.selectedQty = existsOnCart.selectedQty;
            }
          }
        });
    } else {
      this.carts = [];
    }
  }


  /**
   * ON SUBMIT Review
   */

  onSubmit(formDirective: NgForm) {
  }

  /**
   * Buy Now
   */

  buyItem() {
    console.log('Buy Items');
  }


}
