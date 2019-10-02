import { NgModule } from '@angular/core';
import { RouterModule, Routes, UrlMatchResult, UrlSegment } from '@angular/router';

import { ContractStateComponent } from './pages/contract-state/contract-state.component';
import { ContractStateModule } from './pages/contract-state/contract-state.module';
import { NetworkSelectComponent } from './pages/network-select/network-select.component';
import { NetworkSelectModule } from './pages/network-select/network-select.module';
import { NewContractComponent } from './pages/new-contract/new-contract.component';
import { NewContractModule } from './pages/new-contract/new-contract.module';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { PageNotFoundModule } from './pages/page-not-found/page-not-found.module';

function networkMatcher(url: UrlSegment[]): UrlMatchResult {
  return url.length > 0 && ['alphanet', 'mainnet'].indexOf(url[0].path) > -1
    ? { consumed: [url[0]], posParams: { network: url[0] } }
    : null;
}

const routes: Routes = [
  {
    matcher: networkMatcher,
    component: NetworkSelectComponent,
    children: [
      {
        path: '',
        component: PageNotFoundComponent,
      },
      {
        path: 'contracts/new',
        component: NewContractComponent,
      },
      {
        path: 'contracts/:contract',
        component: ContractStateComponent,
      },
    ],
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [
    NetworkSelectModule,
    NewContractModule,
    ContractStateModule,
    PageNotFoundModule,
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
