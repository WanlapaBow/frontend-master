import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'statements',
        loadChildren: () =>
          import('./statements/statements.module').then(
            (m) => m.StatementsModule,
          ),
      },
      {
        path: 'interface',
        loadChildren: () =>
          import('./interface/interface.module').then((m) => m.InterfaceModule),
      },
      {
        path: 'report',
        loadChildren: () =>
          import('./report/report.module').then((m) => m.ReportModule),
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'matching',
        loadChildren: () =>
          import('./matching/matching.module').then((m) => m.MatchingModule),
      },
      {
        path: '',
        redirectTo: 'statements',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
