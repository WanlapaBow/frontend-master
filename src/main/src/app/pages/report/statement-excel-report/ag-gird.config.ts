import * as moment from 'moment';
import {In024txStatusComponent} from '../in024tx/in024tx-status/in024tx-status.component';
import {StatementExcelReportButtonComponent} from './statement-excel-report-button/statement-excel-report-button.component';

const logSetting = [
  {
    headerName: 'Action',
    field: 'requestId',
    colId: 'params',
    width: 150,
    cellRendererFramework: StatementExcelReportButtonComponent,
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
        cellRendererFramework: In024txStatusComponent,
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
