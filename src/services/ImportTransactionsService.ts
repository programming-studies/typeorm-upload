import fs from 'fs';
import parse from 'csv-parse/lib/sync';
import Transaction from '../models/Transaction';
import CreateTransactionService, {
  RequestDto,
} from './CreateTransactionService';

class ImportTransactionsService {
  private createTransactionService: CreateTransactionService;

  constructor(createTransactionService: CreateTransactionService) {
    this.createTransactionService = createTransactionService;
  }

  async execute(filepath: string): Promise<Transaction[]> {
    const transactions: Transaction[] = [];
    const input = fs.readFileSync(filepath);
    const records: RequestDto[] = parse(input, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    await records.reduce(async (promise, data) => {
      await promise;
      transactions.push(await this.createTransactionService.execute(data));
    }, Promise.resolve());

    const csvFileExists = await fs.promises.stat(filepath);
    if (csvFileExists) {
      await fs.promises.unlink(filepath);
    }

    return transactions;
  }
}

export default ImportTransactionsService;
