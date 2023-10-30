import * as moment from 'moment';
import {In081n2txButtonComponent} from './in081n2tx-button/in081n2tx-button.component';
import {In081n2txStatusComponent} from './in081n2tx-status/in081n2tx-status.component';


const logSetting = [
  {
    headerName: 'Action',
    field: 'requestId',
    colId: 'params',
    width: 150,
    cellRendererFramework: In081n2txButtonComponent,
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
        cellRendererFramework: In081n2txStatusComponent,
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
