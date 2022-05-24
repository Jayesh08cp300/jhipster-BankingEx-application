import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CustomerAccountComponent } from '../list/customer-account.component';
import { CustomerAccountDetailComponent } from '../detail/customer-account-detail.component';
import { CustomerAccountUpdateComponent } from '../update/customer-account-update.component';
import { CustomerAccountRoutingResolveService } from './customer-account-routing-resolve.service';

const customerAccountRoute: Routes = [
  {
    path: '',
    component: CustomerAccountComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CustomerAccountDetailComponent,
    resolve: {
      customerAccount: CustomerAccountRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CustomerAccountUpdateComponent,
    resolve: {
      customerAccount: CustomerAccountRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CustomerAccountUpdateComponent,
    resolve: {
      customerAccount: CustomerAccountRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(customerAccountRoute)],
  exports: [RouterModule],
})
export class CustomerAccountRoutingModule {}
