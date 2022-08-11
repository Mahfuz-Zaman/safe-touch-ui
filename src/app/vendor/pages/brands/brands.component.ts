import {Component, OnInit} from '@angular/core';
import {BrandService} from '../../../services/brand.service';
import {ProductBrand} from '../../../interfaces/product-brand';
import {UiService} from '../../../services/ui.service';
import {ReloadService} from '../../../services/reload.service';

@Component({
  selector: 'app-parent-categories',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss']
})
export class BrandsComponent implements OnInit {

  // Demo list of parent categories
  brands: ProductBrand[] = [];

  constructor(
    private brandService: BrandService,
    private uiService: UiService,
    private reloadService: ReloadService,
  ) {
  }

  ngOnInit(): void {
    this.reloadService.refreshBrands$
      .subscribe(() => {
        this.getAllBrands();
      });
    this.getAllBrands();
  }


  /**
   * HTTP REQ HANDLE
   */

  private getAllBrands() {
    this.brandService.getAllBrands()
      .subscribe(res => {
        this.brands = res.data;
      }, error => {
        console.log(error);
      });
  }

}
