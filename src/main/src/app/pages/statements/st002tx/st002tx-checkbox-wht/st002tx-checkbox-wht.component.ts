import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'ngx-st002tx-checkbox-wht',
  template: `<input
    type="checkbox"
    [checked]="params.value"
    [disabled]="!params.data['enable']"
    (change)="onChange($event)"
  />`,
  styleUrls: [],
})
export class St002txCheckboxWhtComponent implements OnInit {
  @ViewChild('.checkbox') checkbox: ElementRef;
  public params: ICellRendererParams;
  constructor() {}
  agInit(params: ICellRendererParams): void {
    this.params = params;
  }
  ngOnInit(): void {}
  onChange(event) {
    this.params.value = !this.params.value;
    const nodeId = this.params.api.getSelectedNodes()[0];
    const data = this.params.api.getModel();
    data.forEachNode(function (rowNode, index) {
      if (index === Number(nodeId.id)) {
        rowNode.setDataValue('deductWhtStatus', event.currentTarget.checked);
      }
    });
  }
}
