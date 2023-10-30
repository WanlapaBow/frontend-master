import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NbSidebarService, NbToastrService } from '@nebular/theme';
import { fromEvent, interval } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { CommonService } from '../../../_helpers/common.service';
import { defaultCofDef, logSetting } from './ag-grid.config';
import { InterfaceAllService } from './interface-all.service';

@Component({
  selector: 'ngx-interface-all',
  templateUrl: './interface-all.component.html',
  styleUrls: ['./interface-all.component.scss'],
})
export class InterfaceAllComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('searchStatementNumFrom', { static: true })
  statementNumFrom: ElementRef;
  @ViewChild('searchStatementNumTo', { static: true })
  statementNumTo: ElementRef;
  statementNumberList$: any[] = [];
  form: FormGroup;
  isLoading: boolean = false;
  isShowLog: boolean = true;
  columnDefs: any;
  defaultColDef: any;
  rowData: any;
  paginationPageSize: any;
  sortingOrder: any;
  totalPages: any = 0;
  isFirstPage: any;
  isLastPage: any;
  toastrMsg = {
    waiting: {
      message: 'กำลังค้นหาข้อมูล',
      title: 'กำลังค้นหา',
    },
    noData: {
      message: 'ไม่พบข้อมูล',
      title: 'สำเร็จ',
    },
    noFile: {
      message: 'ไม่พบข้อมูลไฟล์',
      title: 'ไม่สำเร็จ',
    },
    searchSuccess: {
      message: 'ค้นหาข้อมูลสำเร็จ',
      title: 'สำเร็จ',
    },
    saveSuccess: {
      message: 'บันทึกข้อมูลสำเร็จ',
      title: 'สำเร็จ',
    },
    error: {
      message: 'ค้นหาข้อมูลไม่สำเร็จ',
      title: 'ไม่สำเร็จ',
    },
  };
  statementNumberSelect: any[];
  customerClassInvalid: boolean = false;
  xcust: any;
  param: string;
  intervalData: any;
  isInterval: boolean = false;
  currentPage: any = 0;
  gridHeaderApi: any;
  tempLogData: any;
  gridColumnApi: any;

  constructor(
    public commonService: CommonService,
    private toastrService: NbToastrService,
    private service: InterfaceAllService,
    private sidebarService: NbSidebarService,
    private _activatedroute: ActivatedRoute,
  ) {
    this._activatedroute.paramMap.subscribe((params) => {
      this.param = params.get('id');
      this.getNameAndXcust();
      this.columnDefs = logSetting;
      this.defaultColDef = defaultCofDef;
      if (this.isInterval) {
        this.destroy();
      }
      this.clearData();
    });
  }

  ngOnInit(): void {
    this.sidebarService.compact('menu-sidebar');
    this.form = new FormGroup({
      businessUnit: new FormControl(
        { value: '', disabled: false },
        Validators.required,
      ),
      customerClass: new FormControl(
        { value: '', disabled: false },
        Validators.required,
      ),
      statementNumberFrom: new FormControl({ value: '', disabled: false }),
      statementNumberTo: new FormControl({ value: '', disabled: false }),
    });
    this.paginationPageSize = 10;
    this.sortingOrder = ['desc', 'asc'];
    this.getLogHistory();
  }

  ngOnDestroy() {
    this.destroy();
  }

  ngAfterViewInit() {
    fromEvent(this.statementNumFrom.nativeElement, 'keyup')
      .pipe(
        debounceTime(1000),
        tap((event: KeyboardEvent) => {
          this.getStatementNumberFrom();
        }),
      )
      .subscribe();
    fromEvent(this.statementNumTo.nativeElement, 'keyup')
      .pipe(
        debounceTime(1000),
        tap((event: KeyboardEvent) => {
          this.getStatementNumberTo();
        }),
      )
      .subscribe();
  }

  getStatementNumberFrom() {
    this.commonService
      .getStatementNumberGL$(this.form.value.statementNumberFrom)
      .pipe(debounceTime(5000))
      .subscribe((response) => {
        this.statementNumberList$ = response.payload;
      });
  }

  getStatementNumberTo() {
    this.commonService
      .getStatementNumberGL$(this.form.value.statementNumberTo)
      .pipe(debounceTime(5000))
      .subscribe((response) => {
        this.statementNumberList$ = response.payload;
      });
  }

  onGridReady(params) {
    this.gridHeaderApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  getLogHistory() {
    this.isShowLog = true;
    // this.isLoading = true;
    if (this.isInterval) {
      this.destroy();
      this.getLog(this.currentPage, this.paginationPageSize);
    } else {
      this.getLog(this.currentPage, this.paginationPageSize);
    }
  }

  onChangeCustomerClass() {
    this.customerClassInvalid = false;
  }

  onCustomerClassChange() {
    this.form.get('customerName').setValue('');
    this.form.get('siteNumber').setValue('');
    this.form.get('customerCode').setValue('');
  }

  onSync() {
    this.isLoading = true;
    if (this.isInterval) {
      this.destroy();
    }
    let body;
    if (this.form.value.statementNumberFrom) {
      body = {
        custId: this.xcust.xcust,
        businessUnit: this.form.value.businessUnit,
        customerClass: this.form.value.customerClass,
        statementNumberFrom: this.form.value.statementNumberFrom,
        statementNumberTo: this.form.value.statementNumberTo,
      };
    } else {
      body = {
        custId: this.xcust.xcust,
        businessUnit: this.form.value.businessUnit,
        customerClass: this.form.value.customerClass,
      };
    }
    // body = {
    //   statementId: this.statementNumberSelect['0'].code === undefined ? '' : this.statementNumberSelect['0'].code,
    //   custId: this.xcust.xcust,
    //   businessUnit: this.form.value.businessUnit,
    //   customerClass: this.form.value.customerClass,
    //   statementNumberFrom: this.form.value.statementNumberFrom ? this.form.value.statementNumberFrom : '',
    //   statementNumberTo: this.form.value.statementNumberTo ? this.form.value.statementNumberTo : '',
    // };
    this.service.syncGL(body).subscribe(
      (res) => {
        if (res['status'] === 'OK') {
          this.isLoading = false;
          // this.rowData = res['payload'].content;
          this.toastrService.show(
            this.toastrMsg.saveSuccess.message,
            this.toastrMsg.saveSuccess.title,
            {
              status: 'success',
              duration: 5000,
              destroyByClick: true,
              limit: 1,
            },
          );
          if (!this.isInterval) {
            this.getLog(this.currentPage, this.paginationPageSize);
            this.setInterval();
          }
        } else {
          this.isLoading = false;
          this.toastrService.show(
            this.toastrMsg.error.message,
            this.toastrMsg.error.title,
            {
              status: 'danger',
              duration: 5000,
              destroyByClick: true,
              limit: 1,
            },
          );
          // this.getLog(0, this.paginationPageSize);
        }
      },
      (error) => {
        this.isLoading = false;
        this.toastrService.show(error.message, this.toastrMsg.error.title, {
          status: 'danger',
          duration: 5000,
          destroyByClick: true,
          limit: 1,
        });
        this.isLoading = false;
      },
    );
  }

  async onPageSizeChanged(event: any) {
    await this.destroy();
    this.gridHeaderApi.paginationSetPageSize(Number(event.paginationPageSize));
    this.paginationPageSize = Number(event.paginationPageSize);
    // this.getLog(event.currentPage, event.paginationPageSize);
    await this.getLogHistory();
    this.currentPage = event.currentPage;
    this.paginationPageSize = event.paginationPageSize;
  }

  async onBt(event: any) {
    await this.destroy();
    this.paginationPageSize = event.paginationPageSize;
    this.currentPage = event.currentPage;
    await this.getLogHistory();
    // this.getLog(event.currentPage, event.paginationPageSize);
  }

  autoChange(option: any) {
    this.statementNumberSelect = this.statementNumberList$.filter(
      (x) => x.name === option,
    );
  }

  private getLog(index, limit) {
    this.service.getLog(index, limit, this.xcust.xcust).subscribe(
      (res) => {
        if (res['status'] === 'OK') {
          this.isShowLog = true;
          // this.toastrService.show(this.toastrMsg.searchSuccess.message,
          //   this.toastrMsg.searchSuccess.title, {
          //     status: 'success',
          //     duration: 5000,
          //     destroyByClick: true,
          //     limit: 1,
          //   });
          if (this.isInterval) {
            this.tempLogData = res['payload'].content;
            if (this.gridHeaderApi.getDisplayedRowCount() > 0) {
              this.updateLog(this.tempLogData);
            }
            // this.gridHeaderApi.applyTransactionAsync({ update: res['payload'].content });
          } else {
            this.rowData = res['payload'].content;
            this.setInterval();
            this.setSort();
            // this.gridHeaderApi.applyTransactionAsync({ add: res['payload'].content });
          }
          this.rowData = res['payload'].content;
          this.totalPages = res['payload'].totalPages;
          this.isLastPage = res['payload'].last;
          this.isFirstPage = res['payload'].first;
          this.isLoading = false;
        } else {
          this.toastrService.show(
            this.toastrMsg.error.message,
            this.toastrMsg.error.title,
            {
              status: 'danger',
              duration: 5000,
              destroyByClick: true,
              limit: 1,
            },
          );
          if (this.isInterval) {
            this.destroy();
          }
        }
      },
      (error) => {
        if (this.isInterval) {
          this.destroy();
        }
        this.toastrService.show(error.message, this.toastrMsg.error.title, {
          status: 'danger',
          duration: 5000,
          destroyByClick: true,
          limit: 1,
        });
      },
    );
  }

  private getNameAndXcust() {
    switch (this.param) {
      case 'in003tx':
        this.xcust = {
          title: 'AR Receipt Interface',
          xcust: 'in003',
        };
        // code block
        break;
      case 'in0643tx':
        this.xcust = {
          title: 'AP WHT Interface',
          xcust: 'in0643',
        };
        // code block
        break;
      case 'in0077tx':
        this.xcust = {
          title: 'GL Cancel Advance Receipt',
          xcust: 'in0077',
        };
        // code block
        break;
      case 'in0644tx':
        this.xcust = {
          title: 'GL Cancel Advance Withholding Tax',
          xcust: 'in0644',
        };
        // code block
        break;
      default:
      // code block
    }
  }

  private setInterval() {
    this.isInterval = true;
    this.intervalData = interval(13000).subscribe((x) => {
      this.getLog(this.currentPage, this.paginationPageSize);
    });
  }

  private destroy() {
    if (this.isInterval) {
      this.intervalData.unsubscribe();
    }
    this.isInterval = false;
  }

  private clearData() {
    this.rowData = [];
    if (this.form !== undefined) {
      this.form.reset();
    }
  }

  updateLog(updateData: any) {
    const itemsToUpdate = [];
    const itemsToAdd = [];
    const dataLogDisplay = this.gridHeaderApi.getModel().rowsToDisplay;
    updateData.forEach((node) => {
      const tempDisplay = dataLogDisplay.filter(
        (x) => x.data.instanceId === node.instanceId,
      );
      if (tempDisplay.length > 0) {
        const data = tempDisplay[0].data;
        // data.message = node.message;
        data.status = node.status;
        itemsToUpdate.push(data);
      } else {
        itemsToAdd.push(node);
      }
    });
    if (itemsToAdd.length > 0) {
      this.gridHeaderApi.applyTransaction({ add: itemsToAdd });
    } else if (itemsToUpdate.length > 0) {
      this.gridHeaderApi.applyTransaction({ update: itemsToUpdate });
    }
  }
  setSort() {
    this.gridColumnApi.applyColumnState({
      state: [
        {
          colId: 'instanceId',
          sort: 'desc',
        },
      ],
      defaultState: { sort: null },
    });
  }
}
