import { ICustomerAccount } from 'app/entities/customer-account/customer-account.model';

export interface ICustomer {
  id?: number;
  fullName?: string | null;
  address?: string | null;
  mobileNo?: string | null;
  customerAccounts?: ICustomerAccount[] | null;
}

export class Customer implements ICustomer {
  constructor(
    public id?: number,
    public fullName?: string | null,
    public address?: string | null,
    public mobileNo?: string | null,
    public customerAccounts?: ICustomerAccount[] | null
  ) {}
}

export function getCustomerIdentifier(customer: ICustomer): number | undefined {
  return customer.id;
}
