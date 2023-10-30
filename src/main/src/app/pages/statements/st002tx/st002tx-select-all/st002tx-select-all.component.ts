import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'ngx-st002tx-select-all',
  template: `<input
    type="checkbox"
    [checked]="params.value"
    (change)="onChange($event)"
    #selectAll
  />`,
  styleUrls: [],
})
export class St002txSelectAllComponent implements OnInit {
  public params: ICellRendererParams;

  constructor() {}

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  ngOnInit(): void {
    const datas = this.params.api.getModel();
    datas.forEachNode(function (rowNode, index) {});
  }

  public onChange(event) {
    const data = this.params.api.getModel();
    data.forEachNode(function (rowNode, index) {
      // rowNode.data.isCheck = event.currentTarget.checked;
      rowNode.setDataValue('isCheck', event.currentTarget.checked);
    });
  }
}
