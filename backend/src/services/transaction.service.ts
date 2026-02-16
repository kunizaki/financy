import { prismaClient } from '../lib/prisma/prisma'
import {
  CreateTransactionInput,
  ListTransactionInput,
  UpdateTransactionInput,
} from '../dtos/input/transaction.input'
import { TransactionType } from '../models/transaction.model'
import { GraphQLError } from 'graphql'

export class TransactionService {
  private periodToYearMonthPrefix(period: string): string {
    const match = period.trim().match(/^(\d{2})\/(\d{4})$/)
    if (!match)
      throw new GraphQLError('Período inválido. Use MM/YYYY (ex.: 11/2025).', {
        extensions: { code: 'BAD_USER_INPUT' },
      })

    const month = Number(match[1]) // 1..12
    const year = Number(match[2])

    if (!Number.isInteger(month) || month < 1 || month > 12) {
      throw new GraphQLError('Mês inválido no período. Use 01 a 12.', {
        extensions: { code: 'BAD_USER_INPUT' },
      })
    }

    const mm = String(month).padStart(2, '0')
    return `${year}-${mm}` // prefixo ISO (YYYY-MM)
  }

  async listTransactions(data: ListTransactionInput, userId: string) {
    const { description, transactionType, categoryId, period } = data

    const where: Record<string, unknown> = {
      userId,
      ...(description ? { description: { contains: description } } : {}),
      ...(transactionType ? { transactionType } : {}),
      ...(categoryId ? { categoryId } : {}),
    }

    let periodSelected = new Date().toISOString().slice(0, 7)
    if (period) {
      periodSelected = this.periodToYearMonthPrefix(period)
    }
    where.date = { startsWith: periodSelected }

    const transactionsFound = await prismaClient.transaction.findMany({ where })

    const totalCreditFound = transactionsFound
      .filter((t) => t.transactionType === TransactionType.credit)
      .reduce((acc, t) => acc + t.value, 0)
    const totalDebitFound = transactionsFound
      .filter((t) => t.transactionType === TransactionType.debit)
      .reduce((acc, t) => acc + t.value, 0)
    return {
      transactions: transactionsFound,
      totalCredit: totalCreditFound,
      totalDebit: totalDebitFound,
    }
  }

  async createTransaction(data: CreateTransactionInput, userId: string) {
    return prismaClient.transaction.create({
      data: {
        userId,
        description: data.description,
        transactionType: data.transactionType,
        date: data.date,
        value: data.value,
        categoryId: data.categoryId,
      },
    })
  }

  async findTransaction(id: string, userId: string) {
    const transactionFound = await prismaClient.transaction.findUnique({
      where: {
        id,
        userId,
      },
    })
    if (!transactionFound)
      throw new GraphQLError('Transação não existe', {
        extensions: { code: 'NOT_FOUND' },
      })
    return transactionFound
  }

  async updateTransaction(
    id: string,
    userId: string,
    data: UpdateTransactionInput,
  ) {
    const transactionFound = await prismaClient.transaction.findUnique({
      where: { id, userId },
    })
    if (!transactionFound)
      throw new GraphQLError('Transação não existe', {
        extensions: { code: 'NOT_FOUND' },
      })

    return prismaClient.transaction.update({
      where: { id },
      data: {
        description: data.description,
        transactionType: data.transactionType,
        date: data.date,
        value: data.value,
        categoryId: data.categoryId,
      },
    })
  }

  async deleteTransaction(id: string, userId: string) {
    const transactionFound = await prismaClient.transaction.findUnique({
      where: { id, userId },
    })
    if (!transactionFound)
      throw new GraphQLError('Transação não existe', {
        extensions: { code: 'NOT_FOUND' },
      })

    await prismaClient.transaction.delete({
      where: { id },
    })

    return true
  }

  async getTotalAmount(userId: string) {
    const totalCreditAmount = await prismaClient.transaction.aggregate({
      _sum: {
        value: true,
      },
      where: {
        userId,
        transactionType: TransactionType.credit,
      },
    })

    const totalDebitAmount = await prismaClient.transaction.aggregate({
      _sum: {
        value: true,
      },
      where: {
        userId,
        transactionType: TransactionType.debit,
      },
    })

    const credit = totalCreditAmount._sum.value ?? 0
    const debit = totalDebitAmount._sum.value ?? 0

    return credit - debit
  }

  async countTransactionsByCategory(categoryId: string, userId: string) {
    return prismaClient.transaction.count({
      where: { categoryId, userId },
    })
  }
}
