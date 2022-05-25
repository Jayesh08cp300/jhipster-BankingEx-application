import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IBank, Bank } from '../bank.model';
import { BankService } from '../service/bank.service';

@Component({
  selector: 'jhi-bank-update',
  templateUrl: './bank-update.component.html',
})
export class BankUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    bankName: [],
    transactionCharge: [],
  });

  constructor(protected bankService: BankService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bank }) => {
      this.updateForm(bank);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const bank = this.createFromForm();
    if (bank.id !== undefined) {
      this.subscribeToSaveResponse(this.bankService.update(bank));
    } else {
      this.subscribeToSaveResponse(this.bankService.create(bank));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBank>>): void {
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

  protected updateForm(bank: IBank): void {
    this.editForm.patchValue({
      id: bank.id,
      bankName: bank.bankName,
      transactionCharge: bank.transactionCharge,
    });
  }

  protected createFromForm(): IBank {
    return {
      ...new Bank(),
      id: this.editForm.get(['id'])!.value,
      bankName: this.editForm.get(['bankName'])!.value,
      transactionCharge: this.editForm.get(['transactionCharge'])!.value,
    };
  }
}
