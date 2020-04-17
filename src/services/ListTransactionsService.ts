import Transaction from '../models/Transaction';
import TransactionsRepository, {
  Balance,
} from '../repositories/TransactionsRepository';

interface TransactionsDto {
  transactions: Transaction[];
  balance: Balance;
}
export default class ListTransactionService {
  private transactionRepository: TransactionsRepository;

  constructor(transactionRepository: TransactionsRepository) {
    this.transactionRepository = transactionRepository;
  }

  public async execute(): Promise<TransactionsDto> {
    return {
      transactions: await this.transactionRepository.find(),
      balance: await this.transactionRepository.getBalance(),
    };
  }
}
