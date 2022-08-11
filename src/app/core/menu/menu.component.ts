import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map} from 'rxjs/operators';
import {LangService} from '../../services/lang.service';
import {TranslateService} from '@ngx-translate/core';
import {MenuSide} from '../../interfaces/menu-side';
import {MenuService} from '../../services/menu.service';
import {NavigationEnd, Router} from '@angular/router';
import {ShopService} from 'src/app/services/shop.service';
import {ShopInfo} from 'src/app/interfaces/shop-info';
import {CategoryMenu} from '../../interfaces/category-menu';
import {MenuCtrService} from '../../services/menu-ctr.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, AfterViewInit {

  @ViewChild('sidenav', {static: true}) sidenav: any;
  @Input() isAdminMenu = false;
  @Input() sideNavMenuList: any[];

  // Language
  activeLang: string = null;
  browserLanguage: string = null;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => {
        return result.matches;
      })
    );

  isMidDevice$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Medium)
    .pipe(
      map(result => {
        return result.matches;
      })
    );

  scrollPosition = 0;

  menus: MenuSide[] = [
    {id: '1', name: 'Home', routerLink: '/', parentId: null, hasSubMenu: false, depth: 0},
    {id: '2', name: 'Products', routerLink: '/all-product-list', parentId: null, hasSubMenu: false, depth: 0},
    {id: '3', name: 'Installation & Repair', routerLink: '/coming-soon', parentId: null, hasSubMenu: false, depth: 0},
    {id: '4', name: 'Offers', routerLink: '/offers', parentId: null, hasSubMenu: false, depth: 0},
    {id: '5', name: 'Blog', routerLink: '/coming-soon', parentId: null, hasSubMenu: false, depth: 0},
    {id: '6', name: 'About Us', routerLink: '/pages/about-us', parentId: null, hasSubMenu: false, depth: 0},
    {id: '7', name: 'Contact Us', routerLink: '/coming-soon', parentId: null, hasSubMenu: false, depth: 0},
  ];

  // Category Menu
  categoryMenus: CategoryMenu[] = [];
  mCategoryMenus: MenuSide[] = [];

  shopInfo: ShopInfo = null;


  constructor(
    private breakpointObserver: BreakpointObserver,
    private langService: LangService,
    public translateService: TranslateService,
    private menuService: MenuService,
    private shopService: ShopService,
    public router: Router,
    private menuCtrService: MenuCtrService,
  ) {
    window.addEventListener('scroll', this.scrolling, true);
  }

  ngOnInit() {

    this.getShopInfo();

    this.langService.languageChanged$.subscribe(data => {
      this.activeLang = data;
    });

    this.translateService.addLangs(['en', 'bn']);
    this.translateService.setDefaultLang('en');
    this.browserLanguage = this.translateService.getDefaultLang();
    this.translateService.use(this.browserLanguage.match(/en|bn/) ? this.browserLanguage : 'en');

    // GET DATA
    this.getAllCategoryMenu();

  }

  /**
   * Convert Menu to Menu Sidenav
   */

  private convertMenuToSideMenu() {
    const deep1: any[] = [];
    const deep2: any[] = [];
    const deep3: any[] = [];
    this.categoryMenus.forEach((f, i) => {
      const fData = {
        ...f,
        ...{parentId: null, routerLink: `/product-list/${f.slug}`, hasSubMenu: f.hasChild && f.hasChild.length > 0, depth: 1, hasChild: []}
      };
      deep1.push(fData);
      if (f.hasChild && f.hasChild.length > 0) {
        f.hasChild.forEach(g => {
          const gData = {
            ...g,
            ...{
              parentId: f.id,
              routerLink: `/product-list/${f.slug}/${g.slug}`,
              hasSubMenu: g.hasChild && g.hasChild.length > 0,
              depth: 2,
              hasChild: []
            }
          };
          deep2.push(gData);
          if (g.hasChild && g.hasChild.length > 0) {
            g.hasChild.forEach(h => {
              const hData = {
                ...h,
                ...{parentId: g.id, routerLink: `/product-list/${f.slug}/${g.slug}/${h.slug}`, hasSubMenu: false, depth: 3, hasChild: []}
              };
              deep3.push(hData);
            });
          }
        });
      }
    });

    const finalArray = [...deep1, ...deep2, ...deep3];
    this.mCategoryMenus = finalArray as MenuSide[];
    console.log(this.mCategoryMenus);
  }

  private getShopInfo() {

    this.shopService.getShopInfo()
      .subscribe(res => {
        this.shopInfo = res.data;
        console.log(this.shopInfo);
        // getting social links
        // if (this.shopInfo.socialLinks) {
        //   this.facebookLinks = this.shopInfo.socialLinks.
        // }
      }, err => {
        console.log(err);
      });
  }

  // Scroll Control
  private scrolling = () => {
    this.scrollPosition = window.pageYOffset
      || document.documentElement.scrollTop
      || document.body.scrollTop || 0;
  };

  /**
   * ON CHANGE LANGUAGE
   */
  selectLang(lang: string) {
    this.langService.setLanguage$(lang);
    this.translateService.use(this.activeLang);

  }

  private getAllCategoryMenu() {
    this.menuService.getAllCategoryMenuNoRepeat()
      .subscribe(res => {
        this.categoryMenus = res.data;
        if (this.categoryMenus) {
          this.convertMenuToSideMenu();
        }
      }, error => {
        console.log(error);
      });
  }

  ngAfterViewInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.sidenav.close();
      }
    });
    this.menuCtrService.expandActiveSubMenu(this.menus);
  }


}
