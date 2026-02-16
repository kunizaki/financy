import {Field, ObjectType} from "type-graphql";
import {Transaction} from "@prisma/client";
import {TransactionModel} from "../../models/transaction.model";

@ObjectType()
export class TransactionListOutput {
    @Field(() => [TransactionModel])
    transactions!: Transaction[]

    @Field(() => Number)
    totalCredit!: number

    @Field(() => Number)
    totalDebit!: number
}