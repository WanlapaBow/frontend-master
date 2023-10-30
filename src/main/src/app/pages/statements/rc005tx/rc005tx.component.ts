import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbSidebarService, NbToastrService } from '@nebular/theme';
import { CommonService } from '../../../_helpers/common.service';
import { UtilsService } from '../../../_helpers/utils.service';
import { DeleteBtnAggridComponent } from '../rc002tx/delete-btn-aggrid/delete-btn-aggrid.component';
import { Rc005txService } from './rc005tx.service';

@Component({
  selector: 'ngx-rc005tx',
  templateUrl: './rc005tx.component.html',
  styleUrls: ['./rc005tx.component.scss'],
})
export class Rc005txComponent implements OnInit {
  form: FormGroup;
  columnReceiptDefs: any;
  // flag
  loading: boolean = false;
  flagDelete: boolean = false;
  isShowInvoice: boolean = false;
  isShowReceipt: boolean = false;
  isShowStatement: boolean = false;
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
  // ag-grid
  defaultColDef: any;
  receiptData: any[] = [];
  paginationPageSize: any;
  sortingOrder: any;
  rowSelection: string;
  columnInvoiceDefs: any;
  invoiceData: any;
  columnStatementDefs: any;
  statementData: any[] = [];
  invoicePaginationPageSize;
  gridApiInvoice: any;
  gridApiStatement: any;
  // pagination
  isInvoiceFirstPage: boolean = false;
  isInvoiceLastPage: boolean = false;
  invoiceTotalPages;
  reciptSelect: any;
  isInvoiceloading: boolean = false;
  isStatementloading: boolean = false;

