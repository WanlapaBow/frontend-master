import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private gridApi;

  // Setting SmartTable
  settingHeader = {
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: false,
    columns: {
      statementNumber: {
        title: 'Statement Number',
        type: 'string',
      },
      senderclientNumber: {
        title: 'Sender Client Number',
        type: 'string',
      },
      senderName: {
        title: 'Sender Name',
        type: 'string',
      },
      senderAgentNumber: {
        title: 'Sender Agent Number',
        type: 'string',
      },
      premium: {
        title: 'Premium',
        type: 'string',
      },
      stamp: {
        title: 'Stamp',
        type: 'string',
      },
      outputVAT: {
        title: 'Output VAT',
        type: 'string',
      },
      wht: {
        title: 'WHT 1%',
        type: 'string',
      },
      commission: {
        title: 'Commission',
        type: 'string',
      },
      inputvat: {
        title: 'Input VAT',
        type: 'string',
      },
      whtCommission: {
        title: 'WHT Commission',
        type: 'string',
      },
      statementAmount: {
        title: 'Statement Amount',
        type: 'string',
      },
      paidAmount: {
        title: 'Paid Amount',
        type: 'string',
      },
      remainingAmount: {
        title: 'Remaining Amount',
        type: 'string',
      },
      status: {
        title: 'Status',
        type: 'string',
      },
      email: {
        title: 'Email',
        type: 'string',
      },
    },
  };

  // show detail table
  isShowDetail = false;

  // MockData

  defaultColDef = {
    sortable: true,
    resizable: true,
    filter: true,
    cellClass: 'number-cell',
  };

  columnDefs = [
    {
      headerName: 'Statement Details',
      children: [
        {
          headerName: 'Number',
          field: 'statementNumber',
          width: 140,
          filter: 'agTextColumnFilter',
          headerCheckboxSelection: true,
          checkboxSelection: true,
        },
      ],
    },
    {
      headerName: 'Sender',
      children: [
        {
          headerName: 'Client Number',
          field: 'senderclientNumber',
          width: 140,
        },
        {
          headerName: 'Name',
          columnGroupShow: 'open',
          field: 'senderName',
          width: 100,
          filter: 'agNumberColumnFilter',
        },
        {
          headerName: 'Agent Number',
          columnGroupShow: 'open',
          field: 'senderAgentNumber',
          width: 140,
          filter: 'agNumberColumnFilter',
        },
      ],
    },
    {
      headerName: 'Premium & Stamp',
      children: [
        {
          headerName: 'premium',
          field: 'statementPremium',
          valueFormatter: this.bracketsFormatter,
          width: 140,
        },
        {
          headerName: 'stamp',
          field: 'statementStamp',
          valueFormatter: this.formatNumber,
          width: 140,
        },
      ],
    },
  ];

  columnDetailDefs = [
    {
      headerName: 'Statement Details',
      children: [
        {
          headerName: 'Number',
          field: 'statementNumber',
          width: 140,
          filter: 'agTextColumnFilter',
        },
      ],
    },
    {
      headerName: 'Sender',
      children: [
        {
          headerName: 'Client Number',
          field: 'senderclientNumber',
          width: 140,
        },
        {
          headerName: 'Name',
          field: 'senderName',
          width: 100,
        },
        {
          headerName: 'Agent Number',

          field: 'senderAgentNumber',
          width: 140,
          filter: 'agNumberColumnFilter',
        },
      ],
    },
    {
      headerName: 'Premium & Stamp',
      children: [
        {
          headerName: 'premium',
          field: 'statementPremium',
          valueFormatter: this.bracketsFormatter,
          width: 140,
        },
        {
          headerName: 'stamp',
          field: 'statementStamp',
          valueFormatter: this.formatNumber,
          width: 140,
        },
      ],
    },
    {
      headerName: 'Details',
      children: [
        {
          headerName: 'Output VAT',
          field: 'outputVAT',
          width: 140,
        },
        {
          headerName: 'WHT 1%',
          field: 'wht',
          width: 140,
          columnGroupShow: 'open',
        },
        {
          headerName: 'Commission',
          field: 'commission',
          width: 140,
          columnGroupShow: 'open',
        },
        {
          headerName: 'Input VAT',
          field: 'inputvat',
          width: 140,
          columnGroupShow: 'open',
        },
        {
          headerName: 'WHT Commission',
          field: 'whtCommission',
          width: 140,
          columnGroupShow: 'open',
        },
        {
          headerName: 'Statement Amount',
          field: 'statementAmount',
          width: 140,
          columnGroupShow: 'open',
        },
        {
          headerName: 'Paid Amount',
          field: 'paidAmount',
          width: 140,
          columnGroupShow: 'open',
        },
        {
          headerName: 'Remaining Amount',
          field: 'remainingAmount',
          width: 140,
          columnGroupShow: 'open',
        },
        {
          headerName: 'Status',
          field: 'status',
          width: 140,
          columnGroupShow: 'open',
        },
        {
          headerName: 'Email',
          field: 'email',
          width: 140,
          columnGroupShow: 'open',
        },
      ],
    },
  ];

  rowData = [
    {
      statementNumber: '90000000001',
      senderclientNumber: 'senderclientNumber',
      statementPremium: 35000,
      statementStamp: 35000,
    },
    {
      statementNumber: '90000000002',
      senderclientNumber: 'senderclientNumber',
      statementPremium: 32000,
      statementStamp: 32000,
    },
    {
      statementNumber: '90000000003',
      senderclientNumber: 'senderclientNumber',
      statementPremium: 72000,
      statementStamp: 72000,
    },
  ];

  rowDataDetails: any[] = [
    {
      statementNumber: '90000000001-L',
      senderclientNumber: 'senderclientNumber-L',
      statementPremium: 35000,
      statementStamp: 35000,
    },
  ];

  data = [
    {
      statementNumber: 'statementNumber',
      senderclientNumber: 'senderclientNumber',
      senderName: 'senderName',
      senderAgentNumber: 'senderAgentNumber',
      premium: 'premium',
      stamp: 'stamp',
      outputVAT: 'outputVAT',
      wht: 'wht',
      commission: 'commission',
      inputvat: 'inputvat',
      whtCommission: 'whtCommission',
      statementAmount: 'statementAmount',
      paidAmount: 'paidAmount',
      remainingAmount: 'remainingAmount',
      status: 'status',
      email: 'rmail',
    },
    {
      statementNumber: 'statementNumber_R2',
      senderclientNumber: 'senderclientNumber_R2',
      senderName: 'senderName_R2',
      senderAgentNumber: 'senderAgentNumber_R2',
      premium: 'premium_R2',
      stamp: 'stamp_R2',
      outputVAT: 'outputVAT_R2',
      wht: 'wht_R2',
      commission: 'commission_R2',
      inputvat: 'inputvat_R2',
      whtCommission: 'whtCommission_R2',
      statementAmount: 'statementAmount_R2',
      paidAmount: 'paidAmount_R2',
      remainingAmount: 'remainingAmount_R2',
      status: 'status_R2',
      email: 'rmail_R2',
    },
  ];

  form: any;
  starData: string[] = [];

  constructor() {}

  ngOnInit() {
    this.form = new FormGroup({
      numberCount: new FormControl(''),
    });
  }

  onRowSelect() {}

  run() {
    this.starData = [];
    const len: number = this.form.get('numberCount').value;
    for (let index = 0; index < len; index++) {
      let star = '*';
      for (let j = 0; j < index; j++) {
        star += '*';
      }
      this.starData.push(star);
    }
  }

  numberParser(params) {
    const newValue = params.newValue;
    let valueAsNumber;
    if (newValue === null || newValue === undefined || newValue === '') {
      valueAsNumber = null;
    } else {
      valueAsNumber = parseFloat(params.newValue);
    }
    return valueAsNumber;
  }

  formatNumber(params) {
    return Math.floor(params.value)
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }

  bracketsFormatter(params) {
    return '(' + params.value + ')';
  }

  onSelectionChanged(event) {
    const selectedRows = this.gridApi.getSelectedRows();
    this.rowDataDetails = [];
    selectedRows.forEach((element) => {
      this.rowDataDetails.push({
        statementNumber: element.statementNumber + '-L',
        senderclientNumber: 'senderclientNumber-L',
        statementPremium: element.statementPremium,
        statementStamp: element.statementStamp,
      });
      this.isShowDetail = true;
    });
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.selectAll();
  }
}
