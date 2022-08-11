import {Component, OnInit, ViewChild} from '@angular/core';
import {UtilsService} from '../../../../services/utils.service';
import {UiService} from '../../../../services/ui.service';
import {ProductBrand} from '../../../../interfaces/product-brand';
import {ProductCategory} from '../../../../interfaces/product-category';
import {ProductSubCategory} from '../../../../interfaces/product-sub-category';
import {BrandService} from '../../../../services/brand.service';
import {CategoryService} from '../../../../services/category.service';
import {SubCategoryService} from '../../../../services/sub-category.service';
import {MatSelect, MatSelectChange} from '@angular/material/select';
import {CategoryMenu, HasChild2} from '../../../../interfaces/category-menu';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import {MenuService} from '../../../../services/menu.service';
import {ActivatedRoute} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-add-category-menu',
  templateUrl: './add-category-menu.component.html',
  styleUrls: ['./add-category-menu.component.scss']
})
export class AddCategoryMenuComponent implements OnInit {


  priority: number = null;
  categoryMenu: CategoryMenu = null;

  // Store Product
  id: string = null;
  storedCategoryMenu: CategoryMenu = null;

  // SELECTED DATA

  // SELECT DATA
  brands: ProductBrand[] = [];
  categories: ProductCategory[] = [];
  subCategories: ProductSubCategory[] = [];

  @ViewChild('inputElement') inputElement: any;
  @ViewChild('matSelectCat') matSelectCat: MatSelect;
  @ViewChild('matSelectSubCat') matSelectSubCat: MatSelect;

  constructor(
    private utilsService: UtilsService,
    private uiService: UiService,
    private brandService: BrandService,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private menuService: MenuService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {


    this.getAllCategory();
    this.getAllBrands();

    // GET ID FORM PARAM
    this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getCategoryMenuById();
      }
    });

  }

  /**
   * CONFIRM DIALOG
   */
  public openConfirmDialog() {
    if (this.priority === null) {
      this.uiService.wrong('Priority is required');
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Save',
        message: 'Are you sure you want save this menu?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        if (this.id) {
          const finalData = {...this.categoryMenu, ...{_id: this.id}};
          this.updateCategoryMenu(finalData);
        } else {
          this.addNewCategoryMenu();
        }
      }
    });
  }


  /**
   * SELECTIONS
   */
  onSelectCategory(event: MatSelectChange) {
    this.categoryMenu = {
      id: event.value._id,
      name: event.value.categoryName,
      slug: event.value.categorySlug,
      icon: event.value.image,
      hasChild: [],
      priority: this.priority
    };

    this.getSubCategoryByCategoryId(event.value._id);
    // console.log(this.primaryMenu);
  }

  onSelectSubCat(event: MatSelectChange) {
    this.categoryMenu.hasChild = event.value.map(m => {
      return {
        id: m._id,
        name: m.subCategoryName,
        slug: m.subCategorySlug,
        hasChild: [],
        priority: null,
      };
    });
  }

  onSelectSubCatBrand(event: MatSelectChange, index: number) {
    this.categoryMenu.hasChild[index].hasChild = event.value.map(m => {
      return {
        id: m._id,
        name: m.brandName,
        slug: m.brandSlug,
        hasChild: [],
        priority: null,
      };
    });
  }

  priorityChangeFn(event: any) {
    if (this.categoryMenu === null) {
      this.categoryMenu = {
        id: null,
        name: null,
        slug: null,
        hasChild: [],
        priority: event
      };
    } else {
      this.categoryMenu.priority = event;
    }

  }


  /**
   * HTTP REQ HANDLE
   */

  private getAllCategory() {
    this.categoryService.getAllCategory()
      .subscribe(res => {
        this.categories = res.data;
      }, error => {
        console.log(error);
      });
  }

  private getSubCategoryByCategoryId(categoryId: string) {
    this.subCategoryService.getSubCategoryByCategoryId(categoryId)
      .subscribe(res => {
        this.subCategories = res.data;
        if (this.id) {
          this.matSelectSubCat.value = this.subCategories.filter(arr1 =>
            this.categoryMenu.hasChild.filter(arr2 => arr2.id === arr1._id).length !== 0);

        }
      }, error => {
        console.log(error);
      });
  }

  private getAllBrands() {
    this.brandService.getAllBrands()
      .subscribe(res => {
        this.brands = res.data;
      }, error => {
        console.log(error);
      });
  }


  private addNewCategoryMenu() {
    this.spinner.show();
    this.menuService.addNewCategoryMenu(this.categoryMenu)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.categoryMenu = null;
        this.subCategories = [];
        this.priority = null;
        this.spinner.hide();
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }

  private updateCategoryMenu(data: CategoryMenu) {
    this.spinner.show();
    this.menuService.updateCategoryMenu(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.spinner.hide();
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }

  private getCategoryMenuById() {
    this.spinner.show();
    this.menuService.getCategoryMenuById(this.id)
      .subscribe(res => {
        this.storedCategoryMenu = res.data;
        this.categoryMenu = this.storedCategoryMenu;

        this.getSubCategoryByCategoryId(this.categoryMenu.id);
        if (this.storedCategoryMenu) {
          this.setData();
        }
        this.spinner.hide();
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }

  /**
   * SET DATA
   */

  private setData() {
    this.priority = this.storedCategoryMenu.priority;
    this.matSelectCat.value = this.categories.find(f => f._id === this.storedCategoryMenu.id);
  }

  getBrand(childBrands: HasChild2[]) {
    if (this.id) {
      return this.brands.filter(arr1 =>
        childBrands.filter(arr2 => arr2.id === arr1._id).length !== 0);
    } else {
      return null;
    }
  }
}
