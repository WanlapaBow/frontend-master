import * as moment from 'moment';

import {In035txButtonComponent} from './in035tx-button/in035tx-button.component';
import {In035txStatusComponent} from './in035tx-status/in035tx-status.component';

const logSetting = [
  {
    headerName: 'Action',
    field: 'requestId',
    colId: 'params',
    width: 150,
    cellRendererFramework: In035txButtonComponent,
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
        cellRendererFramework: In035txStatusComponent,
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
