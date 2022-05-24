import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICustomerAccount, getCustomerAccountIdentifier } from '../customer-account.model';

export type EntityResponseType = HttpResponse<ICustomerAccount>;
export type EntityArrayResponseType = HttpResponse<ICustomerAccount[]>;

@Injectable({ providedIn: 'root' })
export class CustomerAccountService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/customer-accounts');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(customerAccount: ICustomerAccount): Observable<EntityResponseType> {
    return this.http.post<ICustomerAccount>(this.resourceUrl, customerAccount, { observe: 'response' });
  }

  update(customerAccount: ICustomerAccount): Observable<EntityResponseType> {
    return this.http.put<ICustomerAccount>(
      `${this.resourceUrl}/${getCustomerAccountIdentifier(customerAccount) as number}`,
      customerAccount,
      { observe: 'response' }
    );
  }

  partialUpdate(customerAccount: ICustomerAccount): Observable<EntityResponseType> {
    return this.http.patch<ICustomerAccount>(
      `${this.resourceUrl}/${getCustomerAccountIdentifier(customerAccount) as number}`,
      customerAccount,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICustomerAccount>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICustomerAccount[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCustomerAccountToCollectionIfMissing(
    customerAccountCollection: ICustomerAccount[],
    ...customerAccountsToCheck: (ICustomerAccount | null | undefined)[]
  ): ICustomerAccount[] {
    const customerAccounts: ICustomerAccount[] = customerAccountsToCheck.filter(isPresent);
    if (customerAccounts.length > 0) {
      const customerAccountCollectionIdentifiers = customerAccountCollection.map(
        customerAccountItem => getCustomerAccountIdentifier(customerAccountItem)!
      );
      const customerAccountsToAdd = customerAccounts.filter(customerAccountItem => {
        const customerAccountIdentifier = getCustomerAccountIdentifier(customerAccountItem);
        if (customerAccountIdentifier == null || customerAccountCollectionIdentifiers.includes(customerAccountIdentifier)) {
          return false;
        }
        customerAccountCollectionIdentifiers.push(customerAccountIdentifier);
        return true;
      });
      return [...customerAccountsToAdd, ...customerAccountCollection];
    }
    return customerAccountCollection;
  }
}
