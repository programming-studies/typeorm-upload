import { getRepository } from 'typeorm';
// import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';
import AppError from '../errors/AppError';

export interface RequestDto {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}
class CreateTransactionService {
  private transactionRepository: TransactionsRepository;

  constructor(transactionRepository: TransactionsRepository) {
    this.transactionRepository = transactionRepository;
  }

  public async execute({
    title,
    value,
    type,
    category: categoryTitle,
  }: RequestDto): Promise<Transaction> {
    if (type === 'outcome') {
      const { total } = await this.transactionRepository.getBalance();
      if (value > total) {
        throw new AppError(
          `The outcome value (${value}) can't be greater then income total (${total})`,
        );
      }
    }

    const categoryRepository = getRepository(Category);
    let category = await categoryRepository.findOne({
      where: { title: categoryTitle },
    });
    if (!category) {
      category = categoryRepository.create({ title: categoryTitle });
      await categoryRepository.save(category);
    }
    const transaction = this.transactionRepository.create({
      title,
      value,
      type,
      category_id: category.id,
    });
    await this.transactionRepository.save(transaction);
    const record = await this.transactionRepository.findOne(transaction.id);
    return record || ({} as Transaction);
  }
}

export default CreateTransactionService;
