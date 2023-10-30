import { DecimalPipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  NbDialogService,
  NbSidebarService,
  NbToastrService,
} from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, take, tap } from 'rxjs/operators';
import { CommonService } from '../../../_helpers/common.service';
import { UtilsService } from '../../../_helpers/utils.service';
import {
  ReceiptIdAction,
  StatementAction,
  StatementIdAction,
} from '../../../root-store/statement.action';
import { SearchCustomerComponent } from '../../components/search-customer/search-customer.component';
import {
  defaultColDef,
  invoiceSetting,
  statementSetting,
} from './ag-gird.config';
import { DeleteBtnAggridComponent } from './delete-btn-aggrid/delete-btn-aggrid.component';
import { Rc002txService } from './rc002tx.service';

@Component({
  selector: 'ngx-receipt-manage',
  templateUrl: './rc002tx.component.html',
  styleUrls: ['./rc002tx.component.scss'],
})
export class Rc002txComponent implements OnInit, AfterViewInit {
  @ViewChild('searchStatementNum', { static: true }) input: ElementRef;
  form: FormGroup;
  isShowHeader: boolean = false;
  // flag
  customerClassInvalid: boolean = false;
  isStatementDisable: boolean = false;
  isInvoiceLoading: boolean = false;
  isLineLoading: boolean = false;
  loading: boolean = false;
  isLineShow: boolean;
  flagDelete: boolean = false;
  // param
  title: string;
  tempHeader: any;
  statementNumberList$: Observable<string[]>;
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
  // @ts-ignore
  gridColumnApi: any;
  // @ts-ignore
  gridDetailColumnApi: any;
  rowData: any[] = [];
  // Ag grid
  defaultColDef;
  rowSelection;
  paginationPageSize;
  // private gridApiLine;
  lineData: any;
  columnLineDefs;
  invoiceData: any;
  isShowInvoice: boolean = false;
  columnInvoiceDefs: any;
  page: string;
  sortingOrder: any;
  isDisableComplete: boolean = false;
  // private defaultColGroupDef;
  private gridApiHeader: any;
  // @ts-ignore
  private gridApiLine: any;
  // @ts-ignore
  private defaultColLineDef;
  // @ts-ignore
  private columnDefs: any;
  // @ts-ignore
  private gridApiInvoice: any;
  // @ts-ignore
  private gridInvoiceColumnApi: any;
  localStore: any;
  buttonCheck: any = {
    enableReceiptCompleteButton: false,
    enableInCompleteButton: false,
  };

  constructor(
    public commonService: CommonService,
    private toastrService: NbToastrService,
    private service: Rc002txService,
    private dialogService: NbDialogService,
    private _Activatedroute: ActivatedRoute,
    private sidebarService: NbSidebarService,
    private store: Store<any>,
  ) {
    this.sidebarService.compact('menu-sidebar');
    this.columnDefs = statementSetting;
    this.columnLineDefs = [
      {
        headerName: 'Action',
        field: 'documentNumber',
        width: 140,
        cellRendererFramework: DeleteBtnAggridComponent,
        cellRendererParams: {
          onClick: (params) => this.onDeteleBtn(params),
          label: 'Click 1',
        },
      },
      {
        headerName: 'DOCUMENT NUMBER',
        field: 'documentNumber',
      },
      {
        headerName: 'RECEIPT METHOD',
        field: 'receiptMethodName',
      },
      {
        headerName: 'RECEIPT NUMBER',
        field: 'receiptNumber',
      },
      {
        headerName: 'RECEIPT AMOUNT',
        field: 'receiptAmount',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
      },
      {
        headerName: 'APPLIED AMOUNT',
        field: 'appliedAmount',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
      },
      {
        headerName: 'SUM WRITE OFF',
        field: 'sumWriteOff',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
      },
      {
        headerName: 'UNAPPLIED AMOUNT',
        field: 'unAppliedAmount',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
      },
      {
        headerName: 'RECEIPT DATE',
        field: 'receiptDate',
        valueFormatter: function (params) {
          return params.value !== null
            ? new UtilsService().dateFormatUtc(params.value)
            : '-';
        },
      },
      {
        headerName: 'APPLICATION DATE',
        field: 'applicationDate',
        valueFormatter: function (params) {
          return params.value !== null
            ? new UtilsService().dateFormatUtc(params.value)
            : '-';
        },
      },
      {
        headerName: 'ACCOUNTING DATE',
        field: 'accountingDate',
        valueFormatter: function (params) {
          return params.value !== null
            ? new UtilsService().dateFormatUtc(params.value)
            : '-';
        },
      },
      {
        headerName: 'MATURITY DATE',
        field: 'maturityDate',
        valueFormatter: function (params) {
          return params.value !== null
            ? new UtilsService().dateFormatUtc(params.value)
            : '-';
        },
      },
      {
        headerName: 'RECEIPT STATUS',
        field: 'receiptStatus',
      },
    ];
    this.columnInvoiceDefs = invoiceSetting;
    // @ts-ignore
    this.defaultColDef = defaultColDef;
    this.rowSelection = 'multiple';
    this.paginationPageSize = 10;
    this.sortingOrder = ['desc', 'asc'];
  }

