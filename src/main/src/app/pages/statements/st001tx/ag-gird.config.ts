import * as moment from 'moment';
import { St001txButtonComponent } from './st001tx-button/st001tx-button.component';
import { St001txStatusComponent } from './st001tx-status/st001tx-status.component';

const logSetting = [
  {
    headerName: 'Action',
    field: 'requestId',
    colId: 'params',
    width: 570,
    cellRendererFramework: St001txButtonComponent,
  },
  {
    headerName: 'Parameter',
    children: [
      {
        headerName: 'pbusinessUnit',
        field: 'pbusinessUnit',
        columnGroupShow: 'open',
      },
      {
        headerName: 'pcustomerClass',
        field: 'pcustomerClass',
      },
      {
        headerName: 'pcustomerSubClass',
        field: 'pcustomerSubClass',
      },
      {
        headerName: 'psiteNumber',
        field: 'psiteNumber',
        columnGroupShow: 'open',
      },
      {
        headerName: 'pcustomerCode',
        field: 'pcustomerCode',
        columnGroupShow: 'open',
      },
      {
        headerName: 'pperiodCode',
        field: 'pperiodCode',
        columnGroupShow: 'open',
      },
      {
        headerName: 'psendEmail',
        field: 'psendEmail',
        columnGroupShow: 'open',
      },
    ],
  },
  {
    headerName: 'Log details',
    children: [
      {
        headerName: 'userJobName',
        field: 'userJobName',
        columnGroupShow: 'open',
      },
      {
        headerName: 'Job Id',
        field: 'jobInfoId',
        columnGroupShow: 'open',
      },
      {
        headerName: 'Request Id',
        field: 'requestId',
        valueFormatter: function (value) {
          let request;
          if (
            value.data.requestId === null &&
            value.data.endProcessing === null
          ) {
            request = 'Process...';
          } else if (value.data.jobInfoStatus === 'Failed') {
            request = 'Failed';
          } else if (
            value.data.jobInfoStatus === 'Completed' &&
            (value.data.requestId === null || value.data.successStatement === 0)
          ) {
            request = 'No data';
          } else {
            request = value.value;
          }
          return request;
        },
      },
      {
        headerName: 'Status',
        field: 'jobInfoStatus',
        cellRendererFramework: St001txStatusComponent,
      },
      {
        headerName: 'parentJobId',
        field: 'parentJobId',
        columnGroupShow: 'open',
      },
      {
        headerName: 'Total Invoices',
        field: 'totalInvoices',
      },
      {
        headerName: 'Total Statement',
        field: 'successStatement',
      },
      {
        headerName: 'Start Processing',
        field: 'startProcessing',
        valueFormatter: function (value) {
          return moment(value.value).format('DD/MM/YYYY HH:mm:ss');
        },
      },
      {
        headerName: 'Start Import Data Processing',
        field: 'startImportDataProcessing',
        valueFormatter: function (value) {
          return value.value === null
            ? '-'
            : moment(value.value).format('DD/MM/YYYY HH:mm:ss');
        },
      },
      {
        headerName: 'Start CreateStatementProcessing',
        field: 'startCreateStatementProcessing',
        valueFormatter: function (value) {
          return value.value === null
            ? '-'
            : moment(value.value).format('DD/MM/YYYY HH:mm:ss');
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
        headerName: 'owner',
        field: 'owner',
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
