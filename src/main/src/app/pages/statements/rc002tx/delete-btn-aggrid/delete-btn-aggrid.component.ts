import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular/public-api';
import { CommonService } from '../../../../_helpers/common.service';

@Component({
  selector: 'ngx-delete-btn-aggrid',
  template: ` <button
    class="btn"
    nbButton
    size="small"
    status="danger"
    [disabled]="params.data['isDelete'] !== 'CONFIRMED'"
    (click)="onClick($event)"
  >
    <nb-icon icon="trash-2-outline"></nb-icon>
    Delete
  </button>`,
  styleUrls: ['./delete-btn-aggrid.component.scss'],
})
export class DeleteBtnAggridComponent implements ICellRendererAngularComp {
  label: string;
  params: any;
  isDisable: string;

  constructor(public commonService: CommonService) {}

  agInit(params: any): void {
    this.params = params;
    this.isDisable = this.params.data;
  }

  refresh(params?: any): boolean {
    return true;
  }

  onClick(event) {
    this.params.onClick(this.params.data);
  }
}
