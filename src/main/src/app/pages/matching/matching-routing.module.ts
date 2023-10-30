import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Mat001txComponent } from './mat001tx/mat001tx.component';
import { MatchingComponent } from './matching.component';

const routes: Routes = [
  {
    path: '',
    component: MatchingComponent,
    children: [
      {
        path: 'mat001tx',
        component: Mat001txComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MatchingRoutingModule {}
