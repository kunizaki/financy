import { Field, InputType } from 'type-graphql'
import { Matches, Min, MinLength, IsOptional, IsUUID } from 'class-validator'
import {TransactionType} from "../../models/transaction.model";

@InputType()
export class CreateTransactionInput {
    @Field(() => String)
    @MinLength(5, { message: 'Descrição deve ter no mínimo 5 caracteres' })
    description!: string

    @Field(() => TransactionType)
    transactionType!: TransactionType

    @Field(() => String)
    @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Data deve estar no formato YYYY-MM-DD' })
    date!: string

    @Field(() => Number)
    @Min(0, { message: 'O valor deve ser maior ou igual a 0' })
    value!: number

    @Field(() => String)
    categoryId!: string
}

@InputType()
export class UpdateTransactionInput {
    @Field(() => String)
    @MinLength(5, { message: 'Descrição deve ter no mínimo 5 caracteres' })
    description!: string

    @Field(() => TransactionType)
    transactionType!: TransactionType

    @Field(() => String)
    @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Data deve estar no formato YYYY-MM-DD' })
    date!: string

    @Field(() => Number)
    @Min(0, { message: 'O valor deve ser maior ou igual a 0' })
    value!: number

    @Field(() => String)
    categoryId!: string
}

@InputType()
export class ListTransactionInput {
    @Field(() => String, { nullable: true })
    @IsOptional()
    description?: string

    @Field(() => TransactionType, { nullable: true })
    @IsOptional()
    transactionType?: TransactionType

    @Field(() => String, { nullable: true })
    @IsOptional()
    categoryId?: string

    @Field(() => String, { nullable: true })
    @IsOptional()
    @Matches(/^\d{4}-\d{2}$/i, { message: 'O período deve estar no formato YYYY-MM' })
    period?: string
}