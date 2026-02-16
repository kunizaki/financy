import { Field, InputType } from 'type-graphql'
import { IsHexColor, IsOptional, MinLength } from 'class-validator'

@InputType()
export class CreateCategoryInput {
    @Field(() => String)
    @MinLength(5, { message: 'O título deve ter no mínimo 5 caracteres' })
    title!: string

    @Field(() => String, { nullable: true })
    @IsOptional()
    description?: string

    @Field(() => String)
    @MinLength(1, { message: 'Ícone é obrigatório' })
    icon!: string

    @Field(() => String)
    @IsHexColor({ message: 'Cor deve estar em formato hexadecimal (#RRGGBB)' })
    color!: string
}

@InputType()
export class UpdateCategoryInput {
    @Field(() => String)
    @MinLength(5, { message: 'O título deve ter no mínimo 5 caracteres' })
    title!: string

    @Field(() => String, { nullable: true })
    @IsOptional()
    description?: string

    @Field(() => String)
    @MinLength(1, { message: 'Ícone é obrigatório' })
    icon!: string

    @Field(() => String)
    @IsHexColor({ message: 'Cor deve estar em formato hexadecimal (#RRGGBB)' })
    color!: string
}