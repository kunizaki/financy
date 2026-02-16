import { Field, InputType } from 'type-graphql'
import { IsEmail, IsOptional, MinLength } from 'class-validator'
import { Role } from '../../models/user.model'

@InputType()
export class UpdateUserInput {
    @Field(() => String, { nullable: true })
    @IsOptional()
    @MinLength(10, { message: 'O nome deve ter no mínimo 10 caracteres' })
    name?: string

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsEmail({}, { message: 'E-mail inválido' })
    email?: string

    @Field(() => String, { nullable: true })
    @IsOptional()
    @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
    password?: string
}