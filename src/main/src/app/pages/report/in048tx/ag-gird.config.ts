import * as moment from 'moment';
import {In048txButtonComponent} from './in048tx-button/in048tx-button.component';
import {In048txStatusComponent} from './in048tx-status/in048tx-status.component';

const logSetting = [
  {
    headerName: 'Action',
    field: 'requestId',
    colId: 'params',
    width: 150,
    cellRendererFramework: In048txButtonComponent,
  },
  {
    headerName: 'Parameter',
    children: [
      {
        headerName: 'pBusinessUnit',
        field: 'pbusinessUnit',
      },
      {
        headerName: 'pCustomerClass',
        field: 'pcustomerClass',
      },
      {
        headerName: 'pCustomerName',
        field: 'pcustomerName',
        columnGroupShow: 'open',
      },
      {
        headerName: 'pSiteNumber',
        field: 'psiteNumber',
        columnGroupShow: 'open',
      },
      {
        headerName: 'pCustomerCode',
        field: 'pcustomerCode',
        columnGroupShow: 'open',
      },
      {
        headerName: 'pStatementNumber',
        field: 'pstatementNumber',
        columnGroupShow: 'open',
      },
      {
        headerName: 'pReceiptOrTaxInvoiceNumber',
        field: 'preceiptOrTaxInvoiceNumber',
        columnGroupShow: 'open',
      },
      {
        headerName: 'pStatementStatus',
        field: 'pstatementStatus',
      },
      {
        headerName: 'pAdvanceReceiptStatus',
        field: 'padvanceReceiptStatus',
      },
    ],
  },
  {
    headerName: 'Log details',
    children: [
      {
        headerName: 'Job Id',
        field: 'reportJobInfoId',
      },
      {
        headerName: 'Status',
        field: 'jobInfoStatus',
        cellRendererFramework: In048txStatusComponent,
      },
      {
        headerName: 'Start Processing',
        field: 'startProcessing',
        valueFormatter: function (value) {
          return moment(value.value).format('DD/MM/YYYY HH:mm:ss');
        },
      },
      {
        headerName: 'End Processing',
        field: 'endProcessing',
        valueFormatter: function (value) {
          return value.value === null
            ? '-'
            : moment(value.value).format('DD/MM/YYYY HH:mm:ss');
        },
      },
      {
        headerName: 'Expiry Date',
        field: 'expiryDate',
        valueFormatter: function (value) {
          return value.value === null
            ? '-'
            : moment(value.value).format('DD/MM/YYYY HH:mm:ss');
        },
      },
    ],
  },
];
const defaultCofDef = {
  resizable: true,
  filter: true,
  sortable: true,
};

export { defaultCofDef, logSetting };
