import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  private transactionRepository: TransactionsRepository;

  constructor(transactionRepository: TransactionsRepository) {
    this.transactionRepository = transactionRepository;
  }

  public async execute(id: number): Promise<void> {
    await this.transactionRepository.delete(id);
  }
}

export default DeleteTransactionService;
