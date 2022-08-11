import {Component, OnInit} from '@angular/core';
import {ProductAttribute} from '../../../interfaces/product-attribute';
import {AttributeService} from '../../../services/attribute.service';
import {UiService} from '../../../services/ui.service';
import {ReloadService} from '../../../services/reload.service';
import {NgxSpinnerService} from 'ngx-spinner';


@Component({
  selector: 'app-attributes',
  templateUrl: './attributes.component.html',
  styleUrls: ['./attributes.component.scss']
})
export class AttributesComponent implements OnInit {


  attributes: ProductAttribute[] = [];

  constructor(
    private attributeService: AttributeService,
    private uiService: UiService,
    private reloadService: ReloadService,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    this.reloadService.refreshAttributes$
      .subscribe(() => {
        this.getAllAttributes();
      });
    this.getAllAttributes();
  }


  /**
   * HTTP REQ HANDLE
   */

  private getAllAttributes() {
    this.spinner.show();
    this.attributeService.getAllAttributes()
      .subscribe(res => {
        this.attributes = res.data;
        this.spinner.hide();
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }


}
