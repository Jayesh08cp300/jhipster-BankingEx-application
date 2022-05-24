import { ITransaction } from 'app/entities/transaction/transaction.model';
import { IBank } from 'app/entities/bank/bank.model';
import { ICustomer } from 'app/entities/customer/customer.model';

export interface ICustomerAccount {
  id?: number;
  accountNo?: string | null;
  balance?: number | null;
  transactions?: ITransaction[] | null;
  bank?: IBank | null;
  customer?: ICustomer | null;
}

export class CustomerAccount implements ICustomerAccount {
  constructor(
    public id?: number,
    public accountNo?: string | null,
    public balance?: number | null,
    public transactions?: ITransaction[] | null,
    public bank?: IBank | null,
    public customer?: ICustomer | null
  ) {}
}

export function getCustomerAccountIdentifier(customerAccount: ICustomerAccount): number | undefined {
  return customerAccount.id;
}
