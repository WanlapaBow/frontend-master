import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ICellRendererParams } from 'ag-grid-community';
import { CommonService } from '../../../../_helpers/common.service';
import { St002txService } from '../st002tx.service';

@Component({
  selector: 'ngx-download-log-btn',
  template: ` <button
    class="btn"
    nbButton
    size="small"
    status="warning"
    [disabled]="
      params.data['status'] === 'Importing' ||
      params.data['status'] === 'Validating'
    "
    (click)="click(params.value)"
  >
    Download Log
  </button>`,
  styleUrls: [],
})
export class DownloadLogBtnComponent implements OnInit {
  @ViewChild('.btn') button: ElementRef;
  public params: ICellRendererParams;

  constructor(
    private service: St002txService,
    public commonService: CommonService,
    private toastrService: NbToastrService,
  ) {}

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  ngOnInit(): void {
    // this.params = params;
  }

  click(event): void {
    let filename;
    if (event === '') {
      filename = 'FormatError';
    } else {
      filename = event;
    }
    this.service.getLogFile$(filename).subscribe((response: any) => {
      if (response.body.size > 0) {
        window.open(response.url, '_blank');
        this.toastrService.show(
          'โหลดข้อมูลขนาด ' +
            this.commonService.bytesToSize(response.body.size),
          'Log Download',
          {
            status: 'success',
            duration: 5000,
          },
        );
      } else {
        this.toastrService.show('ไม่พบข้อมูล', 'Log Download', {
          status: 'warning',
          duration: 5000,
        });
      }
    });
  }
}
