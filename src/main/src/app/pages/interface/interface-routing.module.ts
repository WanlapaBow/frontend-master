import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InterfaceAllComponent } from './interface-all/interface-all.component';
import { InterfaceComponent } from './interface.component';

const routes: Routes = [
  {
    path: '',
    component: InterfaceComponent,
    children: [
      {
        path: ':id',
        component: InterfaceAllComponent,
      },
      // {
      //   path: 'in003tx',
      //   component: In003txComponent,
      // }, {
      //   path: 'in06403tx',
      //   component: In06403txComponent,
      // },
      // {
      //   path: 'in06404tx',
      //   component: In06404txComponent,
      // },
      // {
      //   path: 'in07707tx',
      //   component: In07707txComponent,
      // },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InterfaceRoutingModule {}
