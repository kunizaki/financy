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
import { CategoryService } from '../services/category.service'
import {
  CreateTransactionInput,
  ListTransactionInput,
  UpdateTransactionInput,
} from '../dtos/input/transaction.input'
import { TransactionListOutput } from '../dtos/output/transaction.output'
import { GqlUser } from '../graphql/decorators/user.decorator'
import { UserModel } from '../models/user.model'
import { CategoryModel } from '../models/category.model'

@Resolver(() => TransactionModel)
@UseMiddleware(IsAuth)
export class TransactionResolver {
  private transactionService = new TransactionService()
  private categoryService = new CategoryService()

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

  @FieldResolver(() => CategoryModel, { nullable: true })
  async category(
    @Root() transaction: TransactionModel,
    @GqlUser() user: UserModel,
  ): Promise<CategoryModel | null> {
    if (!transaction.categoryId) return null
    return this.categoryService.findCategory(transaction.categoryId, user.id)
  }

  @FieldResolver(() => Number)
  async transactionsCount(
    @Root() transaction: TransactionModel,
    @GqlUser() user: UserModel,
  ): Promise<number> {
    if (!transaction.categoryId) return 0
    return this.transactionService.countTransactionsByCategory(
      transaction.categoryId,
      user.id,
    )
  }
}
