import {
  Arg,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql'
import { IsAuth } from '../middlewares/auth.middleware'
import { TransactionModel } from '../models/transaction.model'
import { TransactionService } from '../services/transaction.service'
import {
  CreateTransactionInput,
  UpdateTransactionInput,
  ListTransactionInput,
} from '../dtos/input/transaction.input'
import { TransactionListOutput } from '../dtos/output/transaction.output'
import { GqlUser } from '../graphql/decorators/user.decorator'
import { UserModel } from '../models/user.model'

@Resolver(() => TransactionModel)
@UseMiddleware(IsAuth)
export class TransactionResolver {
  private transactionService = new TransactionService()

  @Mutation(() => TransactionModel)
  async createTransaction(
    @Arg('data', () => CreateTransactionInput) data: CreateTransactionInput,
    @GqlUser() user: UserModel,
  ): Promise<TransactionModel> {
    return this.transactionService.createTransaction(data, user.id)
  }

  @Mutation(() => TransactionModel)
  async updateTransaction(
    @Arg('id', () => String) id: string,
    @GqlUser() user: UserModel,
    @Arg('data', () => UpdateTransactionInput) data: UpdateTransactionInput,
  ): Promise<TransactionModel> {
    return this.transactionService.updateTransaction(id, user.id, data)
  }

  @Mutation(() => Boolean)
  async deleteTransaction(
    @Arg('id', () => String) id: string,
    @GqlUser() user: UserModel,
  ): Promise<boolean> {
    return this.transactionService.deleteTransaction(id, user.id)
  }

  @Query(() => TransactionModel)
  async getTransaction(
    @Arg('id', () => String) id: string,
    @GqlUser() user: UserModel,
  ): Promise<TransactionModel> {
    return this.transactionService.findTransaction(id, user.id)
  }

  @Query(() => TransactionListOutput)
  async listTransactions(
    @GqlUser() user: UserModel,
    @Arg('data', () => ListTransactionInput, { nullable: true })
    data?: ListTransactionInput,
  ): Promise<TransactionListOutput> {
    return this.transactionService.listTransactions(data || {}, user.id)
  }

  @Query(() => Number)
  async getTotalAmount(@GqlUser() user: UserModel): Promise<number> {
    return this.transactionService.getTotalAmount(user.id)
  }

  @FieldResolver(() => Number)
  async transactionsCount(
    @Root() transaction: TransactionModel,
    @GqlUser() user: UserModel,
  ): Promise<number> {
    return this.transactionService.countTransactionsByCategory(
      transaction.categoryId,
      user.id,
    )
  }
}
