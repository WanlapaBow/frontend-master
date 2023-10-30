import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
import { CommonService } from '../../../../_helpers/common.service';
import { InterfaceAllService } from '../interface-all.service';

@Component({
  selector: 'ngx-interface-button-download',
  template: ` <button
    class="btn"
    nbButton
    size="small"
    status="warning"
    [disabled]="params.data['status'] !== 'Error'"
    (click)="click(params.value)"
  >
    Download Log
  </button>`,
  styleUrls: [],
})
export class InterfaceButtonDownloadComponent implements OnInit {
  @ViewChild('.btn') button: ElementRef;
  public params: ICellRendererParams;

  constructor(
    private service: InterfaceAllService,
    public commonService: CommonService,
  ) {}

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  ngOnInit(): void {}

  click(event): void {
    this.service.getDownloadLog(event);
  }
}
