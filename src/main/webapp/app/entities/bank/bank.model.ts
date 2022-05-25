import { ICustomerAccount } from 'app/entities/customer-account/customer-account.model';

export interface IBank {
  id?: number;
  bankName?: string | null;
  transactionCharge?: number | null;
  customerAccounts?: ICustomerAccount[] | null;
}

export class Bank implements IBank {
  constructor(
    public id?: number,
    public bankName?: string | null,
    public transactionCharge?: number | null,
    public customerAccounts?: ICustomerAccount[] | null
  ) {}
}

export function getBankIdentifier(bank: IBank): number | undefined {
  return bank.id;
}
