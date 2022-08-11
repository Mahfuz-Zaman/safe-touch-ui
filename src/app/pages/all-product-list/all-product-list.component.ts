import {Component, EventEmitter, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ProductService} from '../../services/product.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {Pagination} from '../../interfaces/pagination';
import {CategoryService} from 'src/app/services/category.service';
import {SubCategoryService} from 'src/app/services/sub-category.service';
import {AttributeService} from 'src/app/services/attribute.service';
import {Product} from '../../interfaces/product';
import {ProductCategory} from '../../interfaces/product-category';
import {ProductSubCategory} from '../../interfaces/product-sub-category';
import {ProductFilter} from '../../interfaces/product-filter';
import {NgxSpinnerService} from 'ngx-spinner';
import {MatRadioChange} from '@angular/material/radio';
import { MatSliderChange } from '@angular/material/slider';

@Component({
  selector: 'app-product-list',
  templateUrl: './all-product-list.component.html',
  styleUrls: ['./all-product-list.component.scss']
})
export class AllProductListComponent implements OnInit, OnDestroy {

  // SUBSCRIPTION
  private subProduct: Subscription;
  private subCat: Subscription;
  private subSubCat: Subscription;
  private subAcRoute: Subscription;
  private subForm: Subscription;

  // Store Data
  products: Product[] = [];
  categories: ProductCategory[] = [];
  subCategories: ProductSubCategory[] = [];


  // Price Range
  minPrice: number = null;
  maxPrice: number = null;
  rangeSet = false;
  priceRange: { min: number; max: number } = {min: 0, max: 0};

  // Pagination
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 16;
  // totalProductsStore = 0;

  // Query
  query: ProductFilter = null;

  // For Reset
  catFilter: any;
  subCatFilter: any;

  select = 'productName images productSlug price discountType discountAmount category brand';

  // MOBILE FILTER DIALOG
  @ViewChild('dialogFilter') dialogFilter: any;


  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private attributeService: AttributeService,
    private router: Router,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    
    console.log('on init');
    
    // GET PAGE FROM QUERY PARAM
    this.subAcRoute = this.activatedRoute.queryParams.subscribe(qParam => {
      if (qParam && qParam.page) {
        this.currentPage = qParam.page;
      } else {
        this.currentPage = 1;
      }
      this.rangeSet = false;
      this.getAllProducts();
    });

    // GET
    this.getAllCategory();

  }

  onInputChangeMin(event: MatSliderChange) {
    this.router.navigate([], {queryParams: {page: 1}});
    setTimeout(() => {
      this.rangeSet = true;
      this.minPrice = event.value;
      this.onFilterPriceRange();
    }, 500);

  }

  onInputChangeMax(event: MatSliderChange) {
    this.router.navigate([], {queryParams: {page: 1}});
    setTimeout(() => {
      this.rangeSet = true;
      this.maxPrice = event.value;
      this.onFilterPriceRange();
    }, 500);
  }

  /**
   * OPEN FILTER DIALOG
   */

  public openTemplateDialog(data?: any) {
    this.dialog.open(this.dialogFilter, {
      data,
      panelClass: ['theme-dialog', 'dialog-no-radius'],
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      autoFocus: false,
      disableClose: false,
    });
  }


  /**
   * HTTP REQ HANDLE
   */

  private getAllProducts() {
    this.spinner.show();

    const pagination: Pagination = {
      pageSize: this.productsPerPage.toString(),
      currentPage: this.currentPage.toString()
    };

    this.subProduct = this.productService.getAllProducts(pagination, {...this.query, ...{approval: {'$ne': 'not_approved'}}})
      .subscribe(res => {
        console.log('Here');
        
        this.products = res.data;
        this.totalProducts = res.count;
        // const min = res.priceRange.minPrice;
        // const max = res.priceRange.maxPrice;
        if (this.totalProducts > 0) {
          this.priceRange.min = res.priceRange.minPrice;
          this.priceRange.max = res.priceRange.maxPrice;
        }
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  private getAllCategory() {
    this.subCat = this.categoryService.getAllCategory()
      .subscribe(res => {
        this.categories = res.data;
      }, error => {
        console.log(error);
      });
  }

  private getAllSubCategory(categoryId: string) {
    this.subSubCat = this.subCategoryService.getSubCategoryByCategoryId(categoryId)
      .subscribe(res => {
        this.subCategories = res.data;
      }, error => {
        console.log(error);
      });
  }

  /**
   * ON FILTER CHANGE
   */

  onFilterPriceRange() {

    if (!this.maxPrice) {
      this.maxPrice = this.priceRange.max;
    }

    if (this.query && this.query.price) {
      delete this.query.price;
    }
    const pQ = {price: {$gte: this.minPrice - 1, $lte: this.maxPrice + 1}};

    this.query = {...this.query, ...pQ};
    console.log(this.query);

    if (this.currentPage > 1) {
      this.router.navigate([], {queryParams: {page: 1}});
    } else {
      this.getAllProducts();
    }

  }


  /**
   * PAGINATION CHANGE
   */
  public onPageChanged(event: any) {
    this.router.navigate([], {queryParams: {page: event}});
  }


  /**
   * SELECTION CHANGE
   * FILTER
   */


  onCatSelectionChange(event: MatRadioChange) {
    this.getAllSubCategory(event.value._id);
    if (this.query && this.query.subCategory) {
      delete this.query.subCategory;
    }
    this.query = {...this.query, ...{category: event.value._id}};
    console.log(this.query);
    if (this.currentPage > 1) {
      this.router.navigate([], {queryParams: {page: 1}});
    } else {
      this.getAllProducts();
    }
  }


  onSubCatSelectionChange(event: MatRadioChange) {
    this.query = {...this.query, ...{subCategory: event.value._id}};
    console.log(this.query);
    this.getAllProducts();
    if (this.currentPage > 1) {
      this.router.navigate([], {queryParams: {page: 1}});
    } else {
      this.getAllProducts();
    }
  }

  /**
   * ON REMOVE
   */
  onClearFilter() {
    this.catFilter = null;
    this.subCatFilter = null;
    this.query = null;
    this.minPrice = null;
    this.maxPrice = null;
    this.router.navigate([], {queryParams: {page: null}, queryParamsHandling: 'merge'});
    this.getAllProducts();
  }

  /**
   * ON DESTROY
   */
  ngOnDestroy() {

    if (this.subAcRoute) {
      this.subAcRoute.unsubscribe();
    }
    if (this.subProduct) {
      this.subProduct.unsubscribe();
    }
    if (this.subCat) {
      this.subCat.unsubscribe();
    }
    if (this.subSubCat) {
      this.subSubCat.unsubscribe();
    }
    if (this.subForm) {
      this.subForm.unsubscribe();
    }
  }

}
