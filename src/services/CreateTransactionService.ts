import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Request): Transaction {
    if (typeof value !== 'number') {
      throw new Error('The value must be a number');
    }

    if (Math.sign(value) !== 1) {
      throw new Error('The value must be a positive number');
    }

    if (!['income', 'outcome'].includes(type)) {
      throw new Error('The type of the transaction is invalid');
    }

    const { total } = this.transactionsRepository.getBalance();

    if (type === 'outcome' && total < value) {
      throw new Error("You don't have enough balance");
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    return transaction;
  }
}

export default CreateTransactionService;
