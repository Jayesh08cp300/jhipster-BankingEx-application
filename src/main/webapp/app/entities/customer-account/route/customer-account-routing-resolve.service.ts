import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICustomerAccount, CustomerAccount } from '../customer-account.model';
import { CustomerAccountService } from '../service/customer-account.service';

@Injectable({ providedIn: 'root' })
export class CustomerAccountRoutingResolveService implements Resolve<ICustomerAccount> {
  constructor(protected service: CustomerAccountService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICustomerAccount> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((customerAccount: HttpResponse<CustomerAccount>) => {
          if (customerAccount.body) {
            return of(customerAccount.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new CustomerAccount());
  }
}
