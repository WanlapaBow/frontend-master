import { Component } from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';

@Component({
  selector: 'ngx-in035tx-button',
  templateUrl: './in035tx-button.component.html',
  styleUrls: [],
})
export class In035txButtonComponent  implements ICellRendererAngularComp {
  params: any;
  constructor() {}

  agInit(params: any): void {
    this.params = params;
  }
  refresh(params?: any): boolean {
    return true;
  }
  onClick() {
    this.params.context.componentParent.methodFromParent(
      this.params.node.data.reportJobInfoId,
    );
    // this.params.onClick(this.params.data);
  }
}
