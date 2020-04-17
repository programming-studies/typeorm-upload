import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

export interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    let income = 0;
    let outcome = 0;
    (await this.find()).map(transaction => {
      const currentValue = parseFloat(transaction.value as any);
      income += transaction.type === 'income' ? currentValue : 0;
      outcome += transaction.type === 'outcome' ? currentValue : 0;
    });
    return { income, outcome, total: income - outcome };
  }
}

export default TransactionsRepository;
