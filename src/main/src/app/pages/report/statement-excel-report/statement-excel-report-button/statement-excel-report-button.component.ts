import { Component } from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';

@Component({
  selector: 'ngx-receipt-report-button',
  templateUrl: './statement-excel-report-button.component.html',
})
export class StatementExcelReportButtonComponent implements ICellRendererAngularComp {
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
