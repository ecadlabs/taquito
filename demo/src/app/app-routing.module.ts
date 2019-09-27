import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContractStateComponent } from './pages/contract-state/contract-state.component';
import { ContractStateModule } from './pages/contract-state/contract-state.module';
import { NewContractComponent } from './pages/new-contract/new-contract.component';
import { NewContractModule } from './pages/new-contract/new-contract.module';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { PageNotFoundModule } from './pages/page-not-found/page-not-found.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'new-contract',
    pathMatch: 'full',
  },
  {
    path: 'new-contract',
    component: NewContractComponent,
  },
  {
    path: ':contract',
    component: ContractStateComponent,
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [
    NewContractModule,
    ContractStateModule,
    PageNotFoundModule,
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
