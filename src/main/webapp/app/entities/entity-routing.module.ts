import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'bank',
        data: { pageTitle: 'bankingExApp.bank.home.title' },
        loadChildren: () => import('./bank/bank.module').then(m => m.BankModule),
      },
      {
        path: 'customer-account',
        data: { pageTitle: 'bankingExApp.customerAccount.home.title' },
        loadChildren: () => import('./customer-account/customer-account.module').then(m => m.CustomerAccountModule),
      },
      {
        path: 'customer',
        data: { pageTitle: 'bankingExApp.customer.home.title' },
        loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule),
      },
      {
        path: 'transaction',
        data: { pageTitle: 'bankingExApp.transaction.home.title' },
        loadChildren: () => import('./transaction/transaction.module').then(m => m.TransactionModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
