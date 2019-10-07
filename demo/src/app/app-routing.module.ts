import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Network } from './models/network.model';
import { ContractDetailsComponent } from './pages/contract-details/contract-details.component';
import { ContractDetailsModule } from './pages/contract-details/contract-details.module';
import { HomeComponent } from './pages/home/home.component';
import { HomeModule } from './pages/home/home.module';
import { NewContractComponent } from './pages/new-contract/new-contract.component';
import { NewContractModule } from './pages/new-contract/new-contract.module';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { PageNotFoundModule } from './pages/page-not-found/page-not-found.module';
import { SelectKeyComponent } from './pages/select-key/select-key.component';
import { SelectKeyModule } from './pages/select-key/select-key.module';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'signing',
    component: SelectKeyComponent,
  },
  {
    path: 'new',
    component: NewContractComponent,
  },
  {
    path: 'alphanet/:contract',
    data: { network: Network.Alphanet },
    component: ContractDetailsComponent,
  },
  {
    path: 'mainnet/:contract',
    data: { network: Network.Mainnet },
    component: ContractDetailsComponent,
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [
    HomeModule,
    SelectKeyModule,
    NewContractModule,
    ContractDetailsModule,
    PageNotFoundModule,
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
