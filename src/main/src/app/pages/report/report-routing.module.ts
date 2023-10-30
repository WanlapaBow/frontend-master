import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InterfaceComponent} from '../interface/interface.component';
import {In024txComponent} from './in024tx/in024tx.component';
import {In035txComponent} from './in035tx/in035tx.component';
import {In048txComponent} from './in048tx/in048tx.component';
import {In069txComponent} from './in069tx/in069tx.component';
import {In081n2txComponent} from './in081n2tx/in081n2tx.component';
import {ReceiptReportComponent} from './receipt-report/receipt-report.component';
import {StatementExcelReportComponent} from './statement-excel-report/statement-excel-report.component';



const routes: Routes = [
  {
    path: '',
    component: InterfaceComponent,
    children: [
      {
        path: 'in069tx',
        component: In069txComponent,
      },
      {
        path: 'in035tx',
        component: In035txComponent,
      },
      {
        path: 'in048tx',
        component: In048txComponent,
      },
      {
        path: 'in024tx',
        component: In024txComponent,
      },
      {
        path: 'in081-2tx',
        component: In081n2txComponent,
      },
      {
        path: 'receiptReport',
        component: ReceiptReportComponent,
      },
      {
        path: 'statementExcelReport',
        component: StatementExcelReportComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportRoutingModule {
}
