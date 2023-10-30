import { NgModule } from '@angular/core';
import {
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbInputModule,
} from '@nebular/theme';

import { ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '../../@theme/theme.module';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  imports: [
    NbCardModule,
    ThemeModule,
    NbIconModule,
    ReactiveFormsModule,
    NbInputModule,
    NbButtonModule,
  ],
  declarations: [DashboardComponent],
})
export class DashboardModule {}
