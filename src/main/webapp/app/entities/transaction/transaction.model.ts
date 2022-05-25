import { ICustomerAccount } from 'app/entities/customer-account/customer-account.model';

export interface ITransaction {
  id?: number;
  amount?: number | null;
  customerAccount?: ICustomerAccount | null;
}

export class Transaction implements ITransaction {
  constructor(public id?: number, public amount?: number | null, public customerAccount?: ICustomerAccount | null) {}
}

export function getTransactionIdentifier(transaction: ITransaction): number | undefined {
  return transaction.id;
}
