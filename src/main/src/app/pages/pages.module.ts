import { NgModule } from '@angular/core';
import {
  NbAutocompleteModule,
  NbButtonModule,
  NbCardModule,
  NbDatepickerModule,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbListModule,
  NbMenuModule,
  NbSelectModule,
  NbSpinnerModule,
  NbTooltipModule,
  NbUserModule,
} from '@nebular/theme';

import { DecimalPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { ThemeModule } from '../@theme/theme.module';
import { EditEmailComponent } from './components/edit-email/edit-email.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { SearchCustomerComponent } from './components/search-customer/search-customer.component';
import { SearchInvoiceByConditionComponent } from './components/search-invoice-by-condition/search-invoice-by-condition.component';
import { SelectDateComponent } from './components/select-date/select-date.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { DeleteBtnAggridComponent } from './statements/rc002tx/delete-btn-aggrid/delete-btn-aggrid.component';
@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    AgGridModule,
    NbCardModule,
    NbInputModule,
    NbSelectModule,
    NbDatepickerModule,
    NbButtonModule,
    NbIconModule,
    ReactiveFormsModule,
    NbFormFieldModule,
    NbListModule,
    NbUserModule,
    NbSpinnerModule,
    NbTooltipModule,
    AgGridModule.withComponents([DeleteBtnAggridComponent]),
    NbAutocompleteModule,
  ],
  declarations: [
    PagesComponent,
    SearchCustomerComponent,
    SearchInvoiceByConditionComponent,
    PaginationComponent,
    SelectDateComponent,
    EditEmailComponent,
  ],
  providers: [DecimalPipe],
  exports: [PaginationComponent],
})
export class PagesModule {}
