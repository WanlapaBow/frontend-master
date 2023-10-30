import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  NbDialogService,
  NbMenuService,
  NbSidebarService,
  NbToastrService,
} from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import { saveAs } from 'file-saver';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { debounceTime, filter, map, take, tap } from 'rxjs/operators';
import { CommonService } from '../../../_helpers/common.service';
import {
  StatementAction,
  StatementIdAction,
} from '../../../root-store/statement.action';
import { SearchCustomerComponent } from '../../components/search-customer/search-customer.component';
import { defaultCofDef, setting, settingLine } from '../st002tx/ag-gird.config';
import { St002txSelectEmailSenderComponent } from './st002tx-select-email-sender/st002tx-select-email-sender.component';
import { St002txService } from './st002tx.service';
import { UploadDialogComponent } from './upload-dialog/upload-dialog.component';

@Component({
  selector: 'ngx-statements-manage',
  templateUrl: './st002tx.component.html',
  styleUrls: ['./st002tx.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class St002txComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('searchStatementNum') input: ElementRef;
  // flag
  isShowHeader: boolean = false;
  loading: boolean = false;
  isLineShow: boolean = false;
  isStatementDisable: boolean = false;
  isCheckAll: boolean = false;
  isDownload: boolean = false;
  isShowButton: boolean = false;
  onSearchInvoiceFlag: boolean = false;
  // gridColumnApi;
  gridColumnApiLine;
  rowData: any;
  columnDefs = setting;
  defaultColDef = defaultCofDef;
  rowSelection;
  paginationPageSize;
  // private gridApiLine: any;
  lineData: any;
  columnLineDefs = settingLine;
  // form
  form: FormGroup;
  tempHeader: any;
  // ag-grid
  gridApiHeader;
  gridApiLine;
  sortingOrder: any;
  statementNumberList$: Observable<string[]>;
  // pagegination statement
  currentPage: number = 0;
  totalPages;
  isLastPage: boolean = false;
  isFirstPage: boolean = false;
  paginationStatementPageSize;
  // list dropdown download
  items = [
    { title: 'PDF TEMPLATE', icon: 'download-outline' },
    { title: 'XLSX TEMPLATE', icon: 'download-outline' },
    { title: 'UPLOAD EXCEL', icon: 'upload-outline' },
    { title: 'SEND EMAIL', icon: 'email-outline' },
  ];

  itemsKbank = [
    { title: 'PDF TEMPLATE', icon: 'download-outline' },
    { title: 'XLSX TEMPLATE', icon: 'download-outline' },
    { title: 'PDF KBANK', icon: 'download-outline' },
    { title: 'XLSX KBANK', icon: 'download-outline' },
    { title: 'UPLOAD EXCEL', icon: 'upload-outline' },
    { title: 'SEND EMAIL', icon: 'email-outline' },
  ];

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
  customerClassInvalid: boolean = false;
  whtTrueResult: any[];
  whtFalseResult: any[];
  statementPaginationPageSize: number;
  isDetailLoading: boolean = false;
  rowSelectedSum: any = 0;
  sessionStore: any;
  private menu: Subscription;
  private iskBank: boolean;

  constructor(
    public commonService: CommonService,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    private nbMenuService: NbMenuService,
    private service: St002txService,
    private sidebarService: NbSidebarService,
    private store: Store<any>,
  ) {
    this.rowSelection = 'single';
    this.paginationPageSize = 10;
    this.paginationStatementPageSize = 10;
    this.statementPaginationPageSize = 10;
    this.sortingOrder = ['desc', 'asc'];
    this.sidebarService.compact('menu-sidebar');
  }

  get custom() {
    return this.form.get('customerClass');
  }

  ngOnInit(): void {
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
      invoiceNumber: new FormControl({ value: '', disabled: false }),
      status: new FormControl(
        { value: 'CONFIRMED', disabled: false },
        Validators.required,
      ),
    });
    this.menu = this.nbMenuService
      .onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'download-menu'),
        map(({ item: { title } }) => title),
      )
      .subscribe((title) => {
        if (title === 'UPLOAD EXCEL') {
          this.isDownload = true;
          this.openUploadDialog();
        } else {
          let statementNumber = '';
          if (
            this.form.value.statementNumber !== undefined &&
            this.form.value.statementNumber !== ''
          ) {
            statementNumber = this.form.value.statementNumber;
          } else if (this.tempHeader !== undefined) {
            statementNumber = this.tempHeader['statementNumber'];
          } else {
            return alert('กรุณาเลือก statement');
          }

          switch (title) {
            case 'PDF TEMPLATE':
              this.onDownloadPdf(statementNumber);
              break;
            case 'XLSX TEMPLATE':
              this.onDownloadCsv(statementNumber);
              break;
            case 'PDF KBANK':
              this.onDownloadPdfKBank(statementNumber);
              break;
            case 'XLSX KBANK':
              this.onDownloadXlsxKBank(statementNumber);
              break;
            case 'SEND EMAIL':
              this.onSendEmail(statementNumber);
              break;
          }
        }
      });
    this.store
      .pipe(select('statement'))
      .pipe(take(1))
      .subscribe((res) => (this.sessionStore = res));
    if (this.sessionStore.statement && this.sessionStore.pageId === 'st002tx') {
      this.initBySessionStore();
    }
  }

  onSendEmail(statementNumber: string) {
    this.dialogService
      .open(St002txSelectEmailSenderComponent)
      .onClose.subscribe((data) => {
        if (data) {
          if (statementNumber.trim() !== '') {
            this.service.sendEmail(statementNumber, data.code).subscribe(
              (response) => {
                this.toastrService.show(
                  response['payload'],
                  response['status'],
                  {
                    status: 'success',
                    duration: 5000,
                    destroyByClick: true,
                  },
                );
              },
              (error) => {
                this.toastrService.show(error.message, error.status, {
                  status: 'danger',
                  duration: 5000,
                  destroyByClick: true,
                });
              },
            );
          } else {
            throw new Error('statementNumber is null');
          }
        }
      });
  }

  ngOnDestroy() {
    this.menu.unsubscribe();
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
    this.rowData = [];
    this.lineData = [];
    this.form.reset();
    this.customerClassInvalid = false;
    this.form.get('status').setValue('CONFIRMED');
    this.form.get('businessUnit').setValue('');
    this.form.get('customerClass').setValue('');
    this.form.get('customerName').setValue('');
    this.form.get('siteNumber').setValue('');
    this.form.get('customerCode').setValue('');
    this.form.get('statementNumber').setValue('');
    this.form.get('invoiceNumber').setValue('');
    this.form.get('customerSubClass').setValue('');
    this.form.get('invoiceNumber').setValue('');

    this.isShowSubClass = false;
  }

  onGridReady(params) {
    this.gridApiHeader = params.api;
    // this.gridColumnApi = params.columnApi;
  }

  onGridReadyLine(params) {
    this.gridApiLine = params.api;
    // this.gridColumnApiLine = params.columnApi;
  }

  onPageSizeChanged(event: any) {
    this.gridApiHeader.paginationSetPageSize(Number(event.paginationPageSize));
    this.paginationPageSize = Number(event.paginationPageSize);
    this.getStatement(event.currentPage, event.paginationPageSize);
    this.paginationStatementPageSize = event.paginationPageSize;
  }

  onBt(event: any) {
    this.paginationStatementPageSize = event.paginationPageSize;
    this.getStatement(event.currentPage, event.paginationPageSize);
  }

  openUploadDialog() {
    this.isDownload = false;
    setTimeout(() => {
      this.dialogService
        .open(UploadDialogComponent, {})
        .onClose.subscribe((res) => {
          if (res) {
            // this.loading = true;
            // Get Update Header
            this.service
              .getSearchStatement(
                this.form.value,
                this.paginationPageSize,
                this.currentPage,
              )
              .subscribe(
                (header) => {
                  if (header['status'] === 'OK') {
                    // const data = header['payload'];
                    this.rowData = header['payload'].content;
                    this.totalPages = header['payload'].totalPages;
                    this.isLastPage = header['payload'].last;
                    this.isFirstPage = header['payload'].first;
                    this.isLineShow = false;
                    // this.loading = false;
                    // this.isDownload = false;
                  } else {
                    // this.isDownload = false;
                    this.toastrService.show(
                      header['payload'],
                      header['status'],
                      {
                        status: 'danger',
                        duration: 5000,
                        destroyByClick: true,
                      },
                    );
                  }
                },
                (error) => {
                  // this.isDownload = false;
                  this.toastrService.show(error.message, error.status, {
                    status: 'danger',
                    duration: 5000,
                    destroyByClick: true,
                  });
                },
              );
          }
          this.isDownload = false;
        });
    }, 500);
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

  onSearchStatement() {
    this.currentPage = 0;
    this.loading = true;
    this.isShowHeader = true;
    this.lineData = [];
    this.rowData = [];
    this.isLineShow = false;

    this.getStatement(this.currentPage, this.paginationPageSize);
    if (this.form.value.status === 'CANCELLED') {
      this.isShowButton = true;
    } else {
      this.isShowButton = false;
    }
    if (this.form.value.customerClass === 'KBANK') {
      this.iskBank = true;
    } else {
      this.iskBank = false;
    }
  }

  onSelectionStatement(event: any) {
    if (event.type === 'selectionChanged') {
      this.isDetailLoading = true;
      this.whtTrueResult = [];
      this.whtFalseResult = [];
      const data = event.api.getSelectedRows()[0];
      this.tempHeader = Object.assign([], data);
      if (this.tempHeader.statementStatus === 'CANCELLED') {
        this.isStatementDisable = true;
      }
      this.getStatementLine();
    }
  }

  onSave() {
    this.isDetailLoading = true;
    const result = this.lineData
      .filter((item) => item.isCheck === true)
      .map((item) => item.id);
    const param = {
      detailId: result,
      statementNumber: this.tempHeader.statementNumber,
    };
    const paramDeductWht = {
      deductWhtCheck: this.whtTrueResult,
      deductWhtUnCheck: this.whtFalseResult,
      statementNumber: this.tempHeader.statementNumber,
    };
    this.service.postDeductWht(paramDeductWht).subscribe(
      (response) => {
        if (response['status'] === 'OK') {
          this.service.postConfirm(param).subscribe(
            (res) => {
              if (res['status'] === 'OK') {
                this.isDetailLoading = false;
                this.toastrService.show(
                  this.toastrMsg.saveSuccess.message,
                  this.toastrMsg.saveSuccess.title,
                  {
                    status: 'success',
                    duration: 5000,
                    destroyByClick: true,
                  },
                );
                // Get Update Header
                this.service
                  .getHeaderById(this.tempHeader)
                  .subscribe((header) => {
                    if (header['status'] === 'OK') {
                      const data = header['payload'];
                      this.tempHeader = data;
                      this.gridApiHeader.getSelectedNodes()[0].setData(data);
                      // this.getStatementLine();
                      this.service
                        .getLine(this.tempHeader.statementId)
                        .subscribe(
                          (line) => {
                            if (
                              line['status'] === 'OK' &&
                              line['payload'].content
                            ) {
                              this.lineData = line['payload'].content;
                              this.lineData.map(
                                (x) => (x.deductWhtOri = x.deductWhtStatus),
                              );
                              this.lineData.map(
                                (x) => (x.isCheckOri = x.isCheck),
                              );
                              this.selectAllCheck();
                            } else {
                              this.toastrService.show(
                                line['payload'],
                                line['status'],
                                {
                                  status: 'danger',
                                  duration: 5000,
                                  destroyByClick: true,
                                },
                              );
                            }
                          },
                          (error) => {
                            this.toastrService.show(
                              error.message,
                              error.status,
                              {
                                status: 'danger',
                                duration: 5000,
                                destroyByClick: true,
                              },
                            );
                          },
                        );
                    } else {
                      this.toastrService.show(
                        header['payload'],
                        header['status'],
                        {
                          status: 'danger',
                          duration: 5000,
                          destroyByClick: true,
                        },
                      );
                    }
                  });
              } else {
                this.isDetailLoading = false;
                this.toastrService.show(res['payload'], res['status'], {
                  status: 'danger',
                  duration: 5000,
                  destroyByClick: true,
                });
              }
            },
            (error) => {
              this.isDetailLoading = false;
              this.toastrService.show(
                error.errors,
                this.toastrMsg.error.title,
                {
                  status: 'danger',
                  duration: 5000,
                  destroyByClick: true,
                },
              );
            },
          );
        }
      },
      (error) => {
        this.toastrService.show(error.message, error.payload, {
          status: 'danger',
          duration: 5000,
          destroyByClick: true,
        });
      },
    );
  }

  onCancel() {
    const params = {
      statementNumber: this.tempHeader.statementNumber,
    };
    this.service.postCancelStatement(params).subscribe(
      (response) => {
        if (response['status'] === 'OK') {
          // this.currentPage = 0;
          this.toastrService.show(
            this.toastrMsg.searchSuccess.message,
            this.toastrMsg.searchSuccess.title,
            {
              status: 'success',
              duration: 5000,
              destroyByClick: true,
            },
          );
          this.getStatement(this.currentPage, this.paginationPageSize);
          this.isLineShow = false;
        } else {
          this.toastrService.show(
            this.toastrMsg.error.message,
            this.toastrMsg.error.title,
            {
              status: 'danger',
              duration: 5000,
              destroyByClick: true,
            },
          );
        }
      },
      (error) => {
        this.toastrService.show(error.message, this.toastrMsg.error.title, {
          status: 'danger',
          duration: 5000,
          destroyByClick: true,
        });
      },
    );
  }

  onCellValueChanged(event: any) {
    const filterData = this.lineData.filter((item) => item.isCheck === true);
    const whtTrueFilterData = filterData.filter(
      (item) => item.deductWhtStatus === true,
    );
    const whtFalseFilterData = filterData.filter(
      (item) =>
        item.deductWhtStatus === false || item.deductWhtStatus === undefined,
    );
    this.whtTrueResult = whtTrueFilterData.map((item) => item.id);
    this.whtFalseResult = whtFalseFilterData.map((item) => item.id);
    const filterDueData = filterData.filter(
      (item) => item.invoiceDueStatus === 'DUE',
    );
    const summaryNew = {
      dueAmount: this.calStatementAmountByNetGross(filterDueData),
      statementAmount: this.calStatementAmountByNetGross(filterData),
      RemainingAmount: this.calStatementAmountByNetGross(filterData),
    };
    this.tempHeader.dueAmount = summaryNew.dueAmount;
    this.tempHeader.statementAmount = summaryNew.statementAmount;
    this.tempHeader.remainingAmount = summaryNew.RemainingAmount;
    this.rowSelectedSum = filterData.filter(
      (item) => item.enable !== false,
    ).length;
  }

  getStatementNumber() {
    this.commonService
      .getStatementNumber$(this.form.value.statementNumber)
      .pipe(take(1))
      .subscribe((response) => {
        this.statementNumberList$ = response.payload;
      });
  }

  onSelectAllCheck() {
    const itemUpdate = [];
    this.isCheckAll = !this.isCheckAll;
    this.lineData.forEach((node) => {
      const temp = node;
      if (node.isCheck !== this.isCheckAll && node.enable !== false) {
        temp.isCheck = this.isCheckAll;
      }
      itemUpdate.push(temp);
    });
    this.gridApiLine.applyTransaction({ update: itemUpdate });
    this.onCellValueChanged(null);
    // this.gridApiLine.refreshClientSideRowModel(this.lineData);
  }

  onChangeCustomerClass() {
    this.customerClassInvalid = false;
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

  onDownloadCsv(value: any) {
    if (value) {
      this.service.getDownloadCsv(value).subscribe(
        (res) => {
          if (res['blob'].size > 0 && res['filename']) {
            saveAs(res['blob'], res['filename']);
            this.isDownload = false;
            // this.cdRef.detectChanges();
          } else {
            this.toastrService.show(
              this.toastrMsg.noFile.message,
              this.toastrMsg.noFile.title,
              {
                status: 'warning',
                duration: 5000,
                destroyByClick: true,
                limit: 1,
              },
            );
            this.loading = false;
            this.isDownload = false;
            // this.cdRef.detectChanges();
          }
        },
        (error) => {
          this.toastrService.show(
            this.toastrMsg.noFile.message,
            this.toastrMsg.noFile.title,
            {
              status: 'danger',
              duration: 5000,
              destroyByClick: true,
              limit: 1,
            },
          );
          this.loading = false;
          this.isDownload = false;
        },
      );
    } else {
      alert('กรุณาเลือก customer Name และ siteNumber หรือ statementNumber');
      this.isDownload = false;
      // this.cdRef.detectChanges();
    }
  }

  onDownloadPdf(value: any) {
    this.service.getDownloadPdf(value).subscribe(
      (res) => {
        if (res['blob'].size > 0 && res['filename']) {
          // this.utilsService.downloadBlob(res, 'zip', 'arStatementReport(pdf)');
          saveAs(res['blob'], res['filename']);
          this.loading = false;
          this.isDownload = false;
          // this.cdRef.detectChanges();
        } else {
          this.toastrService.show(
            this.toastrMsg.noFile.message,
            this.toastrMsg.noFile.title,
            {
              status: 'warning',
              duration: 5000,
              destroyByClick: true,
            },
          );
          this.loading = false;
          this.isDownload = false;
          // // this.cdRef.detectChanges();
        }
      },
      (error) => {
        this.toastrService.warning('ไม่พบข้อมูล', error.statusText, {
          duration: 5000,
          destroyByClick: true,
          limit: 1,
        });
        this.loading = false;
        this.isDownload = false;
      },
    );
  }

  onDownloadPdfKBank(value: any) {
    this.service.getDownloadPdfKBank(value).subscribe(
      (res) => {
        if (res['blob'].size > 0 && res['filename']) {
          // this.utilsService.downloadBlob(res, 'zip', 'arStatementReport(pdf)');
          saveAs(res['blob'], res['filename']);
          this.loading = false;
          this.isDownload = false;
          // this.cdRef.detectChanges();
        } else {
          this.toastrService.show(
            this.toastrMsg.noFile.message,
            this.toastrMsg.noFile.title,
            {
              status: 'warning',
              duration: 5000,
              destroyByClick: true,
            },
          );
          this.loading = false;
          this.isDownload = false;
          // // this.cdRef.detectChanges();
        }
      },
      (error) => {
        this.toastrService.warning('ไม่พบข้อมูล', error.statusText, {
          duration: 5000,
          destroyByClick: true,
          limit: 1,
        });
        this.loading = false;
        this.isDownload = false;
      },
    );
  }
  onDownloadXlsxKBank(value: any) {
    if (value) {
      this.service.getDownloadXlsxKBank(value).subscribe(
        (res) => {
          if (res['blob'].size > 0 && res['filename']) {
            saveAs(res['blob'], res['filename']);
            this.isDownload = false;
            // this.cdRef.detectChanges();
          } else {
            this.toastrService.show(
              this.toastrMsg.noFile.message,
              this.toastrMsg.noFile.title,
              {
                status: 'warning',
                duration: 5000,
                destroyByClick: true,
                limit: 1,
              },
            );
            this.loading = false;
            this.isDownload = false;
            // this.cdRef.detectChanges();
          }
        },
        (error) => {
          this.toastrService.show(
            this.toastrMsg.noFile.message,
            this.toastrMsg.noFile.title,
            {
              status: 'danger',
              duration: 5000,
              destroyByClick: true,
              limit: 1,
            },
          );
          this.loading = false;
          this.isDownload = false;
        },
      );
    } else {
      alert('กรุณาเลือก customer Name และ siteNumber หรือ statementNumber');
      this.isDownload = false;
      // this.cdRef.detectChanges();
    }
  }

  onClearInput() {
    this.form.get('customerName').setValue('');
    this.form.get('siteNumber').setValue('');
  }

  onClearStatementNumber() {
    this.form.get('statementNumber').setValue('');
  }

  async initBySessionStore() {
    this.setForm();
    this.currentPage = 0;
    // this.loading = true;
    // this.isShowHeader = true;
    this.rowData = [];
    this.lineData = [];
    // this.isLineShow = false;
    // await this.service.getSearchStatement$(this.form.value, this.paginationPageSize, this.currentPage).then(result => {
    //   if (result['status'] === 'OK' && result['payload'].content.length > 0) {
    //     this.rowData = result['payload'].content;
    //     this.toastrService.show(this.toastrMsg.searchSuccess.message,
    //       this.toastrMsg.searchSuccess.title, {
    //         limit: 1,
    //         status: 'success',
    //         duration: 5000,
    //         destroyByClick: true,
    //       });
    //     this.totalPages = result['payload'].totalPages;
    //     this.isLastPage = result['payload'].last;
    //     this.isFirstPage = result['payload'].first;
    //     this.loading = false;
    //   } else if (result['status'] === 'NOT_FOUND') {
    //     this.rowData = [];
    //     this.toastrService.show(this.toastrMsg.noData.message,
    //       this.toastrMsg.noData.title, {
    //         status: 'warning',
    //         duration: 5000,
    //         destroyByClick: true,
    //         limit: 1,
    //       });
    //     this.loading = false;
    //   } else {
    //     this.rowData = [];
    //     this.toastrService.show(this.toastrMsg.noData.message,
    //       this.toastrMsg.noData.title, {
    //         status: 'warning',
    //         duration: 5000,
    //         destroyByClick: true,
    //         limit: 1,
    //       });
    //     this.loading = false;
    //   }
    // });
    // await this.handleHeaderInit();
    // await this.service.getLine$(this.tempHeader.statementId).then((line) => {
    //   if (line['status'] === 'OK' && line['payload'].content) {
    //     this.lineData = line['payload'].content;
    //     this.lineData.map((x) => x.deductWhtOri = x.deductWhtStatus);
    //     this.lineData.map((x) => x.isCheckOri = x.isCheck);
    //     this.selectAllCheck();
    //     this.toastrService.show(this.toastrMsg.searchSuccess.message,
    //       this.toastrMsg.searchSuccess.title, {
    //         status: 'success',
    //         duration: 5000,
    //         destroyByClick: true,
    //         limit: 1,
    //       });
    //     this.isLineShow = true;
    //     this.isDetailLoading = false;
    //   } else {
    //     this.toastrService.show(line['payload'],
    //       line['status'], {
    //         status: 'danger',
    //         duration: 5000,
    //         destroyByClick: true,
    //         limit: 1,
    //       });
    //     this.isDetailLoading = false;
    //   }
    // });
    // // await console(this.gridApiHeader.getRowNode(0));
  }

  handleHeaderInit() {
    return new Promise((resolve) => {
      if (this.sessionStore.statementId) {
        const indexStatement = this.rowData.findIndex(
          (x) => x.statementId === this.sessionStore.statementId,
        );
        if (indexStatement >= 0) {
          // select statement get Receipt
          this.isDetailLoading = true;
          this.whtTrueResult = [];
          this.whtFalseResult = [];
          this.tempHeader = this.rowData[indexStatement];
          const value = Object.assign([], this.rowData[indexStatement]);
          this.tempHeader = value;
          if (value.statementStatus === 'CANCELLED') {
            this.isStatementDisable = true;
          }
          resolve(true);
        }
      }
    });
  }

  setForm() {
    this.form.get('status').setValue(this.sessionStore.statement.status);
    this.form
      .get('businessUnit')
      .setValue(this.sessionStore.statement.businessUnit);
    this.form
      .get('customerClass')
      .setValue(this.sessionStore.statement.customerClass);
    this.form
      .get('customerName')
      .setValue(
        this.sessionStore.statement.customerName
          ? this.sessionStore.statement.customerName
          : '',
      );
    this.form
      .get('siteNumber')
      .setValue(
        this.sessionStore.statement.siteNumber
          ? this.sessionStore.statement.siteNumber
          : '',
      );
    this.form
      .get('customerCode')
      .setValue(
        this.sessionStore.statement.customerCode
          ? this.sessionStore.statement.customerCode
          : '',
      );
    this.form
      .get('statementNumber')
      .setValue(
        this.sessionStore.statement.statementNumber
          ? this.sessionStore.statement.statementNumber
          : '',
      );
  }

  private calStatementAmountByNetGross(rowdata) {
    const sum = rowdata.reduce((a, b) => {
      let deDuctWht1PercentUse = 0;
      if (b['netOrGross'] === 'Net') {
        if (
          b['deductWhtStatus'] === b['deductWhtOri'] &&
          b['deductWhtOri'] === true
        ) {
          deDuctWht1PercentUse = b['totalNet'];
        } else if (
          b['deductWhtStatus'] === b['deductWhtOri'] &&
          b['deductWhtOri'] === false
        ) {
          deDuctWht1PercentUse = b['totalNet'];
        } else if (
          b['deductWhtStatus'] !== b['deductWhtOri'] &&
          b['deductWhtStatus'] === true &&
          b['deductWhtOri'] === false
        ) {
          deDuctWht1PercentUse = b['totalNet'] - b['wht1percent'];
        } else if (
          b['deductWhtStatus'] !== b['deductWhtOri'] &&
          b['deductWhtStatus'] === false &&
          b['deductWhtOri'] === true
        ) {
          deDuctWht1PercentUse = b['totalNet'] + b['wht1percent'];
        }
      } else {
        if (
          b['deductWhtStatus'] === b['deductWhtOri'] &&
          b['deductWhtOri'] === true
        ) {
          deDuctWht1PercentUse = b['totalGross'];
        } else if (
          b['deductWhtStatus'] === b['deductWhtOri'] &&
          b['deductWhtOri'] === false
        ) {
          deDuctWht1PercentUse = b['totalGross'];
        } else if (
          b['deductWhtStatus'] !== b['deductWhtOri'] &&
          b['deductWhtStatus'] === true &&
          b['deductWhtOri'] === false
        ) {
          deDuctWht1PercentUse = b['totalGross'] - b['wht1percent'];
        } else if (
          b['deductWhtStatus'] !== b['deductWhtOri'] &&
          b['deductWhtStatus'] === false &&
          b['deductWhtOri'] === true
        ) {
          deDuctWht1PercentUse = b['totalGross'] + b['wht1percent'];
        }
      }
      return a + deDuctWht1PercentUse;
    }, 0);
    return sum;
  }

  async getStatement(index, limitPerPage) {
    const id = 'st002tx',
      data = this.form.value;
    this.store.dispatch(new StatementAction(id, data));
    if (!this.onSearchInvoiceFlag) {
      await this.service
        .getSearchStatement$(this.form.value, limitPerPage, index)
        .then(
          (result) => {
            if (
              result['status'] === 'OK' &&
              result['payload'].content.length > 0
            ) {
              this.rowData = result['payload'].content;
              this.toastrService.show(
                this.toastrMsg.searchSuccess.message,
                this.toastrMsg.searchSuccess.title,
                {
                  limit: 1,
                  status: 'success',
                  duration: 5000,
                  destroyByClick: true,
                },
              );
              this.totalPages = result['payload'].totalPages;
              this.isLastPage = result['payload'].last;
              this.isFirstPage = result['payload'].first;
              this.loading = false;
            } else if (result['status'] === 'NOT_FOUND') {
              this.rowData = [];
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
              this.loading = false;
            } else {
              this.rowData = [];
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
              this.loading = false;
            }
          },
          (error) => {
            this.toastrService.show(error.message, error.payload, {
              status: 'danger',
              duration: 5000,
              destroyByClick: true,
              limit: 1,
            });
            this.loading = false;
          },
        );
    } else {
      if (this.form.value.invoiceNumber === '') {
        this.loading = false;
        return alert('กรุณาใส่ Invoice Number');
      }
      await this.service
        .getSearchInvoice$(this.form.value, limitPerPage, index)
        .then(
          (result) => {
            if (
              result['status'] === 'OK' &&
              result['payload'].content.length > 0
            ) {
              this.rowData = result['payload'].content;
              this.toastrService.show(
                this.toastrMsg.searchSuccess.message,
                this.toastrMsg.searchSuccess.title,
                {
                  limit: 1,
                  status: 'success',
                  duration: 5000,
                  destroyByClick: true,
                },
              );
              this.totalPages = result['payload'].totalPages;
              this.isLastPage = result['payload'].last;
              this.isFirstPage = result['payload'].first;
              this.loading = false;
            } else if (result['status'] === 'NOT_FOUND') {
              this.rowData = [];
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
              this.loading = false;
            } else {
              this.rowData = [];
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
              this.loading = false;
            }
          },
          (error) => {
            this.toastrService.show(error.message, error.payload, {
              status: 'danger',
              duration: 5000,
              destroyByClick: true,
              limit: 1,
            });
            this.loading = false;
          },
        );
    }
  }

  async getStatementLine() {
    const id = 'st002tx',
      data = this.tempHeader.statementId;
    this.store.dispatch(new StatementIdAction(id, data));
    await this.service.getLine$(this.tempHeader.statementId).then((line) => {
      if (line['status'] === 'OK' && line['payload'].content) {
        this.lineData = line['payload'].content;
        this.lineData.map((x) => (x.deductWhtOri = x.deductWhtStatus));
        this.lineData.map((x) => (x.isCheckOri = x.isCheck));
        this.selectAllCheck();
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
        this.isLineShow = true;
        this.isDetailLoading = false;
      } else {
        this.toastrService.show(line['payload'], line['status'], {
          status: 'danger',
          duration: 5000,
          destroyByClick: true,
          limit: 1,
        });
        this.isDetailLoading = false;
      }
    });
  }

  private selectAllCheck() {
    const summary = this.lineData.length;
    const isCheck = this.lineData.filter(
      (item) => item.isCheck === true,
    ).length;
    const filterData = this.lineData.filter((item) => item.isCheck === true);
    if (summary === isCheck) {
      this.isCheckAll = true;
    } else {
      this.isCheckAll = false;
    }
    this.rowSelectedSum = filterData.filter(
      (item) => item.enable !== false,
    ).length;
  }

  onSearchInvoice() {
    this.onSearchInvoiceFlag = !this.onSearchInvoiceFlag;
    this.form.get('statementNumber').setValue('');
    this.form.get('invoiceNumber').setValue('');
  }
}
