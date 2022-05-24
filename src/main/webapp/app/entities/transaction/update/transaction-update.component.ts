import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ITransaction, Transaction } from '../transaction.model';
import { TransactionService } from '../service/transaction.service';
import { ICustomerAccount } from 'app/entities/customer-account/customer-account.model';
import { CustomerAccountService } from 'app/entities/customer-account/service/customer-account.service';

@Component({
  selector: 'jhi-transaction-update',
  templateUrl: './transaction-update.component.html',
})
export class TransactionUpdateComponent implements OnInit {
  isSaving = false;

  customerAccountsSharedCollection: ICustomerAccount[] = [];

  editForm = this.fb.group({
    id: [],
    amount: [],
    customerAccount: [],
  });

  constructor(
    protected transactionService: TransactionService,
    protected customerAccountService: CustomerAccountService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ transaction }) => {
      this.updateForm(transaction);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const transaction = this.createFromForm();
    if (transaction.id !== undefined) {
      this.subscribeToSaveResponse(this.transactionService.update(transaction));
    } else {
      this.subscribeToSaveResponse(this.transactionService.create(transaction));
    }
  }

  trackCustomerAccountById(_index: number, item: ICustomerAccount): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITransaction>>): void {
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

  protected updateForm(transaction: ITransaction): void {
    this.editForm.patchValue({
      id: transaction.id,
      amount: transaction.amount,
      customerAccount: transaction.customerAccount,
    });

    this.customerAccountsSharedCollection = this.customerAccountService.addCustomerAccountToCollectionIfMissing(
      this.customerAccountsSharedCollection,
      transaction.customerAccount
    );
  }

  protected loadRelationshipsOptions(): void {
    this.customerAccountService
      .query()
      .pipe(map((res: HttpResponse<ICustomerAccount[]>) => res.body ?? []))
      .pipe(
        map((customerAccounts: ICustomerAccount[]) =>
          this.customerAccountService.addCustomerAccountToCollectionIfMissing(customerAccounts, this.editForm.get('customerAccount')!.value)
        )
      )
      .subscribe((customerAccounts: ICustomerAccount[]) => (this.customerAccountsSharedCollection = customerAccounts));
  }

  protected createFromForm(): ITransaction {
    return {
      ...new Transaction(),
      id: this.editForm.get(['id'])!.value,
      amount: this.editForm.get(['amount'])!.value,
      customerAccount: this.editForm.get(['customerAccount'])!.value,
    };
  }
}
