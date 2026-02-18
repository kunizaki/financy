import {
  Field,
  GraphQLISODateTime,
  ID,
  ObjectType,
  registerEnumType,
} from 'type-graphql'
import { TransactionType } from '@prisma/client'
import { CategoryModel } from './category.model'

export { TransactionType }

registerEnumType(TransactionType, {
  name: 'TransactionType',
  description: 'Transaction type',
})

@ObjectType()
export class TransactionModel {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  userId!: string

  @Field(() => String, { nullable: true })
  description!: string

  @Field(() => TransactionType)
  transactionType!: TransactionType

  @Field(() => String)
  date!: string

  @Field(() => Number)
  value!: number

  @Field(() => String)
  categoryId!: string

  @Field(() => GraphQLISODateTime)
  createdAt!: Date

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date

  @Field(() => CategoryModel, { nullable: true })
  category?: CategoryModel
}
