import { Field, GraphQLISODateTime, ID, ObjectType } from 'type-graphql'
import { TransactionModel } from './transaction.model'

@ObjectType()
export class CategoryModel {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  title!: string

  @Field(() => String, { nullable: true })
  description?: string

  @Field(() => String)
  icon!: string

  @Field(() => String)
  color!: string

  @Field(() => GraphQLISODateTime)
  createdAt!: Date

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date

  @Field(() => [TransactionModel], { nullable: true })
  transactions?: TransactionModel[]
}
