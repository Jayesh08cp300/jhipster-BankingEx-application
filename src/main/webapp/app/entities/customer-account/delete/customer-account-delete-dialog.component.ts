import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICustomerAccount } from '../customer-account.model';
import { CustomerAccountService } from '../service/customer-account.service';

@Component({
  templateUrl: './customer-account-delete-dialog.component.html',
})
export class CustomerAccountDeleteDialogComponent {
  customerAccount?: ICustomerAccount;

  constructor(protected customerAccountService: CustomerAccountService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.customerAccountService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