  constructor(
    public commonService: CommonService,
    private toastrService: NbToastrService,
    private service: Rc005txService,
    private sidebarService: NbSidebarService,
  ) {
    this.sidebarService.compact('menu-sidebar');
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
      receiptDateFrom: new FormControl({ value: '', disabled: false }),
      receiptDateTo: new FormControl({ value: '', disabled: false }),
    });
    this.columnReceiptDefs = [
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
        headerName: 'UNAPPLIED AMOUNT',
        field: 'unappliedAmount',
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
    ];
    this.columnInvoiceDefs = [
      {
        headerName: 'PROP ID',
        field: 'propId',
      },
      {
        headerName: 'INVOICE NO.',
        field: 'invoiceNumber',
      },
      {
        headerName: 'ผู้เอาประกันภัย',
        field: 'beneficiaryName',
      },
      {
        headerName: 'จังหวัด',
        field: 'motorLicenseProvince',
      },
      {
        headerName: 'เลขทะเบียนรถ',
        field: 'motorLicensePlateNumber',
      },
      {
        headerName: 'POLICY NUMBER',
        field: 'policyNumber',
      },
      {
        headerName: 'PREMIUM',
        field: 'premium',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
      },
      {
        headerName: 'STAMP',
        field: 'stamp',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
      },
      {
        headerName: 'OUTPUT VAT',
        field: 'outputVat',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
      },
      {
        headerName: 'WHT 1%',
        field: 'wht1percent',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
      },
      {
        headerName: 'WHT1% CODE',
        field: 'whtCode',
      },
      {
        headerName: 'COMMISSION',
        field: 'commission',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
      },
      {
        headerName: 'INPUT VAT',
        field: 'inputVat',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
      },
      {
        headerName: 'WHT',
        field: 'whtCommission',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
      },
      {
        headerName: 'SERVICE FEE',
        field: 'serviceFee',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
      },
      {
        headerName: 'GROSS',
        field: 'totalGross',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
      },
      {
        headerName: 'TOTAL NET',
        field: 'totalNet',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
      },
      {
        headerName: 'EFFECTIVE STARTDATE',
        field: 'effectiveStartDate',
        valueFormatter: function (params) {
          return params.value !== null
            ? new UtilsService().dateFormatUtc(params.value)
            : '-';
        },
      },
      {
        headerName: 'INVOICE DUE DATE',
        field: 'invoiceDueDate',
        valueFormatter: function (params) {
          return params.value !== null
            ? new UtilsService().dateFormatUtc(params.value)
            : '-';
        },
      },
      {
        headerName: 'STATUS',
        field: 'invoiceDueStatus',
      },
      {
        headerName: 'PAYMENT STATUS',
        field: 'paymentStatus',
      },
      {
        headerName: 'NET OR GROSS',
        field: 'netOrGross',
      },
      {
        headerName: 'POLICY TYPE NAME',
        field: 'policyTypeName',
      },
      {
        headerName: '% COM',
        field: 'percentCommission',
      },
      {
        headerName: 'CONTRACT TYPE',
        field: 'contractType',
      },
      {
        headerName: 'ISSUE DATE',
        field: 'issueDate',
        valueFormatter: function (params) {
          return params.value !== null
            ? new UtilsService().dateFormatUtc(params.value)
            : '-';
        },
      },
      {
        headerName: 'EXPIRY DATE',
        field: 'expiryDate',
        valueFormatter: function (params) {
          return params.value !== null
            ? new UtilsService().dateFormatUtc(params.value)
            : '-';
        },
      },
      {
        headerName: 'SENDER AGENT NUMBER',
        field: 'senderAgentNumber',
      },
      {
        headerName: 'SENDER AGENT NAME',
        field: 'senderAgentName',
      },
      {
        headerName: 'CHASSIS',
        field: 'motorChassis',
      },
      {
        headerName: 'ENGINE',
        field: 'motorEngine',
      },
      {
        headerName: 'ยี่ห้อรถ',
        field: 'motorCarBrandName',
      },
      {
        headerName: 'CAMPAIGN',
        field: 'campaign',
      },
      {
        headerName: 'TRANS NUMBER',
        field: 'pandaTransNumber',
      },
      {
        headerName: 'D-CHANNEL',
        field: 'dchannel',
      },
      {
        headerName: 'PAYMENT DUE DATE',
        field: 'paymentDueDate',
        valueFormatter: function (params) {
          return params.value !== null
            ? new UtilsService().dateFormatUtc(params.value)
            : '-';
        },
      },
      {
        headerName: 'ประเภทสัญญา',
        field: 'motorContractPolicyType',
      },
      {
        headerName: 'เลขที่สัญญา',
        field: 'motorContractPolicyNumber',
      },
      {
        headerName: 'CO SIGN',
        field: 'coSign',
      },
      {
        headerName: 'COLLATERAL NO.',
        field: 'collateralNo',
      },
      {
        headerName: 'CAR TYPE',
        field: 'motorCarType',
      },
      {
        headerName: 'ทุนประกัน',
        field: 'faceAmount',
      },
      {
        headerName: 'ประเภททุนประกัน',
        field: 'beneficiaryType',
      },
    ];
    this.columnStatementDefs = [
      {
        headerName: 'BUSINESS UNIT',
        field: 'businessUnitName',
      },
      {
        headerName: 'STATEMENT ID',
        field: 'statementId',
      },
      {
        headerName: 'STATEMENT NUMBER',
        field: 'statementNumber',
      },
      {
        headerName: 'STATEMENT DATE',
        field: 'statementDate',
        valueFormatter: function (params) {
          return params.value !== null
            ? new UtilsService().dateFormatUtc(params.value)
            : '-';
        },
      },
      {
        headerName: 'CUSTOMER',
        children: [
          {
            headerName: 'CUSTOMER NUMBER',
            field: 'customerNumber',
          },
          {
            headerName: 'CUSTOMER NAME',
            field: 'customerName',
            columnGroupShow: 'open',
          },
        ],
      },
      {
        headerName: 'SITE NUMBER',
        field: 'siteNumber',
      },
      {
        headerName: 'PREMIUM',
        field: 'premium',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
      },
      {
        headerName: 'STAMP',
        field: 'stamp',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
      },
      {
        headerName: 'OUTPUT VAT',
        field: 'outputVatAmount',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
      },
      {
        headerName: 'WHT 1%',
        field: 'premiumWhtPercentAmount',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
      },
      {
        headerName: 'COMMISSION',
        field: 'commissionAmount',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
      },
      {
        headerName: 'INPUT VAT AMOUNT',
        field: 'commissionInputVatAmount',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
      },
      {
        headerName: 'WHT COMMISSION',
        field: 'commissionWhtAmount',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
      },
      {
        headerName: 'SERVICE FEE',
        field: 'serviceFee',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
      },
      {
        headerName: 'OVERDUE AMOUNT',
        field: 'overdueAmount',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
      },
      {
        headerName: 'DUE AMOUNT',
        field: 'dueAmount',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
      },
      {
        headerName: 'NOT DUE AMOUNT',
        field: 'notDueAmount',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
      },
      {
        headerName: 'STATEMENT AMOUNT',
        field: 'statementAmount',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
      },
      {
        headerName: 'PAID AMOUNT',
        field: 'paidAmount',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
      },
      {
        headerName: 'REMAINING AMOUNT',
        field: 'remainingAmount',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
      },
      {
        headerName: 'STATUS',
        field: 'statementStatus',
      },
      {
        headerName: 'EMAIL',
        field: 'email',
      },
    ];
    this.defaultColDef = {
      resizable: true,
      filter: true,
      sortable: true,
    };
    this.rowSelection = 'multiple';
    this.paginationPageSize = 10;
    this.invoicePaginationPageSize = this.paginationPageSize;
    this.sortingOrder = ['desc', 'asc'];
  }

  onSearchReceipt() {
    this.loading = true;
    this.isShowReceipt = true;
    this.getReceipt();
    this.isShowInvoice = false;
    this.isShowStatement = false;
  }

  clear() {
    this.isShowReceipt = false;
    this.isShowInvoice = false;
    this.isShowStatement = false;
    this.receiptData = [];
    this.invoiceData = [];
    this.statementData = [];
    this.form.reset();
  }

  onDeteleBtn(e) {
    if (confirm('Are you sure Delete?')) {
      this.service.postReceiptDelete(e.documentNumber).subscribe(
        (response: any) => {
          if (response['status'] === 'OK') {
            this.isShowInvoice = false;
            this.isShowStatement = false;
            this.invoiceData = [];
            this.getReceipt();
            // this.getStatementDetail();
            this.toastrService.show('ลบข้อมูลสำเร็จ ', 'Delete Success', {
              status: 'success',
              duration: 5000,
            });
            this.flagDelete = false;
          } else {
            this.toastrService.show('ลบข้อมูลไม่สำเร็จ', 'Delete Fail', {
              status: 'warning',
              duration: 5000,
            });
            this.flagDelete = false;
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
  }

  onSelectReciept(event) {
    if (event.type === 'rowSelected') {
      this.isInvoiceloading = true;
      this.isShowInvoice = true;
      this.reciptSelect = event.api.getSelectedRows()[0];
      this.getInvoice(
        this.reciptSelect.documentNumber,
        0,
        this.paginationPageSize,
      );
    }
  }

  onGridReadyReceipt(params) {
    // @ts-ignore
    this.gridApiReceipt = params.api;
    // @ts-ignore
    this.gridReceiptColumnApi = params.columnApi;
  }

  onGridReadyInvoice(params) {
    // @ts-ignore
    this.gridApiInvoice = params.api;
    // @ts-ignore
    // this.gridInvoiceColumnApi = params.columnApi;
  }

  onGridReadyStatement(params) {
    // @ts-ignore
    this.gridApiStatement = params.api;
    // @ts-ignore
    this.gridStatementColumnApi = params.columnApi;
  }

  onSelectInvoice(event) {
    if (event.type === 'rowSelected') {
      this.isStatementloading = true;
      this.isShowStatement = true;
      this.getStatementByInvoiceId(event.data.id);
      // this.service.getStatement(event.data.id).subscribe((responce) => {
      //   if (responce['status'] === 'OK') {
      //     this.statementData = [responce['payload']];
      //     this.isStatementloading = false;
      //   } else {
      //     this.isStatementloading = false;
      //   }
      // });
    }
  }

  onMatchingReceipt() {
    this.isShowStatement = false;
    this.isShowInvoice = false;
    this.loading = true;
    this.service.matchingReceipt().subscribe(
      (res: any) => {
        if (res['status'] === 'OK') {
          this.getReceipt();
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

  onInvoicePageSizeChanged(event: any) {
    this.gridApiInvoice.paginationSetPageSize(Number(event.paginationPageSize));
    this.paginationPageSize = Number(event.paginationPageSize);
    this.getInvoice(
      this.reciptSelect.documentNumber,
      event.currentPage,
      event.paginationPageSize,
    );
    this.invoicePaginationPageSize = event.paginationPageSize;
  }

  onBtInvoice(event: any) {
    this.getInvoice(
      this.reciptSelect.documentNumber,
      event.currentPage,
      event.paginationPageSize,
    );
  }
  private getInvoice(reciptSelect, index, limitPerPage) {
    this.service
      .getInvoiceDetailById(reciptSelect, limitPerPage, index)
      .subscribe(
        (responce) => {
          if (
            responce['status'] === 'OK' &&
            responce['payload'].content.length > 0
          ) {
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
            this.invoiceData = responce['payload'].content;
            this.invoiceTotalPages = responce['payload'].totalPages;
            this.isInvoiceLastPage = responce['payload'].last;
            this.isInvoiceFirstPage = responce['payload'].first;
            this.isInvoiceloading = false;
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
            this.isInvoiceloading = false;
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
            this.isInvoiceloading = false;
          }
          this.isShowStatement = false;
        },
        (error) => {
          this.toastrService.show(error.message, this.toastrMsg.error.title, {
            status: 'danger',
            duration: 5000,
            destroyByClick: true,
          });
          this.isInvoiceloading = false;
        },
      );
  }
  private getReceipt() {
    this.service.getReceipt(this.form.value).subscribe(
      (response: any) => {
        if (response.status === 'OK' && response.payload.length > 0) {
          this.toastrService.show(
            this.toastrMsg.saveSuccess.message,
            this.toastrMsg.saveSuccess.title,
            {
              status: 'success',
              duration: 5000,
              destroyByClick: true,
            },
          );
          this.receiptData = response.payload;
          this.receiptData.map((item) => {
            item.isDelete = 'CONFIRMED';
          });
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
  private getStatementByInvoiceId(id: any) {
    this.service.getStatement(id).subscribe(
      (responce) => {
        if (responce['status'] === 'OK') {
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
          this.statementData = [responce['payload']];
          this.isStatementloading = false;
        } else {
          this.toastrService.show(
            this.toastrMsg.noData.title,
            this.toastrMsg.noData.title,
            {
              status: 'danger',
              duration: 5000,
              destroyByClick: true,
              limit: 1,
            },
          );
          this.isStatementloading = false;
        }
      },
      (error) => {
        this.toastrService.show(error.message, this.toastrMsg.error.title, {
          status: 'danger',
          duration: 5000,
          destroyByClick: true,
          limit: 1,
        });
        this.isStatementloading = false;
      },
    );
  }
}
