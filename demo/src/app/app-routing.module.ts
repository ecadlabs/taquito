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

const routes: Routes = [
  ...Network.values().map(network => ({
    path: `${network}/:contract`,
    component: ContractDetailsComponent,
    data: { network: network },
  })),
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'new',
    component: NewContractComponent,
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [
    HomeModule,
    NewContractModule,
    ContractDetailsModule,
    PageNotFoundModule,
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
