import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import ListTransactionService from '../services/ListTransactionsService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const upload = multer({ dest: 'tmp/' });
const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const listTransactionService = new ListTransactionService(
    transactionsRepository,
  );
  const transactions = await listTransactionService.execute();
  return response.json(transactions);
});

transactionsRouter.post('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const createTransactionService = new CreateTransactionService(
    transactionsRepository,
  );
  const { title, value, type, category } = request.body;
  const transaction = await createTransactionService.execute({
    title,
    value,
    type,
    category,
  });
  return response.status(201).json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const deleteTransactionService = new DeleteTransactionService(
    transactionsRepository,
  );
  const id = (request.params.id as unknown) as number;
  deleteTransactionService.execute(id);
  return response.status(204).json({});
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const importTransactionService = new ImportTransactionsService(
      new CreateTransactionService(getCustomRepository(TransactionsRepository)),
    );
    const transactions = await importTransactionService.execute(
      request.file.path,
    );
    return response.json(transactions);
  },
);

export default transactionsRouter;
