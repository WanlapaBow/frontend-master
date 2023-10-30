import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  NbDateService,
  NbSidebarService,
  NbToastrService,
} from '@nebular/theme';
import * as moment from 'moment';
import { CommonService } from '../../../_helpers/common.service';
import { UtilsService } from '../../../_helpers/utils.service';
import { StatementServiceService } from '../../../service/statement-service.service';
import { defaultColDef, invDefaultColDef } from './ag-grid.config';
import { Rc001txService } from './rc001tx.service';

@Component({
  selector: 'ngx-receipt-create',
  templateUrl: './rc001tx.component.html',
  styleUrls: ['./rc001tx.component.scss'],
})
export class Rc001txComponent implements OnInit {
  gridColumnApi;
  gridColumnApiLine;
  rowData: object;
  columnDefs;
  defaultColDef;
  rowSelection;
  paginationPageSize;
  // statement Detail
  columnLineDefs;
  recepitColDef;
  lineData: any;
  statementNumber: any;
  statementHeader: any;
  // msg
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
  isShowDetail: boolean = false;
  isShowStatement: boolean = false;
  // form
  form: FormGroup;
  invoiceSelectList: any[] = [];
  gridApi;
  gridApiLine;
  invDefaultColDef: any;
  // }
  isInvoiceDisable: boolean = false;
  isCheckAll: boolean = false;
  //   }
  isDisableReceiptAmt: boolean = false;
  // isInvoiceLastPage: boolean = false;
  totalSelectCurrent: any = 0;
  flagCheckSelectAll: boolean = false;
  // invoicePageSize;
  // invoiceTotalPages: any;
  // isInvoiceFirstPage: boolean = false;
  // }
  isInvoiceLoading: boolean = false;
  isReceiptLoading: boolean = true;
  isStatementLoading: boolean = true;
  period: { start: any; end: any };
  realtime: any = {
    receiptAmount: 0,
    receiptUnappiedAmt: 0,
    sumAppliedAmt: 0,
    sumInvoiceRemainingAmt: 0,
    statementRemainingAmt: 0,
  };
  isCheckAllThisPage: boolean = false;
  totalThisPage: any = 0;
  private id: any;
  isClear: boolean = false;
  isPeriod: boolean = false;
  isComplete: boolean = false;
  buttonCheck: any = {
    enableCreateAdvWhtCertButton: true,
    enableCancelAdvWhtCertButton: false,
    enableReprintAdvWhtCertButton: false,
    enableReceiptCompleteButton: false,
    enableInCompleteButton: false,
    enableCreateAdvReceiptButton: false,
    enableCancelAdvReceiptButton: false,
    enableReprintAdvReceiptButton: false,
  };
  checkAccount: any;
  isValidateApplied: boolean = false;

  dateNow;

