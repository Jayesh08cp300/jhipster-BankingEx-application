import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICustomerAccount } from '../customer-account.model';

@Component({
  selector: 'jhi-customer-account-detail',
  templateUrl: './customer-account-detail.component.html',
})
export class CustomerAccountDetailComponent implements OnInit {
  customerAccount: ICustomerAccount | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ customerAccount }) => {
      this.customerAccount = customerAccount;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
