import { NgModule } from '@angular/core';

import {CommonModule} from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import {
  NbAccordionModule,
  NbAutocompleteModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbContextMenuModule,
  NbDatepickerModule,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbListModule,
  NbSelectModule,
  NbSpinnerModule, NbTooltipModule,
  NbUserModule,
} from '@nebular/theme';
import { AgGridModule } from 'ag-grid-angular';
import { ThemeModule } from '../../@theme/theme.module';
import { PagesModule } from '../pages.module';
import { In024txButtonComponent } from './in024tx/in024tx-button/in024tx-button.component';
import { In024txStatusComponent } from './in024tx/in024tx-status/in024tx-status.component';
import { In024txComponent } from './in024tx/in024tx.component';
import { In035txButtonComponent } from './in035tx/in035tx-button/in035tx-button.component';
import { In035txStatusComponent } from './in035tx/in035tx-status/in035tx-status.component';
import { In035txComponent } from './in035tx/in035tx.component';
import { In048txButtonComponent } from './in048tx/in048tx-button/in048tx-button.component';
import { In048txStatusComponent } from './in048tx/in048tx-status/in048tx-status.component';
import { In048txComponent } from './in048tx/in048tx.component';
import { In069txComponent } from './in069tx/in069tx.component';
import { In081n2txButtonComponent } from './in081n2tx/in081n2tx-button/in081n2tx-button.component';
import { In081n2txStatusComponent } from './in081n2tx/in081n2tx-status/in081n2tx-status.component';
import { In081n2txComponent } from './in081n2tx/in081n2tx.component';
import { ReceiptReportButtonComponent } from './receipt-report/receipt-report-button/receipt-report-button.component';
import { ReceiptReportComponent } from './receipt-report/receipt-report.component';
import { ReportRoutingModule } from './report-routing.module';
import { ReportComponent } from './report.component';
import { StatementExcelReportButtonComponent } from './statement-excel-report/statement-excel-report-button/statement-excel-report-button.component';
import { StatementExcelReportComponent } from './statement-excel-report/statement-excel-report.component';

@NgModule({
  declarations: [ReportComponent, In069txComponent, In035txComponent, In048txComponent, In048txButtonComponent, In048txStatusComponent, In024txComponent, In024txButtonComponent, In024txStatusComponent, In081n2txComponent, In081n2txButtonComponent, In081n2txStatusComponent, In035txButtonComponent, In035txStatusComponent, ReceiptReportComponent, ReceiptReportButtonComponent, StatementExcelReportComponent, StatementExcelReportButtonComponent],
  imports: [
    CommonModule,
    ReportRoutingModule,
    NbCardModule,
    ReactiveFormsModule,
    NbSelectModule,
    NbIconModule,
    NbButtonModule,
    ThemeModule,
    NbInputModule,
    NbDatepickerModule,
    AgGridModule,
    NbCheckboxModule,
    NbSpinnerModule,
    NbListModule,
    NbUserModule,
    NbFormFieldModule,
    NbAutocompleteModule,
    NbAccordionModule,
    NbContextMenuModule,
    PagesModule,
    NbTooltipModule,
  ],
})
export class ReportModule { }
