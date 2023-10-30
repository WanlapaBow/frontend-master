import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'ngx-st002tx-checkbox',
  template: `<input
    type="checkbox"
    [checked]="params.value"
    (change)="onChange($event)"
  />`,
  styleUrls: [],
})
export class EmailConfigCheckboxComponent implements OnInit {
  @ViewChild('.checkbox') checkbox: ElementRef;

  public params: ICellRendererParams;

  constructor() {}

  // @ts-ignore
  ngOnInit(): void {
    // const nodeId = this.params.api.getSelectedNodes()[0];
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  public onChange(event) {
    const nodeId = this.params.api.getSelectedNodes()[0];
    const data = this.params.api.getModel();
    data.forEachNode(function (rowNode, index) {
      if (index === Number(nodeId.id)) {
        rowNode.setDataValue('isEnable', event.currentTarget.checked);
      }
    });
  }
}