  ngOnInit(): void {
    this._Activatedroute.paramMap.subscribe((params) => {
      this.page = params.get('id');
      if (this.page === 'create') {
        this.title = 'create';
      } else {
        this.title = 'manage';
      }
    });
    this.form = new FormGroup({
      businessUnit: new FormControl(
        { value: '', disabled: false },
        Validators.required,
      ),
      customerClass: new FormControl(
        { value: '', disabled: false },
        Validators.required,
      ),
      customerSubClass: new FormControl({ value: '', disabled: false }),
      customerName: new FormControl({ value: '', disabled: false }),
      siteNumber: new FormControl({ value: '', disabled: false }),
      customerCode: new FormControl({ value: '', disabled: false }),
      statementNumber: new FormControl({ value: '', disabled: false }),
      status: new FormControl(
        { value: 'CONFIRMED', disabled: false },
        Validators.required,
      ),
    });
    this.store
      .pipe(select('statement'))
      .pipe(take(1))
      .subscribe((res) => (this.localStore = res));
    if (this.localStore.statement && this.localStore.pageId === 'rc002tx') {
      this.setInitStatementQuery();
    }
  }
  ngAfterViewInit() {
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(1000),
        tap((event: KeyboardEvent) => {
          this.getStatementNumber();
        }),
      )
      .subscribe();
  }

  clear() {
    this.isShowHeader = false;
    this.isLineShow = false;
    this.isShowInvoice = false;
    this.rowData = [];
    this.lineData = [];
    this.invoiceData = [];
    this.form.reset();
    this.customerClassInvalid = false;
    this.form.get('status').setValue('CONFIRMED');
    this.form.get('businessUnit').setValue('');
    this.form.get('customerClass').setValue('');
    this.form.get('customerName').setValue('');
    this.form.get('siteNumber').setValue('');
    this.form.get('customerCode').setValue('');
    this.form.get('statementNumber').setValue('');
  }

  onGridReady(params) {
    this.gridApiHeader = params.api;
    // @ts-ignore
    this.gridColumnApi = params.columnApi;
  }

  onGridReadyLine(params) {
    // @ts-ignore
    this.gridApiLine = params.api;
    // @ts-ignore
    this.gridDetailColumnApi = params.columnApi;
  }

  onGridReadyInvoice(params) {
    // @ts-ignore
    this.gridApiInvoice = params.api;
    // @ts-ignore
    this.gridInvoiceColumnApi = params.columnApi;
  }

  onPaginationChanged(event) {
    if (this.gridApiHeader) {
    }
  }

  onSelectReciept(event) {
    if (event.type === 'rowClicked' && this.flagDelete !== true) {
      this.isInvoiceLoading = true;
      const reciptSelect = event.data;
      const id = 'rc002tx',
        data = reciptSelect.documentNumber;
      this.store.dispatch(new ReceiptIdAction(id, data));
      this.service.getInvoiceDetailById(reciptSelect.documentNumber).subscribe(
        (responce) => {
          if (
            responce['status'] === 'OK' &&
            responce['payload'].content.length > 0
          ) {
            this.invoiceData = responce['payload'].content;
            this.isShowInvoice = true;
            this.toastrService.show(
              this.toastrMsg.searchSuccess.message,
              this.toastrMsg.searchSuccess.title,
              {
                status: 'success',
                duration: 5000,
                destroyByClick: true,
              },
            );
            this.isInvoiceLoading = false;
          } else if (responce['status'] === 'NOT_FOUND') {
            this.invoiceData = [];
            this.toastrService.show(
              this.toastrMsg.noData.message,
              this.toastrMsg.noData.title,
              {
                status: 'warning',
                duration: 5000,
                destroyByClick: true,
              },
            );
            this.isInvoiceLoading = false;
          } else {
            this.invoiceData = [];
            this.toastrService.show(
              this.toastrMsg.noData.message,
              this.toastrMsg.noData.title,
              {
                status: 'warning',
                duration: 5000,
                destroyByClick: true,
              },
            );
            this.isInvoiceLoading = false;
          }
        },
        (error) => {
          this.toastrService.show(error.message, this.toastrMsg.error.title, {
            status: 'danger',
            duration: 5000,
            destroyByClick: true,
          });
          this.isInvoiceLoading = false;
        },
      );
    }
  }

  getStatementNumber() {
    this.commonService
      .getStatementNumber$(this.form.value.statementNumber)
      .pipe(debounceTime(5000))
      .subscribe((response) => {
        this.statementNumberList$ = response.payload;
      });
  }

  onSelectionStatement(event: any) {
    this.isLineLoading = true;
    this.isLineShow = true;
    this.isShowInvoice = false;
    this.invoiceData = [];
    this.tempHeader = event.data;
    if (this.tempHeader.statementStatus !== 'CONFIRMED') {
      this.isStatementDisable = true;
    }
    this.getRecieptLine();
    this.getButtonCheck(event.data.statementNumber);
  }

  onSearchStatement() {
    this.loading = true;
    this.isShowHeader = true;
    this.lineData = [];
    this.isLineShow = false;
    this.isShowInvoice = false;
    this.getStatementDetail();
    // setTimeout(() => {
    //   this.loading = false;
    // }, 1000);
  }

  onSearchCustomer() {
    const isCheckSearchPopup = this.form.get('customerClass').valid;
    if (isCheckSearchPopup) {
      this.dialogService
        .open(SearchCustomerComponent, {
          context: {
            customerClass: this.form.value.customerClass,
            customerSubClass: this.form.value.customerSubClass,
          },
        })
        .onClose.subscribe((data) => {
          if (data) {
            this.form.get('customerName').setValue(data.customerName);
            this.form.get('siteNumber').setValue(data.siteNumber);
            this.form.get('customerCode').setValue(data.customerCode);
          }
        });
    } else {
      this.customerClassInvalid = true;
    }
  }

  onChangeCustomerClass() {
    this.customerClassInvalid = false;
  }

  onDeteleBtn(e) {
    this.flagDelete = true;
    this.loading = true;
    this.isLineLoading = true;
    this.isLineShow = true;
    if (confirm('Are you sure Delete?')) {
      this.service.postReceiptDelete(e.documentNumber).subscribe(
        (response: any) => {
          if (response['status'] === 'OK') {
            this.flagDelete = false;
            this.isShowInvoice = false;
            this.invoiceData = [];
            this.getRecieptLine();
            this.getStatementById();
            this.getButtonCheck(this.tempHeader.statementNumber);
            this.toastrService.show('ลบข้อมูลสำเร็จ ', 'Delete Success', {
              status: 'success',
              duration: 5000,
              limit: 1,
            });
          } else {
            this.toastrService.show('ลบข้อมูลไม่สำเร็จ', 'Delete Fail', {
              status: 'warning',
              duration: 5000,
              limit: 1,
            });
            this.flagDelete = false;
          }
        },
        (error) => {
          this.toastrService.show(error.message, this.toastrMsg.error.title, {
            status: 'danger',
            duration: 5000,
            destroyByClick: true,
            limit: 1,
          });
          this.flagDelete = false;
        },
      );
    } else {
      this.flagDelete = false;
      this.loading = false;
      this.isLineLoading = false;
    }
  }

  onComplete() {
    this.loading = true;
    this.service.postCompleteStd(this.tempHeader.statementNumber).subscribe(
      (res) => {
        if (res['status'] === 'OK' && res['payload'].length > 0) {
          this.isLineShow = false;
          this.isShowInvoice = false;
          this.invoiceData = [];
          this.lineData = [];
          this.getStatementDetail();
        } else {
          this.toastrService.show(
            this.toastrMsg.error.message,
            this.toastrMsg.error.title,
            {
              status: 'warning',
              duration: 5000,
            },
          );
          this.isShowInvoice = false;
          this.invoiceData = [];
        }
      },
      (error) => {
        this.toastrService.show(error.message, this.toastrMsg.error.title, {
          status: 'danger',
          duration: 5000,
          destroyByClick: true,
        });
        this.isShowInvoice = false;
        this.invoiceData = [];
      },
    );
  }

  inComplete() {
    this.loading = true;
    this.service.postInCompleteStd(this.tempHeader.statementNumber).subscribe(
      (res) => {
        if (res['status'] === 'OK' && res['payload'].length > 0) {
          this.isLineShow = false;
          this.lineData = [];
          this.isShowInvoice = false;
          this.invoiceData = [];
          this.getStatementDetail();
        } else {
          this.toastrService.show(
            this.toastrMsg.error.message,
            this.toastrMsg.error.title,
            {
              status: 'warning',
              duration: 5000,
            },
          );
          this.isShowInvoice = false;
          this.invoiceData = [];
        }
      },
      (error) => {
        this.toastrService.show(error.message, this.toastrMsg.error.title, {
          status: 'danger',
          duration: 5000,
          destroyByClick: true,
        });
        this.isShowInvoice = false;
        this.invoiceData = [];
      },
    );
  }

  isShowSubClass: boolean = false;
  customerSubClassList: any = [];
  onCustomerClassChange() {
    this.form.get('customerName').setValue('');
    this.form.get('siteNumber').setValue('');
    this.form.get('customerCode').setValue('');
    this.form.get('customerSubClass').setValue('');
    if (
      this.form.value.customerClass === 'INHOUSE' ||
      this.form.value.customerClass === 'KBANK'
    ) {
      this.commonService
        .getCustomerSubClassSearch(this.form.value.customerClass)
        .pipe(take(1))
        .subscribe(
          (response: any[]) => {
            this.customerSubClassList = response['payload'];
          },
          (err) => console.error(err),
        );
      this.isShowSubClass = true;
      // this.checkInhouse = true;
    } else {
      this.isShowSubClass = false;
      // this.checkInhouse = false;
    }
  }

  onCustomerSubClassChange() {
    this.form.get('customerName').setValue('');
    this.form.get('siteNumber').setValue('');
    this.form.get('customerCode').setValue('');
    // if (this.form.value.customerSubClass !== '') {
    //   this.checkInhouse = false;
    // }
  }

  onClearInput() {
    this.form.get('customerName').setValue('');
    this.form.get('siteNumber').setValue('');
  }

  onClearStatement() {
    this.form.get('statementNumber').setValue('');
  }

  onMatchingReceipt() {
    this.loading = true;
    this.isLineLoading = true;
    this.service.matchingReceipt().subscribe(
      (res: any) => {
        if (res['status'] === 'OK') {
          this.getStatementDetail();
          this.getRecieptLine();
          this.isLineLoading = false;
          this.loading = false;
        } else {
          this.toastrService.show(
            this.toastrMsg.noData.title,
            this.toastrMsg.noData.title,
            {
              status: 'danger',
              duration: 5000,
              destroyByClick: true,
            },
          );
          this.isLineLoading = false;
          this.loading = false;
        }
      },
      (error) => {
        this.toastrService.show(error.message, this.toastrMsg.error.title, {
          status: 'danger',
          duration: 5000,
          destroyByClick: true,
        });
        this.isLineLoading = false;
        this.loading = false;
      },
    );
  }
  onStore() {
    const id = 'rc002tx',
      data = this.form.value;
    this.store.dispatch(new StatementAction(id, data));
  }
  onStore2() {
    const id = 'rc003tx',
      data = this.form.value;
    this.store.dispatch(new StatementAction(id, data));
    // this.store.dispatch(new StatementUpdateAction(id, data));
  }
  async getStatementDetail() {
    const id = 'rc002tx',
      data = this.form.value;
    this.store.dispatch(new StatementAction(id, data));
    await this.service.getSearchStatement(this.form.value).subscribe(
      (result) => {
        if (result['payload'].content.length > 0) {
          this.rowData = result['payload'].content;
          this.toastrService.show(
            this.toastrMsg.searchSuccess.message,
            this.toastrMsg.searchSuccess.title,
            {
              status: 'success',
              duration: 5000,
              destroyByClick: true,
              limit: 1,
            },
          );
          this.loading = false;
        } else {
          this.rowData = [];
          this.loading = false;
          this.toastrService.show(
            this.toastrMsg.noData.message,
            this.toastrMsg.noData.title,
            {
              status: 'warning',
              duration: 5000,
              destroyByClick: true,
              limit: 1,
            },
          );
        }
      },
      (error) => {
        this.loading = false;
        this.toastrService.show(error.message, this.toastrMsg.error.title, {
          status: 'danger',
          duration: 5000,
          destroyByClick: true,
          limit: 1,
        });
      },
    );
  }

  getStatementById() {
    this.service
      .getSearchStatementDetail(this.tempHeader.statementId)
      .subscribe(
        async (result) => {
          if (result['status'] === 'OK') {
            const index = this.rowData.findIndex(
              (x) => x.statementId === this.tempHeader.statementId,
            );
            if (index >= 0) {
              await this.gridApiHeader
                .getRowNode(index)
                .setData(result['payload']);
              this.tempHeader = result['payload'];
              this.loading = false;
            }
          }
        },
        (error) => {
          this.loading = false;
          this.toastrService.show(error.message, this.toastrMsg.error.title, {
            status: 'danger',
            duration: 5000,
            destroyByClick: true,
            limit: 1,
          });
        },
      );
  }

  private getRecieptLine() {
    const id = 'rc002tx',
      data = this.tempHeader.statementId;
    this.store.dispatch(new StatementIdAction(id, data));
    this.service.getRecieptDetailById(this.tempHeader.statementId).subscribe(
      (line) => {
        if (line['payload'].content.length > 0) {
          this.lineData = line['payload'].content;
          this.lineData.map((item) => {
            item.isDelete = this.tempHeader.statementStatus;
          });
          this.isDisableComplete = false;
          this.isLineLoading = false;
        } else {
          this.isDisableComplete = true;
          this.isLineLoading = false;
          this.lineData = [];
        }
      },
      (error) => {
        this.toastrService.show(error.message, this.toastrMsg.error.title, {
          status: 'danger',
          duration: 5000,
          destroyByClick: true,
          limit: 1,
        });
        this.lineData = [];
        this.isLineLoading = false;
      },
    );
  }
  private async setInitStatementQuery() {
    this.form.get('status').setValue(this.localStore.statement.status);
    this.form
      .get('businessUnit')
      .setValue(this.localStore.statement.businessUnit);
    this.form
      .get('customerClass')
      .setValue(this.localStore.statement.customerClass);
    this.form
      .get('customerName')
      .setValue(
        this.localStore.statement.customerName
          ? this.localStore.statement.customerClass
          : '',
      );
    this.form
      .get('siteNumber')
      .setValue(
        this.localStore.statement.siteNumber
          ? this.localStore.statement.siteNumber
          : '',
      );
    this.form
      .get('customerCode')
      .setValue(
        this.localStore.statement.customerCode
          ? this.localStore.statement.customerCode
          : '',
      );
    this.form
      .get('statementNumber')
      .setValue(
        this.localStore.statement.statementNumber
          ? this.localStore.statement.statementNumber
          : '',
      );
    await this.onSearchStatement();
    await this.handleHeaderInit();
    await this.service.getInvoiceDetailById$(this.tempHeader.statementId).then(
      (line) => {
        if (line['payload'].content.length > 0) {
          this.lineData = line['payload'].content;
          this.lineData.map((item) => {
            item.isDelete = this.tempHeader.statementStatus;
          });
          this.isDisableComplete = false;
          this.isLineLoading = false;
        } else {
          this.isDisableComplete = true;
          this.isLineLoading = false;
          this.lineData = [];
        }
      },
      (error) => {
        this.toastrService.show(error.message, this.toastrMsg.error.title, {
          status: 'danger',
          duration: 5000,
          destroyByClick: true,
          limit: 1,
        });
        this.lineData = [];
        this.isLineLoading = false;
      },
    );
    // this.onSearchStatement();
    // setTimeout(() => {
    //   if (this.localStore.statementId) {
    //     const indexStatement = this.rowData.findIndex(x => x.statementId === this.localStore.statementId);
    //     if (indexStatement >= 0) {
    //       // select statement get Receipt
    //       this.isLineLoading = true;
    //       this.isLineShow = true;
    //       this.isShowInvoice = false;
    //       this.invoiceData = [];
    //       this.tempHeader = this.rowData[indexStatement];
    //       if (this.tempHeader.statementStatus !== 'CONFIRMED') {
    //         this.isStatementDisable = true;
    //       }
    //       this.getRecieptLine();
    //     }
    //   }
    // }, 500);
  }
  handleHeaderInit() {
    return new Promise((resolve) => {
      if (this.localStore.statementId) {
        const indexStatement = this.rowData.findIndex(
          (x) => x.statementId === this.localStore.statementId,
        );
        if (indexStatement >= 0) {
          // select statement get Receipt
          this.isLineLoading = true;
          this.isLineShow = true;
          this.isShowInvoice = false;
          this.invoiceData = [];
          this.tempHeader = this.rowData[indexStatement];
          if (this.tempHeader.statementStatus !== 'CONFIRMED') {
            this.isStatementDisable = true;
          }
          this.getRecieptLine();
          this.getButtonCheck(this.tempHeader.statementNumber);
        }
      }
    });
  }
  private getButtonCheck(statementNumber) {
    this.service.getButton(statementNumber).subscribe(
      (res) => {
        if (res['status'] === 'OK') {
          this.buttonCheck = res['payload'];
        }
      },
      (error) => {
        this.toastrService.show(error.message, this.toastrMsg.error.title, {
          status: 'danger',
          duration: 5000,
          destroyByClick: true,
          limit: 1,
        });
      },
    );
  }
}