  constructor(
    protected dateService: NbDateService<Date>,
    private _Activatedroute: ActivatedRoute,
    private service: Rc001txService,
    private toastrService: NbToastrService,
    private _statementService: StatementServiceService,
    public commonService: CommonService,
    private sidebarService: NbSidebarService,
  ) {
    this.sidebarService.compact('menu-sidebar');
    this.recepitColDef = [
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
    ];
    this.defaultColDef = defaultColDef;
    this.rowSelection = 'multiple';
    this.paginationPageSize = 10;
    this.invDefaultColDef = invDefaultColDef;
    this.columnLineDefs = [
      {
        headerName: '',
        field: 'isSelect',
        checkboxSelection: true,
        width: 50,
        editable: false,
      },
      {
        headerName: 'PROP ID',
        field: 'propId',
        editable: false,
      },
      {
        headerName: 'REMAINING AMOUNT',
        field: 'maxApplied',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
        editable: false,
      },
      {
        headerName: 'ADJUST APPLIED AMOUNT',
        field: 'adjustAmount',
        editable: true,
        cellRenderer: function (params) {
          return (
            '<span><i class="fa fa-edit text-primary"></i> ' +
            params.value +
            '</span>'
          );
        },
        valueParser: this.numberParser,
        valueFormatter: function (params) {
          return params.value != null && typeof +params.value === 'number'
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
      },
      {
        headerName: 'APPLIED AMOUNT',
        field: 'appliedAmount',
        editable: false,
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
      },
      {
        headerName: 'INVOICE NO.',
        field: 'invoiceNumber',
        editable: false,
      },
      {
        headerName: 'ผู้เอาประกันภัย',
        field: 'beneficiaryName',
        editable: false,
      },
      {
        headerName: 'จังหวัด',
        field: 'motorLicenseProvince',
        editable: false,
      },
      {
        headerName: 'เลขทะเบียนรถ',
        field: 'motorLicensePlateNumber',
        editable: false,
      },
      {
        headerName: 'POLICY NUMBER',
        field: 'policyNumber',
        editable: false,
      },
      {
        headerName: 'PREMIUM',
        field: 'premium',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
        editable: false,
      },
      {
        headerName: 'STAMP',
        field: 'stamp',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
        editable: false,
      },
      {
        headerName: 'OUTPUT VAT',
        field: 'outputVat',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
        editable: false,
      },
      {
        headerName: 'WHT 1%',
        field: 'wht1percent',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
        editable: false,
      },
      {
        headerName: 'WHT1% CODE',
        field: 'whtCode',
        editable: false,
      },
      {
        headerName: 'COMMISSION',
        field: 'commission',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
        editable: false,
      },
      {
        headerName: 'INPUT VAT',
        field: 'inputVat',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
        editable: false,
      },
      {
        headerName: 'WHT',
        field: 'whtCommission',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
        editable: false,
      },
      {
        headerName: 'SERVICE FEE',
        field: 'serviceFee',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
        editable: false,
      },
      {
        headerName: 'GROSS',
        field: 'totalGross',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
        editable: false,
      },
      {
        headerName: 'TOTAL NET',
        field: 'totalNet',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
        editable: false,
      },
      {
        headerName: 'EFFECTIVE STARTDATE',
        field: 'effectiveStartDate',
        valueFormatter: function (params) {
          return params.value !== null
            ? new UtilsService().dateFormatUtc(params.value)
            : '-';
        },
        editable: false,
      },
      {
        headerName: 'INVOICE DUE DATE',
        field: 'invoiceDueDate',
        valueFormatter: function (params) {
          return params.value !== null
            ? new UtilsService().dateFormatUtc(params.value)
            : '-';
        },
        editable: false,
      },
      {
        headerName: 'STATUS',
        field: 'invoiceDueStatus',
        editable: false,
      },
      {
        headerName: 'PAYMENT STATUS',
        field: 'paymentStatus',
        editable: false,
      },
      {
        headerName: 'NET OR GROSS',
        field: 'netOrGross',
        editable: false,
      },
      {
        headerName: 'POLICY TYPE NAME',
        field: 'policyTypeName',
        editable: false,
      },
      {
        headerName: '% COM',
        field: 'percentCommission',
        editable: false,
      },
      {
        headerName: 'CONTRACT TYPE',
        field: 'contractType',
        editable: false,
      },
      {
        headerName: 'ISSUE DATE',
        field: 'issueDate',
        editable: false,
        valueFormatter: function (params) {
          return params.value !== null
            ? new UtilsService().dateFormatUtc(params.value)
            : '-';
        },
      },
      {
        headerName: 'EXPIRY DATE',
        field: 'expiryDate',
        editable: false,
        valueFormatter: function (params) {
          return params.value !== null
            ? new UtilsService().dateFormatUtc(params.value)
            : '-';
        },
      },
      {
        headerName: 'SENDER AGENT NUMBER',
        field: 'senderAgentNumber',
        editable: false,
      },
      {
        headerName: 'SENDER AGENT NAME',
        field: 'senderAgentName',
        editable: false,
      },
      {
        headerName: 'CHASSIS',
        field: 'motorChassis',
        editable: false,
      },
      {
        headerName: 'ENGINE',
        field: 'motorEngine',
        editable: false,
      },
      {
        headerName: 'ยี่ห้อรถ',
        field: 'motorCarBrandName',
        editable: false,
      },
      {
        headerName: 'CAMPAIGN',
        field: 'campaign',
        editable: false,
      },
      {
        headerName: 'TRANS NUMBER',
        field: 'pandaTransNumber',
        editable: false,
      },
      {
        headerName: 'D-CHANNEL',
        field: 'dchannel',
        editable: false,
      },
      {
        headerName: 'PAYMENT DUE DATE',
        field: 'paymentDueDate',
        editable: false,
        valueFormatter: function (params) {
          return params.value !== null
            ? new UtilsService().dateFormatUtc(params.value)
            : '-';
        },
      },
      {
        headerName: 'ประเภทสัญญา',
        field: 'motorContractPolicyType',
        editable: false,
      },
      {
        headerName: 'เลขที่สัญญา',
        field: 'motorContractPolicyNumber',
        editable: false,
      },
      {
        headerName: 'CO SIGN',
        field: 'coSign',
        editable: false,
      },
      {
        headerName: 'COLLATERAL NO.',
        field: 'collateralNo',
        editable: false,
      },
      {
        headerName: 'CAR TYPE',
        field: 'motorCarType',
        editable: false,
      },
      {
        headerName: 'ทุนประกัน',
        field: 'faceAmount',
        editable: false,
      },
      {
        headerName: 'ประเภททุนประกัน',
        field: 'beneficiaryType',
        editable: false,
      },
    ];
  }

  get receiptAmount() {
    return this.form.get('receiptAmount');
  }

  get accountingDate() {
    return this.form.get('accountingDate');
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  onGridReadyLine(params) {
    this.gridApiLine = params.api;
    this.gridColumnApiLine = params.columnApi;
  }

  onPaginationChanged(event) {
    if (this.gridApi) {
    }
  }

  ngOnInit(): void {
    this.statementNumber = this._Activatedroute.paramMap.subscribe((params) => {
      this.id = params.get('id');
      this._statementService.setStatement(this.id);
      this.getStatementById(this._statementService.getStatement().id, true);
    });
    this.form = new FormGroup({
      receiptMethodId: new FormControl(
        { value: '', disabled: false },
        Validators.required,
      ),
      receiptNumber: new FormControl(
        { value: '', disabled: false },
        Validators.required,
      ),
      receiptAmount: new FormControl(
        {
          value: 0,
          disabled: false,
        },
        [
          Validators.required,
          Validators.pattern('^\\s*(?=.*[1-9])\\d*(?:\\.\\d{1,2})?\\s*$'),
        ],
      ),
      unappliedAmount: new FormControl({ value: 0, disabled: false }), // เฉพาะหน้าบ้าน
      receiptDate: new FormControl(
        { value: new Date(), disabled: false },
        Validators.required,
      ),
      accountingDate: new FormControl(
        { value: new Date(), disabled: false },
        Validators.required,
      ),
      maturityDate: new FormControl({ value: new Date(), disabled: false }),
      depositDate: new FormControl(
        { value: new Date(), disabled: false },
        Validators.required,
      ),
      remark: new FormControl({ value: '', disabled: false }),
    });
    const date = moment(this.dateService.today()).format('YYYY-MM-DDT00:00:00');
    this.changeAccountDate(date);
    // this.invoicePageSize = 10;
  }

  createRecepit() {
    this.isShowDetail = true;
    this.getInvoiceDetail(this.statementHeader.statementId, true);
    if (
      this.form.value.receiptAmount === '0' ||
      this.form.value.receiptAmount === '' ||
      this.form.value.receiptAmount === 0
    ) {
      this.isDisableReceiptAmt = true;
    } else {
      this.isDisableReceiptAmt = false;
    }
  }

  onInvoiceValueChange(event: any) {
    if (!this.isClear) {
      if (event.data.isSelect === undefined || event.data.isSelect === false) {
        event.data.isSelect = true;
        this.calInvoiceAtJust(event);
        const invoiceSelect = {
          invoiceId: event.data.id,
          appliedAmount: Number(event.data.adjustAmount),
        };
        this.invoiceSelectList.push(invoiceSelect);
      } else {
        event.data.isSelect = false;
        this.gridApiLine
          .getRowNode(event.rowIndex)
          .setDataValue('adjustAmount', 0.0);
        this.gridApiLine
          .getRowNode(event.rowIndex)
          .setDataValue('maxApplied', event.data.invoiceRemaining);
        const indexRemove = this.invoiceSelectList.findIndex(
          (x) => x.invoiceId === event.data.id,
        );
        this.invoiceSelectList.splice(indexRemove, 1);
      }
      this.summaryInvoice();
      this.validateSelectedApplied();
    }
  }

  onReceiptCreate() {
    const params = this.form.value;
    params.invoices = this.invoiceSelectList;
    params.statementNumber = this.statementHeader.statementNumber;
    // const isCheckSigns = this.checkSignUnApplieValue(this.form.value.unappliedAmount);
    // if (isCheckSigns === 1 || isCheckSigns === 0) {
    if (this.invoiceSelectList.length === 0) {
      setTimeout(() => {
        alert('กรุณาเลือก Invoice อย่างน้อย 1 ใบ');
      }, 1000);
    } else {
      this.isInvoiceLoading = true;
      this.service.postReceiptCreate(params).subscribe(
        (response) => {
          if (response['status'] === 'OK') {
            this.toastrService.show(
              this.toastrMsg.saveSuccess.message,
              this.toastrMsg.saveSuccess.title,
              {
                status: 'success',
                duration: 5000,
                destroyByClick: true,
              },
            );
            this.getRecieptLine(this.statementHeader.statementId, false);
            this.getInvoiceDetail(this.statementHeader.statementId, false);
            this.getStatementById(
              this._statementService.getStatement().id,
              false,
            );
            this.clearData();
          } else {
            this.toastrService.show(
              response['errors'],
              this.toastrMsg.noData.message,
              {
                status: 'warning',
                duration: 5000,
                destroyByClick: true,
              },
            );
          }
          this.isInvoiceLoading = false;
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
    // }
  }

  isReceiptAmountChange(event: any) {
    if (
      this.form.value.receiptAmount === '0' ||
      this.form.value.receiptAmount === ''
    ) {
      this.isDisableReceiptAmt = true;
    } else {
      const temp = this.gridApiLine.getSelectedNodes();
      this.gridApiLine.deselectAll();
      // แยกติดลบออกมาคำนวนก่อน
      const negativeRemaining = temp.filter((x) => {
        return x.data.adjustAmount < 0;
      });
      const positiveRemaining = temp.filter((x) => {
        return x.data.maxApplied > 0;
      });
      if (negativeRemaining.length > 0) {
        negativeRemaining.forEach(function (node, index) {
          node.setSelected(true);
        });
      }
      if (positiveRemaining.length > 0) {
        positiveRemaining.forEach(function (node, index) {
          node.setSelected(true);
        });
      }
      this.isDisableReceiptAmt = false;
    }
    this.summaryInvoice();
    this.validateSelectedApplied();
  }

  // onCellValueChange($event: any) {
  //   // if (Math.sign($event.data.maxApplied)) {
  //   //   if ($event.data.adjustAmount > $event.data.maxApplied) {
  //   //     //confirm('applied amount เกินที่สามารถทำได้! กรุณาแก้ไข edit applied amount');
  //   //     //this.gridApiLine.getRowNode($event.rowIndex).setDataValue('adjustAmount', $event.data.maxApplied);
  //   //   }
  //   // }
  // }

  clearData() {
    this.isClear = true;
    if (this.isClear) {
      this.realtime = {
        receiptAmount: 0,
        receiptUnappiedAmt: 0,
        sumAppliedAmt: 0,
        sumInvoiceRemainingAmt: 0,
        statementRemainingAmt: 0,
      };
      this.invoiceSelectList = [];
      this.gridApiLine.deselectAll();
      this.isCheckAll = false;
      this.clearSelectAll();
      this.clearSelectThisPage();
      this.form.get('receiptMethodId').setValue('');
      this.form.get('receiptNumber').setValue('');
      this.form.get('receiptAmount').setValue(0.0);
      this.form.get('unappliedAmount').setValue(0.0);
      this.form.get('receiptDate').setValue(new Date());
      this.form.get('accountingDate').setValue(this.dateNow);
      this.form.get('maturityDate').setValue(new Date());
      this.form.get('depositDate').setValue(new Date());
      this.form.get('remark').setValue('');
      const tempLine = this.lineData.map((res) => {
        if (res.isSelect) {
          res.isSelect = false;
          res.adjustAmount = 0.0;
          res.maxApplied = res.invoiceRemaining;
          res.isSelectAll = false;
        } else {
          res.adjustAmount = 0.0;
          res.maxApplied = res.invoiceRemaining;
          res.isSelectAll = false;
        }
        return res;
      });
      this.gridApiLine.applyTransaction({ update: tempLine });
      this.gridApiLine.deselectAll();
      setTimeout(() => {
        this.isClear = false;
      }, 0);
    }
  }

  onCellEditClick($event: any, key, char, pinned) {
    this.gridApiLine.setFocusedCell($event.rowIndex, 'adjustAmount', pinned);
    this.gridApiLine.startEditingCell({
      rowIndex: $event.rowIndex,
      colKey: 'adjustAmount',
    });
  }

  onBtStartEditing(key, char, pinned) {
    this.gridApiLine.setFocusedCell(0, 'adjustAmount', pinned);
    this.gridApiLine.startEditingCell({
      rowIndex: 0,
      colKey: 'adjustAmount',
      rowPinned: pinned,
      keyPress: key,
      charPress: char,
    });
  }

  // onPageSizeChanged(event: any) {
  //   this.gridApiLine.paginationSetPageSize(Number(event.paginationPageSize));
  //   this.paginationPageSize = Number(event.paginationPageSize);
  //   // this.getLog(event.currentPage, event.paginationPageSize);
  //   this.getInvoiceDetail(this.statementHeader.statementId, true, event.currentPage, event.paginationPageSize);
  //   this.invoicePageSize = event.paginationPageSize;
  // }
  //
  // onBt(event: any) {
  //   this.invoicePageSize = event.paginationPageSize;
  //   this.getInvoiceDetail(this.statementHeader.statementId, true, event.currentPage, event.paginationPageSize);

  onCellEditStart($event: any) {
    $event.data.adjustAmount = 0;
    this.summaryInvoice();
  }

  onCellEditStop($event: any) {
    this.calInvoiceAtJust($event);
    const indexRemove = this.invoiceSelectList.findIndex(
      (x) => x.invoiceId === $event.data.id,
    );
    $event.value = $event.data.adjustAmount;
    if (indexRemove >= 0) {
      this.invoiceSelectList[indexRemove].appliedAmount = Number(
        $event.data.adjustAmount,
      );
    }
    this.summaryInvoice();
  }

  changeReceiptDate(date: any) {
    this.form.get('accountingDate').setValue(new Date(date));
    this.form.get('maturityDate').setValue(new Date(date));
    this.form.get('depositDate').setValue(new Date(date));
  }

  onSelectAllCheck() {
    this.flagCheckSelectAll = true;
    this.isCheckAll = !this.isCheckAll;
    if (this.isCheckAll) {
      // this.gridApiLine.selectAll();
      const temp = this.gridApiLine.getModel();

      temp.forEachNode(function (rowNode, index) {
        if (rowNode.data.maxApplied < 0) {
          rowNode.setSelected(true);
        }
      });
      temp.forEachNode(function (rowNode, index) {
        if (rowNode.data.maxApplied > 0) {
          rowNode.setSelected(true);
        }
      });
      this.clearSelectThisPage();
    } else {
      this.gridApiLine.deselectAll();
    }
  }

  filterWeekend(date: any) {
    return date.getDay() !== 0 && date.getDay() !== 6;
  }

  numberParser(params) {
    const regex = /^[+-]?((\d+(\.\d*)?)|(\.\d+))$/;
    const flag = regex.test(params.newValue);
    if (flag) {
      return Number(params.newValue);
    } else {
      return Number(0);
    }
  }

  summaryInvoice() {
    const selectList = this.gridApiLine.getSelectedRows();
    const getReceiptAmt = this.form.value.receiptAmount;
    const sumApplieAmount: number = selectList
      .filter((x) => x.isSelect === true)
      .reduce((a, b, index) => {
        return a + Number(b['adjustAmount'] || 0);
      }, 0);
    const sumInvoiceRemaining: number = selectList
      .filter((x) => x.isSelect === true)
      .reduce((a, b, index) => {
        return a + Number(b['maxApplied'] || 0);
      }, 0);
    this.realtime = {
      receiptAmount: getReceiptAmt ? getReceiptAmt : 0,
      receiptUnappiedAmt: (getReceiptAmt - sumApplieAmount).toFixed(2),
      sumAppliedAmt: sumApplieAmount,
      sumInvoiceRemainingAmt: sumInvoiceRemaining,
      statementRemainingAmt:
        this.statementHeader.remainingAmount - sumApplieAmount,
    };
    this.form
      .get('unappliedAmount')
      .setValue(
        this.realtime.receiptUnappiedAmt === '-0.00'
          ? '0.00'
          : this.realtime.receiptUnappiedAmt,
      );
    if (this.isCheckAll) {
      this.totalSelectCurrent = this.gridApiLine.getSelectedRows().length;
    } else {
      this.totalSelectCurrent = 0;
    }
  }

  onSelectThisPage() {
    this.isCheckAllThisPage = !this.isCheckAllThisPage;
    if (this.isCheckAllThisPage) {
      if (this.lineData.length < this.paginationPageSize) {
        // this.gridApiLine.selectAll();
        const temp = this.gridApiLine.getModel();
        temp.forEachNode(function (rowNode, index) {
          if (rowNode.data.maxApplied < 0) {
            rowNode.setSelected(true);
          }
        });
        temp.forEachNode(function (rowNode, index) {
          if (rowNode.data.maxApplied > 0) {
            rowNode.setSelected(true);
          }
        });
      } else if (this.lineData.length > this.paginationPageSize) {
        const pages = Array.from(
          {
            length: Math.ceil(
              this.lineData.length / this.gridApiLine.paginationGetPageSize(),
            ),
          },
          (_, i) =>
            this.getDataPerPage(
              this.lineData.length,
              this.gridApiLine.paginationGetPageSize(),
              i,
            ),
        );
        const limitPerPage = pages[this.gridApiLine.paginationGetCurrentPage()];
        this.gridApiLine.forEachNode(function (node, index) {
          if (
            index >= limitPerPage.start - 1 &&
            index <= limitPerPage.end - 1
          ) {
            node.setSelected(true);
          } else {
            node.setSelected(false);
          }
        });
      }
      this.clearSelectAll();
    } else {
      this.gridApiLine.deselectAll();
    }
    setTimeout(
      () => (this.totalThisPage = this.gridApiLine.getSelectedRows().length),
      500,
    );
  }
  private getPageStart(pageSize, pageNr) {
    return pageSize * pageNr;
  }
  private getDataPerPage(total, pageSize, pageNr) {
    const start = Math.max(this.getPageStart(pageSize, pageNr), 0);
    const end = Math.min(this.getPageStart(pageSize, pageNr + 1), total);
    return { start: start + 1, end: end };
  }
  private calNetGross(rowdata) {
    if (rowdata.netOrGross === 'Net') {
      return rowdata.totalNet;
    } else if (rowdata.netOrGross === 'Gross') {
      return rowdata.totalGross;
    }
  }

  private getStatementById(id: any, type) {
    this.isStatementLoading = true;
    this.service.getHeaderById(id).subscribe(
      (response) => {
        if (response['status'] === 'OK') {
          this.statementHeader = response['payload'];
          this.realtime.statementRemainingAmt =
            this.statementHeader.remainingAmount;
          this.getRecieptLine(this.statementHeader.statementId, true);
          // this.getPeriodById();
          this.getButtonCheck(this.statementHeader.statementNumber);
          this.isShowStatement = true;
          if (type) {
            this.toastrService.show(
              this.toastrMsg.searchSuccess.message,
              this.toastrMsg.searchSuccess.title,
              {
                status: 'success',
                duration: 5000,
                destroyByClick: true,
              },
            );
          }
          this.isStatementLoading = false;
        } else {
          this.toastrService.show(
            this.toastrMsg.noData.message,
            this.toastrMsg.noData.title,
            {
              status: 'warning',
              duration: 5000,
              destroyByClick: true,
            },
          );
          this.isStatementLoading = false;
        }
      },
      (error) => {
        this.toastrService.show(error.message, this.toastrMsg.error.title, {
          status: 'danger',
          duration: 5000,
          destroyByClick: true,
        });
        this.isStatementLoading = false;
      },
    );
  }

  private getRecieptLine(statementId, type) {
    this.isReceiptLoading = true;
    this.service.getRecieptDetailById(statementId).subscribe(
      (line) => {
        if (line['payload'].content) {
          if (type) {
            this.toastrService.show(
              this.toastrMsg.searchSuccess.message,
              this.toastrMsg.searchSuccess.title,
              {
                status: 'success',
                duration: 5000,
                destroyByClick: true,
              },
            );
          }

          this.rowData = line['payload'].content;
          this.isReceiptLoading = false;
        } else {
          this.toastrService.show(
            this.toastrMsg.noData.message,
            this.toastrMsg.noData.title,
            {
              status: 'warning',
              duration: 5000,
              destroyByClick: true,
            },
          );
          this.isReceiptLoading = false;
        }
      },
      (error) => {
        this.toastrService.show(error.message, this.toastrMsg.error.title, {
          status: 'danger',
          duration: 5000,
          destroyByClick: true,
        });
        this.isReceiptLoading = false;
      },
    );
  }

  private getInvoiceDetail(statementId, type) {
    this.isInvoiceLoading = true;
    this.service.getInvoiceDetailById(statementId).subscribe(
      (response) => {
        if (response['status'] === 'OK') {
          this.lineData = response['payload'].content;
          // this.invoiceTotalPages = response['payload'].totalPages;
          // this.isInvoiceLastPage = response['payload'].last;
          // this.isInvoiceFirstPage = response['payload'].first;
          this.lineData.map((res) => {
            res.maxApplied = this.calNetGross(res) - res.appliedAmount;
            res.adjustAmount = 0.0;
            res.invoiceRemaining = this.calNetGross(res) - res.appliedAmount;
            res.isSelectAll = false;
          });
          if (type) {
            this.toastrService.show(
              this.toastrMsg.searchSuccess.message,
              this.toastrMsg.searchSuccess.title,
              {
                status: 'success',
                duration: 5000,
                destroyByClick: true,
              },
            );
          }
          this.isInvoiceLoading = false;
        } else {
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

  private calInvoiceAtJust($event: any) {
    // console.info('----ADJUST-----');
    // console.log($event.value);
    let value = +$event.value;
    // console.log($event.value);
    // console.log(isNaN(value));
    if ($event.value === '' || typeof value !== 'number' || isNaN(value)) {
      $event.value = 0;
      value = 0;
    }
    if ($event.data.invoiceRemaining < 0) {
      // netGross ติดลบ
      if ($event.data.maxApplied === 0.0) {
        this.gridApiLine
          .getRowNode($event.rowIndex)
          .setDataValue('maxApplied', $event.data.invoiceRemaining.toFixed(2));
        this.gridApiLine
          .getRowNode($event.rowIndex)
          .setDataValue('adjustAmount', 0.0);
      }
      if (value !== 0) {
        this.gridApiLine
          .getRowNode($event.rowIndex)
          .setDataValue('maxApplied', 0.0);
        this.gridApiLine
          .getRowNode($event.rowIndex)
          .setDataValue(
            'adjustAmount',
            $event.data.invoiceRemaining.toFixed(2),
          );
      } else if (value === 0) {
        this.gridApiLine
          .getRowNode($event.rowIndex)
          .setDataValue('maxApplied', 0.0);
        this.gridApiLine
          .getRowNode($event.rowIndex)
          .setDataValue(
            'adjustAmount',
            $event.data.invoiceRemaining.toFixed(2),
          );
      } else {
        this.gridApiLine
          .getRowNode($event.rowIndex)
          .setDataValue('adjustAmount', 0.0);
      }
    } else {
      // netGross +
      if (this.realtime.receiptAmount === 0) {
        // receipt == 0
        if (value <= 0) {
          this.gridApiLine
            .getRowNode($event.rowIndex)
            .setDataValue('adjustAmount', 0.0);
          this.gridApiLine
            .getRowNode($event.rowIndex)
            .setDataValue(
              'maxApplied',
              $event.data.invoiceRemaining.toFixed(2),
            );
        } else if (value < $event.data.invoiceRemaining) {
          this.gridApiLine
            .getRowNode($event.rowIndex)
            .setDataValue(
              'maxApplied',
              ($event.data.invoiceRemaining - value).toFixed(2),
            );
        } else if (value >= $event.data.invoiceRemaining) {
          this.gridApiLine
            .getRowNode($event.rowIndex)
            .setDataValue('maxApplied', 0.0);
          this.gridApiLine
            .getRowNode($event.rowIndex)
            .setDataValue(
              'adjustAmount',
              $event.data.invoiceRemaining.toFixed(2),
            );
        }
      } else {
        // receipt Amt > 0 -> value === 0 (คือ auto select all) & value > 0 (แก้ manual)
        if (value === 0) {
          if (this.realtime.receiptUnappiedAmt < $event.data.invoiceRemaining) {
            this.gridApiLine
              .getRowNode($event.rowIndex)
              .setDataValue('adjustAmount', this.realtime.receiptUnappiedAmt);
            this.gridApiLine
              .getRowNode($event.rowIndex)
              .setDataValue(
                'maxApplied',
                (
                  $event.data.invoiceRemaining -
                  this.realtime.receiptUnappiedAmt
                ).toFixed(2),
              );
          } else if (
            this.realtime.receiptUnappiedAmt >= $event.data.invoiceRemaining
          ) {
            this.gridApiLine
              .getRowNode($event.rowIndex)
              .setDataValue(
                'adjustAmount',
                $event.data.invoiceRemaining.toFixed(2),
              );
            this.gridApiLine
              .getRowNode($event.rowIndex)
              .setDataValue('maxApplied', 0.0);
          }
        } else {
          if (value < 0) {
            this.gridApiLine
              .getRowNode($event.rowIndex)
              .setDataValue(
                'adjustAmount',
                this.realtime.receiptUnappiedAmt.toFixed(2),
              );
            this.gridApiLine
              .getRowNode($event.rowIndex)
              .setDataValue(
                'maxApplied',
                (
                  $event.data.invoiceRemaining -
                  this.realtime.receiptUnappiedAmt
                ).toFixed(2),
              );
          } else if (value <= this.realtime.receiptUnappiedAmt) {
            this.gridApiLine
              .getRowNode($event.rowIndex)
              .setDataValue('adjustAmount', value.toFixed(2));
            this.gridApiLine
              .getRowNode($event.rowIndex)
              .setDataValue(
                'maxApplied',
                ($event.data.invoiceRemaining - value).toFixed(2),
              );
          } else if (value > this.realtime.receiptUnappiedAmt) {
            this.gridApiLine
              .getRowNode($event.rowIndex)
              .setDataValue(
                'adjustAmount',
                this.realtime.receiptUnappiedAmt.toFixed(2),
              );
            this.gridApiLine
              .getRowNode($event.rowIndex)
              .setDataValue(
                'maxApplied',
                (
                  $event.data.invoiceRemaining -
                  this.realtime.receiptUnappiedAmt
                ).toFixed(2),
              );
          }
        }
        if ($event.data.adjustAmount > 0) {
          this.gridApiLine.getRowNode($event.rowIndex).setSelected(true);
        } else {
          this.gridApiLine.getRowNode($event.rowIndex).setSelected(false);
        }
      }
    }
  }
  private clearSelectAll() {
    this.isCheckAll = false;
    this.totalSelectCurrent = 0;
  }
  private clearSelectThisPage() {
    this.isCheckAllThisPage = false;
    this.totalThisPage = 0;
  }

  completeStatement() {
    this.isComplete = true;
    this.service
      .postCompleteStd(this.statementHeader.statementNumber)
      .subscribe(
        (res) => {
          if (res['status'] === 'OK' && res['payload'].length > 0) {
            this.getStatementById(this.statementHeader.statementId, false);
            this.isComplete = false;
            this.clearData();
          } else {
            this.isComplete = false;
            this.toastrService.show(
              this.toastrMsg.error.message,
              this.toastrMsg.error.title,
              {
                status: 'warning',
                duration: 5000,
              },
            );
          }
        },
        (error) => {
          this.isComplete = false;
          this.toastrService.show(error.message, this.toastrMsg.error.title, {
            status: 'danger',
            duration: 5000,
            destroyByClick: true,
          });
        },
      );
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

  changeAccountDate(event: any) {
    const date = new Date(event);
    date.setHours(date.getHours() - 7);
    const dateFinal = moment(date).format('YYYY-MM-DDTHH:mm:ss[Z]');
    this.form.get('accountingDate').setValue(dateFinal);
    this.dateNow = dateFinal;
    this.service.getCheckPeriod(dateFinal).subscribe(
      (res) => {
        if (res['status'] === 'OK') {
          this.checkAccount = res['payload'];
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
  validateSelectedApplied() {
    const tempSelect = this.gridApiLine.getSelectedRows();
    const count = tempSelect.filter((x) => x.adjustAmount === 0);
    if (count.length > 0) {
      this.isValidateApplied = true;
    } else {
      this.isValidateApplied = false;
    }
  }
}
