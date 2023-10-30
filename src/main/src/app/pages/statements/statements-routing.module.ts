import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmailConfigComponent } from './email-config/email-config.component';
import { EmailSetupComponent } from './email-setup/email-setup.component';
import { In079txComponent } from './in079tx/in079tx.component';
import { Rc001txComponent } from './rc001tx/rc001tx.component';
import { Rc002txComponent } from './rc002tx/rc002tx.component';
import { Rc003txComponent } from './rc003tx/rc003tx.component';
import { Rc004txComponent } from './rc004tx/rc004tx.component';
import { Rc005txComponent } from './rc005tx/rc005tx.component';
import { Rc006txComponent } from './rc006tx/rc006tx.component';
import { Rc007txComponent } from './rc007tx/rc007tx.component';
import { St001txComponent } from './st001tx/st001tx.component';
import { St002txComponent } from './st002tx/st002tx.component';
import { St003txComponent } from './st003tx/st003tx.component';
import { StatementsComponent } from './statements.component';

const routes: Routes = [
  {
    path: '',
    component: StatementsComponent,
    children: [
      {
        path: 'st001tx',
        component: St001txComponent,
        data: { role: 'user' },
      },
      {
        path: 'st001tx-admin',
        component: St001txComponent,
        data: { role: 'admin' },
      },
      {
        path: 'st002tx',
        component: St002txComponent,
      },
      {
        path: 'st003tx',
        component: St003txComponent,
      },
      {
        path: 'rc001tx/:id',
        component: Rc001txComponent,
      },
      {
        path: 'rc002tx/:id',
        component: Rc002txComponent,
      },
      {
        path: 'rc002tx',
        component: Rc002txComponent,
      },
      {
        path: 'rc003tx',
        component: Rc003txComponent,
      },
      {
        path: 'rc004tx/:buid/:cusId',
        component: Rc004txComponent,
      },
      {
        path: 'rc005tx',
        component: Rc005txComponent,
      },
      {
        path: 'rc006tx',
        component: Rc006txComponent,
      },
      {
        path: 'rc007tx',
        component: Rc007txComponent,
      },
      {
        path: 'emailSender',
        component: EmailConfigComponent,
      },
      {
        path: 'in079tx',
        component: In079txComponent,
      },
      {
        path: 'setupEmail',
        component: EmailSetupComponent,
      },
    ],
  },
  { path: '**', redirectTo: '/statements/' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatementsRoutingModule {}
