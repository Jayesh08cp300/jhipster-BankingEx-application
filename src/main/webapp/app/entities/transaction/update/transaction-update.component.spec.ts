import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TransactionService } from '../service/transaction.service';
import { ITransaction, Transaction } from '../transaction.model';
import { ICustomerAccount } from 'app/entities/customer-account/customer-account.model';
import { CustomerAccountService } from 'app/entities/customer-account/service/customer-account.service';

import { TransactionUpdateComponent } from './transaction-update.component';

describe('Transaction Management Update Component', () => {
  let comp: TransactionUpdateComponent;
  let fixture: ComponentFixture<TransactionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let transactionService: TransactionService;
  let customerAccountService: CustomerAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TransactionUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(TransactionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TransactionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    transactionService = TestBed.inject(TransactionService);
    customerAccountService = TestBed.inject(CustomerAccountService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call CustomerAccount query and add missing value', () => {
      const transaction: ITransaction = { id: 456 };
      const customerAccount: ICustomerAccount = { id: 76495 };
      transaction.customerAccount = customerAccount;

      const customerAccountCollection: ICustomerAccount[] = [{ id: 5728 }];
      jest.spyOn(customerAccountService, 'query').mockReturnValue(of(new HttpResponse({ body: customerAccountCollection })));
      const additionalCustomerAccounts = [customerAccount];
      const expectedCollection: ICustomerAccount[] = [...additionalCustomerAccounts, ...customerAccountCollection];
      jest.spyOn(customerAccountService, 'addCustomerAccountToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ transaction });
      comp.ngOnInit();

      expect(customerAccountService.query).toHaveBeenCalled();
      expect(customerAccountService.addCustomerAccountToCollectionIfMissing).toHaveBeenCalledWith(
        customerAccountCollection,
        ...additionalCustomerAccounts
      );
      expect(comp.customerAccountsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const transaction: ITransaction = { id: 456 };
      const customerAccount: ICustomerAccount = { id: 36040 };
      transaction.customerAccount = customerAccount;

      activatedRoute.data = of({ transaction });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(transaction));
      expect(comp.customerAccountsSharedCollection).toContain(customerAccount);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Transaction>>();
      const transaction = { id: 123 };
      jest.spyOn(transactionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ transaction });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: transaction }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(transactionService.update).toHaveBeenCalledWith(transaction);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Transaction>>();
      const transaction = new Transaction();
      jest.spyOn(transactionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ transaction });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: transaction }));
      saveSubject.complete();

      // THEN
      expect(transactionService.create).toHaveBeenCalledWith(transaction);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Transaction>>();
      const transaction = { id: 123 };
      jest.spyOn(transactionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ transaction });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(transactionService.update).toHaveBeenCalledWith(transaction);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackCustomerAccountById', () => {
      it('Should return tracked CustomerAccount primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackCustomerAccountById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
