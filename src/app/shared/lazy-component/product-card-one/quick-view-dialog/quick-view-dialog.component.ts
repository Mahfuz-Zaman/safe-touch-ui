import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Product} from '../../../../interfaces/product';
import {Cart} from '../../../../interfaces/cart';
import {ProductService} from '../../../../services/product.service';
import {UtilsService} from '../../../../services/utils.service';
import {UserDataService} from '../../../../services/user-data.service';
import {UserService} from '../../../../services/user.service';
import {ReloadService} from '../../../../services/reload.service';
import {ActivatedRoute} from '@angular/router';
import {CarouselCtrService} from '../../../../services/carousel-ctr.service';
import {UiService} from '../../../../services/ui.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-quick-view-dialog',
  templateUrl: './quick-view-dialog.component.html',
  styleUrls: ['./quick-view-dialog.component.scss']
})
export class QuickViewDialogComponent implements OnInit {

  // All Product
  productSlug: string = null;
  products: any[] = [];
  product: any = null;
  productSpecial: any[] = [];

  // Image Zoom & View Area
  @ViewChild('zoomViewer', {static: true}) zoomViewer;
  image: any;
  zoomImage: any;

  // Quantity
  selectedQty = 1;

  // Carts
  existsInCart = false;
  cartsItems: Cart[] = [];

  // Image Loader
  isImgLoaded = false;
  isSmImgLoad = false;

  // View Container
  viewContainer = 'desc';

  // Test
  testDesc = '<h1>This is description</h1>';

  constructor(
    public dialogRef: MatDialogRef<QuickViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private productService: ProductService,
    private utilsService: UtilsService,
    private userDataService: UserDataService,
    private userService: UserService,
    private reloadService: ReloadService,
    private activatedRoute: ActivatedRoute,
    public carouselCtrService: CarouselCtrService,
    private uiService: UiService
  ) {
  }


  ngOnInit(): void {

    if (this.data) {
      console.log(this.data);
    }

    // this.zoomViewer.nativeElement.children[0].style.display = 'none';

    // this.activatedRoute.paramMap.subscribe(param => {
    //   this.productSlug = param.get('slug');
    // });
    //
    // this.getSingleProductBySlug();

    // this.reloadService.refreshCart$.subscribe(() => {
    //   // this.getCartStatusOnBookDB();
    //   // this.getCartsItemLocal();
    // });

    this.productSpecial = [
      {
        name: 'Lorem ipsum dolor sit amet,Uonsectetuer adipiscing Aliquip',
        rating: 5,
        discount: 14,
        imageOne: '/assets/images/junk/de.png',
        imageTwo: '/assets/images/junk/images.png',
        oldPrice: 1980,
        newPrice: 1799
      },

      {
        name: 'Lorem ipsum dolor sit amet,Uonsectetuer adipiscing Aliquip',
        rating: 5,
        discount: 7,
        imageOne: '/assets/images/junk/air1.png',
        imageTwo: '/assets/images/junk/d.png',
        oldPrice: 1150,
        newPrice: 1099
      },
      {
        name: 'Lorem ipsum dolor sit amet,Uonsectetuer adipiscing Aliquip',
        rating: 5,
        discount: 8,
        imageOne: '/assets/images/junk/mog.png',
        imageTwo: '/assets/images/junk/conditioner-realistic1.jpg',
        oldPrice: 350,
        newPrice: 300
      },
      {
        name: 'Lorem ipsum dolor sit amet,Uonsectetuer adipiscing Aliquip',
        rating: 5,
        discount: 7,
        imageOne: '/assets/images/junk/d.png',
        imageTwo: '/assets/images/junk/air1.png',
        oldPrice: 1150,
        newPrice: 1099
      }

    ];

  }


  /**
   * HTTP REQ HANDLE
   */

  private getSingleProductBySlug() {
    this.productService.getSingleProductBySlug(this.productSlug)
      .subscribe(res => {
        this.product = res.data;
        this.setDefaultImage();
        this.getRelatedProducts();
      }, error => {
        console.log(error);
      });
  }

  private getRelatedProducts() {

    const data = {
      category: this.product.category._id,
      subCategory: this.product.subCategory._id,
      id: this.product._id,
    };
    this.productService.getRelatedProducts(data)
      .subscribe(res => {
        this.products = res.data;
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
    this.image = this.product.primaryImages[0];
    // this.zoomImage = this.product.images[0].big;
    this.zoomImage = this.product.primaryImages[0];
    console.log(this.zoomImage);
  }


  /**
   * QUANTITY CONTROL
   */

  incrementQty() {
    this.selectedQty += 1;
  }

  decrementQty() {
    if (this.selectedQty === 1) {
      return;
    }
    this.selectedQty -= 1;
  }

  /**
   * CART FUNCTIONALITY
   */

  addToCartItem() {
    const data: Cart = {
      product: this.product._id,
      selectedQty: this.selectedQty
    };

    console.log(data);


    if (this.userService.getUserStatus()) {
      console.log('User Logged in');
      this.addItemToCartDB(data);
    } else {
      console.log('User Not Logged in');
      this.userDataService.addCartProductToLocalStorage(data);
      this.reloadService.needRefreshLocal$();
    }
  }

  getCartsItems() {
    console.log('Get Cart Items');
  }


  /**
   * ON SUBMIT Review
   */

  onSubmit(formDirective: NgForm) {
    console.log(formDirective.value);
  }

  /**
   * Buy Now
   */

  buyItem() {
    console.log('Buy Items');
  }


}
