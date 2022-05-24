import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICustomerAccount, CustomerAccount } from '../customer-account.model';

import { CustomerAccountService } from './customer-account.service';

describe('CustomerAccount Service', () => {
  let service: CustomerAccountService;
  let httpMock: HttpTestingController;
  let elemDefault: ICustomerAccount;
  let expectedResult: ICustomerAccount | ICustomerAccount[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CustomerAccountService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      accountNo: 'AAAAAAA',
      balance: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a CustomerAccount', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new CustomerAccount()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CustomerAccount', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          accountNo: 'BBBBBB',
          balance: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CustomerAccount', () => {
      const patchObject = Object.assign(
        {
          accountNo: 'BBBBBB',
          balance: 1,
        },
        new CustomerAccount()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CustomerAccount', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          accountNo: 'BBBBBB',
          balance: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a CustomerAccount', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addCustomerAccountToCollectionIfMissing', () => {
      it('should add a CustomerAccount to an empty array', () => {
        const customerAccount: ICustomerAccount = { id: 123 };
        expectedResult = service.addCustomerAccountToCollectionIfMissing([], customerAccount);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(customerAccount);
      });

      it('should not add a CustomerAccount to an array that contains it', () => {
        const customerAccount: ICustomerAccount = { id: 123 };
        const customerAccountCollection: ICustomerAccount[] = [
          {
            ...customerAccount,
          },
          { id: 456 },
        ];
        expectedResult = service.addCustomerAccountToCollectionIfMissing(customerAccountCollection, customerAccount);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CustomerAccount to an array that doesn't contain it", () => {
        const customerAccount: ICustomerAccount = { id: 123 };
        const customerAccountCollection: ICustomerAccount[] = [{ id: 456 }];
        expectedResult = service.addCustomerAccountToCollectionIfMissing(customerAccountCollection, customerAccount);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(customerAccount);
      });

      it('should add only unique CustomerAccount to an array', () => {
        const customerAccountArray: ICustomerAccount[] = [{ id: 123 }, { id: 456 }, { id: 39700 }];
        const customerAccountCollection: ICustomerAccount[] = [{ id: 123 }];
        expectedResult = service.addCustomerAccountToCollectionIfMissing(customerAccountCollection, ...customerAccountArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const customerAccount: ICustomerAccount = { id: 123 };
        const customerAccount2: ICustomerAccount = { id: 456 };
        expectedResult = service.addCustomerAccountToCollectionIfMissing([], customerAccount, customerAccount2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(customerAccount);
        expect(expectedResult).toContain(customerAccount2);
      });

      it('should accept null and undefined values', () => {
        const customerAccount: ICustomerAccount = { id: 123 };
        expectedResult = service.addCustomerAccountToCollectionIfMissing([], null, customerAccount, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(customerAccount);
      });

      it('should return initial array if no CustomerAccount is added', () => {
        const customerAccountCollection: ICustomerAccount[] = [{ id: 123 }];
        expectedResult = service.addCustomerAccountToCollectionIfMissing(customerAccountCollection, undefined, null);
        expect(expectedResult).toEqual(customerAccountCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
