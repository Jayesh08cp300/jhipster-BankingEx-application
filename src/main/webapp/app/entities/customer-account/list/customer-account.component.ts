import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICustomerAccount } from '../customer-account.model';
import { CustomerAccountService } from '../service/customer-account.service';
import { CustomerAccountDeleteDialogComponent } from '../delete/customer-account-delete-dialog.component';

@Component({
  selector: 'jhi-customer-account',
  templateUrl: './customer-account.component.html',
})
export class CustomerAccountComponent implements OnInit {
  customerAccounts?: ICustomerAccount[];
  isLoading = false;

  constructor(protected customerAccountService: CustomerAccountService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.customerAccountService.query().subscribe({
      next: (res: HttpResponse<ICustomerAccount[]>) => {
        this.isLoading = false;
        this.customerAccounts = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: ICustomerAccount): number {
    return item.id!;
  }

  delete(customerAccount: ICustomerAccount): void {
    const modalRef = this.modalService.open(CustomerAccountDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.customerAccount = customerAccount;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
