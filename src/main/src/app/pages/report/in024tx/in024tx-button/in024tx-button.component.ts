import { Component } from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';

@Component({
  selector: 'ngx-in024tx-button',
  templateUrl: './in024tx-button.component.html',
  styleUrls: [],
})
export class In024txButtonComponent implements ICellRendererAngularComp {
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
