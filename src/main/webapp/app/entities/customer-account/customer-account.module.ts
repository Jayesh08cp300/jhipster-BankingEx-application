import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CustomerAccountComponent } from './list/customer-account.component';
import { CustomerAccountDetailComponent } from './detail/customer-account-detail.component';
import { CustomerAccountUpdateComponent } from './update/customer-account-update.component';
import { CustomerAccountDeleteDialogComponent } from './delete/customer-account-delete-dialog.component';
import { CustomerAccountRoutingModule } from './route/customer-account-routing.module';

@NgModule({
  imports: [SharedModule, CustomerAccountRoutingModule],
  declarations: [
    CustomerAccountComponent,
    CustomerAccountDetailComponent,
    CustomerAccountUpdateComponent,
    CustomerAccountDeleteDialogComponent,
  ],
  entryComponents: [CustomerAccountDeleteDialogComponent],
})
export class CustomerAccountModule {}
