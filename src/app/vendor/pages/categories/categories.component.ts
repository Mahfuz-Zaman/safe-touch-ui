import {Component, OnInit} from '@angular/core';
import {CategoryService} from '../../../services/category.service';
import {ProductCategory} from '../../../interfaces/product-category';
import {UiService} from '../../../services/ui.service';
import {ReloadService} from '../../../services/reload.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  // Demo list of parent categories
  categories: ProductCategory[] = [];

  constructor(
    private categoryService: CategoryService,
    private uiService: UiService,
    private reloadService: ReloadService,
  ) {
  }

  ngOnInit(): void {
    this.reloadService.refreshCategories$
      .subscribe(() => {
        this.getAllCategory();
      });
    this.getAllCategory();
  }


  /**
   * HTTP REQ HANDLE
   */

  private getAllCategory() {
    this.categoryService.getAllCategory()
      .subscribe(res => {
        console.log(res);
        this.categories = res.data;
      }, error => {
        console.log(error);
      });
  }


}
