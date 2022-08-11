import {Component, Input, OnInit} from '@angular/core';
import {FeaturedCategoryService} from '../../../services/featured-category.service';
import {FeaturedCategory} from '../../../interfaces/featured-category';
import { ActivatedRoute } from '@angular/router';
import { Vendor } from 'src/app/interfaces/vendor';
import { VendorDataService } from 'src/app/services/vendor-data.service';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/interfaces/product';

@Component({
  selector: 'app-online-shop-details',
  templateUrl: './online-shop-details.component.html',
  styleUrls: ['./online-shop-details.component.scss']
})
export class OnlineShopDetailsComponent implements OnInit {

  @Input() isLocalShop = false;

  @Input() data: any = null;

  // All Product
  productSlug: string = null;
  relatedProducts: Product[] = [];
  product?: Product;
  productSpecial: any[] = [];

  vendorSlug: string;

  constructor(
    private featuredCategoryService: FeaturedCategoryService,
    private activatedRoute: ActivatedRoute,
    private vendorDataService: VendorDataService,
    private productService: ProductService
  ) { }

  vendorId: string = null;
  vendor: Vendor = null;

  products: Product[] = [];

  /* hide show */
  isOpen = false;

  allFeaturedCategory: FeaturedCategory[];

  toggle(){
    this.isOpen = !this.isOpen;
  }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(param => {
      this.vendorSlug = param.get('slug');
      this.getSingleVendorBySlug();
    });
    // this.activatedRoute.paramMap.subscribe(param => {
    //   this.vendorId = param.get('id');
    //   this.getSingleVendorById();
    // });



    // this.getAllFeaturedCategory();
  }

  private getSingleVendorBySlug() {
    this.vendorDataService.getSingleVendorBySlug(this.vendorSlug)
      .subscribe(res => {
        this.vendor = res.data;
      }, error => {
        console.log(error);
      });
  }

  private getSingleVendorById() {
    this.vendorDataService.getSingleVendorById(this.vendorId)
    .subscribe( res => {
      this.vendor = res.data;
      this.productService.productFilterByQuery([{vendor: this.vendor._id}])
        // tslint:disable-next-line:no-shadowed-variable
      .subscribe( res => {
        this.products = res.data;
        console.log(this.products);
      }, err => {
        console.log(err);
      });
    }, err => {
      console.log(err);
    });
  }

  private getAllFeaturedCategory() {
    this.featuredCategoryService.getAllFeaturedCategory()
      .subscribe(res => {
        this.allFeaturedCategory = res.data;
      }, error => {
        console.log(error);
      });
  }

}
