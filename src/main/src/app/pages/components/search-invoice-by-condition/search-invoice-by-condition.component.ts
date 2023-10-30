import { DecimalPipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { CommonService } from '../../../_helpers/common.service';
import { UtilsService } from '../../../_helpers/utils.service';
import { SearchInvoiceByConditionService } from './search-invoice-by-condition.service';

@Component({
  selector: 'ngx-search-invoice-by-condition',
  templateUrl: './search-invoice-by-condition.component.html',
  styleUrls: ['./search-invoice-by-condition.component.scss'],
})
export class SearchInvoiceByConditionComponent
  implements OnInit, AfterViewInit {
  @ViewChild('searchStatementNum', { static: true }) input: ElementRef;
  @Input() customerClass: string;
  @Input() businessUnit: string;
  form: FormGroup;
  customerClassInvalid: boolean = false;
  statementNumberList$: Observable<string[]>;
  loading: boolean = false;
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
  columnStatementDefs: any;
  defaultColDef: any;
  statementPopupData: any;
  paginationPageSize: any;
  sortingOrder: string[];
  rowSelection: any;
  invoiceSelectList: any[] = [];
  isClear: Boolean = false;
  isShowStatement: boolean = false;
  isShowInvoice: boolean = false;
  // pagination
  statementTotalPages: any;
  statementPaginationPageSize: any;
  isStatementFirstPage: boolean = false;
  isStatementLastPage: boolean = false;
  invoiceTotalPages: any;
  invoicePaginationPageSize: any;
  isInvoiceFirstPage: boolean = false;
  isInvoiceLastPage: boolean = false;
  tempSelectStatement: any;
  // @ts-ignore
  private gridStatement: any;
  // @ts-ignore
  private gridStatementColumnApi: any;
  private invoiceData: any;
  // @ts-ignore
  private columnInvoiceDefs: any;
  // @ts-ignore
  private gridInvoice: any;
  // @ts-ignore
  private gridInvoiceColumnApi: any;
  isInvoiceloading: boolean = false;
  isStatementloading: boolean = false;

  constructor(
    protected ref: NbDialogRef<SearchInvoiceByConditionComponent>,
    public commonService: CommonService,
    public service: SearchInvoiceByConditionService,
    private toastrService: NbToastrService,
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      businessUnit: new FormControl(
        { value: this.businessUnit, disabled: false },
        Validators.required,
      ),
      customerClass: new FormControl(
        { value: this.customerClass, disabled: false },
        Validators.required,
      ),
      // customerName: new FormControl({value: '', disabled: false}),
      // siteNumber: new FormControl({value: '', disabled: false}),
      // customerCode: new FormControl({value: '', disabled: false}),
      statementNumber: new FormControl({ value: '', disabled: false }),
      // status: new FormControl({value: 'CONFIRMED', disabled: false}, Validators.required),
    });
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
    this.columnInvoiceDefs = [
      {
        headerName: '',
        field: 'isSelect',
        checkboxSelection: true,
        width: 50,
      },
      {
        headerName: 'PROP ID',
        field: 'propId',
        editable: false,
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
    this.defaultColDef = {
      resizable: true,
      filter: true,
      sortable: true,
    };
    this.paginationPageSize = 5;
    this.statementPaginationPageSize = this.paginationPageSize;
    this.invoicePaginationPageSize = this.paginationPageSize;
    this.sortingOrder = ['desc', 'asc'];
    this.rowSelection = 'multiple';
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

  dismiss() {
    this.ref.close();
  }

  onSave() {
    this.ref.close(this.invoiceSelectList);
  }

  onSearchStatement() {
    this.isStatementloading = true;
    this.getStatementDetail(0, this.statementPaginationPageSize);
  }

  getStatementNumber() {
    this.commonService
      .getReceiptStatementNumber$(this.form.value)
      .pipe(debounceTime(5000))
      .subscribe((response) => {
        this.statementNumberList$ = response.payload;
      });
  }

  onGridStatementReady(params) {
    this.gridStatement = params.api;
    // @ts-ignore
    this.gridStatementColumnApi = params.columnApi;
  }

  onGridReadyInvoice(params) {
    this.gridInvoice = params.api;
    // @ts-ignore
    this.gridInvoiceColumnApi = params.columnApi;
  }

  onSelectionStatement($event: any) {
    this.isInvoiceloading = true;
    if ($event.type === 'rowClicked') {
      this.invoiceSelectList = [];
      this.tempSelectStatement = $event.data;
      this.getInvoiceDetail(
        this.tempSelectStatement.statementId,
        true,
        0,
        this.invoicePaginationPageSize,
      );
    }
  }

  onInvoiceValueChange(event: any) {
    if (!this.isClear) {
      if (event.data.isSelect === undefined || event.data.isSelect === false) {
        event.data.isSelect = true;
        this.invoiceSelectList.push(event.data);
      } else {
        event.data.isSelect = false;
        const indexRemove = this.invoiceSelectList.findIndex(
          (x) => x.invoiceId === event.data.id,
        );
        this.invoiceSelectList.splice(indexRemove, 1);
      }
    }
  }

  onBtStatement(event: any) {
    this.statementPaginationPageSize = event.paginationPageSize;
    this.getStatementDetail(event.currentPage, event.paginationPageSize);
  }

  onStatementPageSizeChanged(event: any) {
    this.gridStatement.paginationSetPageSize(Number(event.paginationPageSize));
    this.paginationPageSize = Number(event.paginationPageSize);
    this.getStatementDetail(event.currentPage, event.paginationPageSize);
    this.statementPaginationPageSize = event.paginationPageSize;
  }

  onBtInvoice(event: any) {
    this.invoicePaginationPageSize = event.paginationPageSize;
    this.getInvoiceDetail(
      this.tempSelectStatement.statementId,
      true,
      event.currentPage,
      event.paginationPageSize,
    );
  }

  onInvoicePageSizeChanged(event: any) {
    this.gridInvoice.paginationSetPageSize(Number(event.paginationPageSize));
    this.paginationPageSize = Number(event.paginationPageSize);
    this.getInvoiceDetail(
      this.tempSelectStatement.statementId,
      true,
      event.currentPage,
      event.paginationPageSize,
    );
    this.invoicePaginationPageSize = event.paginationPageSize;
  }

  private getStatementDetail(index, limitPerPage) {
    this.service
      .getSearchStatement(this.form.value, limitPerPage, index)
      .subscribe(
        (result) => {
          if (result['payload'].content.length > 0) {
            this.statementPopupData = result['payload'].content;
            this.statementTotalPages = result['payload'].totalPages;
            this.isStatementLastPage = result['payload'].last;
            this.isStatementFirstPage = result['payload'].first;
            this.isShowStatement = true;
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
            this.isStatementloading = false;
          } else {
            this.statementPopupData = [];
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
            this.isStatementloading = false;
          }
        },
        (error) => {
          this.toastrService.show(error.message, this.toastrMsg.error.title, {
            status: 'danger',
            duration: 5000,
            destroyByClick: true,
          });
          this.isStatementloading = false;
        },
      );
  }

  private calNetGross(rowdata) {
    if (rowdata.netOrGross === 'Net') {
      return rowdata.totalNet;
    } else if (rowdata.netOrGross === 'Gross') {
      return rowdata.totalGross;
    }
  }

  private getInvoiceDetail(statementId, type, index, limitPerPage) {
    this.service
      .getInvoiceDetailById(statementId, limitPerPage, index)
      .subscribe((response) => {
        if (response['status'] === 'OK') {
          this.invoiceData = response['payload'].content;
          this.invoiceTotalPages = response['payload'].totalPages;
          this.isInvoiceLastPage = response['payload'].last;
          this.isInvoiceFirstPage = response['payload'].first;
          this.isShowInvoice = true;
          this.invoiceData.map((res) => {
            res.maxApplied = this.calNetGross(res) - res.appliedAmount;
            res.isAppliedAmount = 0;
          });
          if (type) {
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
          }
          this.isInvoiceloading = false;
        }
      });
  }
}
