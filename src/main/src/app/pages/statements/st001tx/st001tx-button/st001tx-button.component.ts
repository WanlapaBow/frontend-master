import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular/public-api';

@Component({
  selector: 'ngx-st001tx-button-delete',
  templateUrl: './st001tx-botton.component.html',
  styleUrls: [],
})
export class St001txButtonComponent implements ICellRendererAngularComp {
  params: any;
  constructor() {}

  agInit(params: any): void {
    this.params = params;
  }
  refresh(params?: any): boolean {
    return true;
  }
  onClickPdf() {
    this.params.context.componentParent.getPdfZip(
      this.params.node.data.requestId,
    );
    // this.params.onClick(this.params.data);
  }
  onClickExcel() {
    this.params.context.componentParent.getExcelZip(
      this.params.node.data.requestId,
    );
    // this.params.onClick(this.params.data);
  }
  onClickPdfKbank() {
    this.params.context.componentParent.getPdfZipKbank(
      this.params.node.data.requestId,
    );
    // this.params.onClick(this.params.data);
  }
  onClickExcelKbank() {
    this.params.context.componentParent.getExcelZipKbank(
      this.params.node.data.requestId,
    );
    // this.params.onClick(this.params.data);
  }
  onLogFile() {
    this.params.context.componentParent.getLogEmail(
      this.params.node.data.requestId,
    );
  }
}
