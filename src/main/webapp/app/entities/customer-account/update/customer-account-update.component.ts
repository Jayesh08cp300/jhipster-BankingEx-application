import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICustomerAccount, CustomerAccount } from '../customer-account.model';
import { CustomerAccountService } from '../service/customer-account.service';
import { IBank } from 'app/entities/bank/bank.model';
import { BankService } from 'app/entities/bank/service/bank.service';
import { ICustomer } from 'app/entities/customer/customer.model';
import { CustomerService } from 'app/entities/customer/service/customer.service';

@Component({
  selector: 'jhi-customer-account-update',
  templateUrl: './customer-account-update.component.html',
})
export class CustomerAccountUpdateComponent implements OnInit {
  isSaving = false;

  banksSharedCollection: IBank[] = [];
  customersSharedCollection: ICustomer[] = [];

  editForm = this.fb.group({
    id: [],
    accountNo: [],
    balance: [],
    bank: [],
    customer: [],
  });

  constructor(
    protected customerAccountService: CustomerAccountService,
    protected bankService: BankService,
    protected customerService: CustomerService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ customerAccount }) => {
      this.updateForm(customerAccount);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const customerAccount = this.createFromForm();
    if (customerAccount.id !== undefined) {
      this.subscribeToSaveResponse(this.customerAccountService.update(customerAccount));
    } else {
      this.subscribeToSaveResponse(this.customerAccountService.create(customerAccount));
    }
  }

  trackBankById(_index: number, item: IBank): number {
    return item.id!;
  }

  trackCustomerById(_index: number, item: ICustomer): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICustomerAccount>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(customerAccount: ICustomerAccount): void {
    this.editForm.patchValue({
      id: customerAccount.id,
      accountNo: customerAccount.accountNo,
      balance: customerAccount.balance,
      bank: customerAccount.bank,
      customer: customerAccount.customer,
    });

    this.banksSharedCollection = this.bankService.addBankToCollectionIfMissing(this.banksSharedCollection, customerAccount.bank);
    this.customersSharedCollection = this.customerService.addCustomerToCollectionIfMissing(
      this.customersSharedCollection,
      customerAccount.customer
    );
  }

  protected loadRelationshipsOptions(): void {
    this.bankService
      .query()
      .pipe(map((res: HttpResponse<IBank[]>) => res.body ?? []))
      .pipe(map((banks: IBank[]) => this.bankService.addBankToCollectionIfMissing(banks, this.editForm.get('bank')!.value)))
      .subscribe((banks: IBank[]) => (this.banksSharedCollection = banks));

    this.customerService
      .query()
      .pipe(map((res: HttpResponse<ICustomer[]>) => res.body ?? []))
      .pipe(
        map((customers: ICustomer[]) =>
          this.customerService.addCustomerToCollectionIfMissing(customers, this.editForm.get('customer')!.value)
        )
      )
      .subscribe((customers: ICustomer[]) => (this.customersSharedCollection = customers));
  }

  protected createFromForm(): ICustomerAccount {
    return {
      ...new CustomerAccount(),
      id: this.editForm.get(['id'])!.value,
      accountNo: this.editForm.get(['accountNo'])!.value,
      balance: this.editForm.get(['balance'])!.value,
      bank: this.editForm.get(['bank'])!.value,
      customer: this.editForm.get(['customer'])!.value,
    };
  }
}
