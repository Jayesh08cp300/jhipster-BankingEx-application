import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CustomerAccountService } from '../service/customer-account.service';
import { ICustomerAccount, CustomerAccount } from '../customer-account.model';
import { IBank } from 'app/entities/bank/bank.model';
import { BankService } from 'app/entities/bank/service/bank.service';
import { ICustomer } from 'app/entities/customer/customer.model';
import { CustomerService } from 'app/entities/customer/service/customer.service';

import { CustomerAccountUpdateComponent } from './customer-account-update.component';

describe('CustomerAccount Management Update Component', () => {
  let comp: CustomerAccountUpdateComponent;
  let fixture: ComponentFixture<CustomerAccountUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let customerAccountService: CustomerAccountService;
  let bankService: BankService;
  let customerService: CustomerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CustomerAccountUpdateComponent],
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
      .overrideTemplate(CustomerAccountUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CustomerAccountUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    customerAccountService = TestBed.inject(CustomerAccountService);
    bankService = TestBed.inject(BankService);
    customerService = TestBed.inject(CustomerService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Bank query and add missing value', () => {
      const customerAccount: ICustomerAccount = { id: 456 };
      const bank: IBank = { id: 60584 };
      customerAccount.bank = bank;

      const bankCollection: IBank[] = [{ id: 85282 }];
      jest.spyOn(bankService, 'query').mockReturnValue(of(new HttpResponse({ body: bankCollection })));
      const additionalBanks = [bank];
      const expectedCollection: IBank[] = [...additionalBanks, ...bankCollection];
      jest.spyOn(bankService, 'addBankToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ customerAccount });
      comp.ngOnInit();

      expect(bankService.query).toHaveBeenCalled();
      expect(bankService.addBankToCollectionIfMissing).toHaveBeenCalledWith(bankCollection, ...additionalBanks);
      expect(comp.banksSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Customer query and add missing value', () => {
      const customerAccount: ICustomerAccount = { id: 456 };
      const customer: ICustomer = { id: 33674 };
      customerAccount.customer = customer;

      const customerCollection: ICustomer[] = [{ id: 1909 }];
      jest.spyOn(customerService, 'query').mockReturnValue(of(new HttpResponse({ body: customerCollection })));
      const additionalCustomers = [customer];
      const expectedCollection: ICustomer[] = [...additionalCustomers, ...customerCollection];
      jest.spyOn(customerService, 'addCustomerToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ customerAccount });
      comp.ngOnInit();

      expect(customerService.query).toHaveBeenCalled();
      expect(customerService.addCustomerToCollectionIfMissing).toHaveBeenCalledWith(customerCollection, ...additionalCustomers);
      expect(comp.customersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const customerAccount: ICustomerAccount = { id: 456 };
      const bank: IBank = { id: 1689 };
      customerAccount.bank = bank;
      const customer: ICustomer = { id: 32489 };
      customerAccount.customer = customer;

      activatedRoute.data = of({ customerAccount });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(customerAccount));
      expect(comp.banksSharedCollection).toContain(bank);
      expect(comp.customersSharedCollection).toContain(customer);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<CustomerAccount>>();
      const customerAccount = { id: 123 };
      jest.spyOn(customerAccountService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ customerAccount });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: customerAccount }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(customerAccountService.update).toHaveBeenCalledWith(customerAccount);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<CustomerAccount>>();
      const customerAccount = new CustomerAccount();
      jest.spyOn(customerAccountService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ customerAccount });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: customerAccount }));
      saveSubject.complete();

      // THEN
      expect(customerAccountService.create).toHaveBeenCalledWith(customerAccount);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<CustomerAccount>>();
      const customerAccount = { id: 123 };
      jest.spyOn(customerAccountService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ customerAccount });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(customerAccountService.update).toHaveBeenCalledWith(customerAccount);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackBankById', () => {
      it('Should return tracked Bank primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackBankById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackCustomerById', () => {
      it('Should return tracked Customer primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackCustomerById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
