import { Field, InputType } from 'type-graphql'
import { IsEmail, MinLength } from 'class-validator'

@InputType()
export class RegisterInput {
  @Field(() => String)
  @MinLength(10, { message: 'O nome deve ter no mínimo 10 caracteres' })
  name!: string

  @Field(() => String)
  @IsEmail({}, { message: 'E-mail inválido' })
  email!: string

  @Field(() => String)
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  password!: string
}

@InputType()
export class LoginInput {
  @Field(() => String)
  @IsEmail({}, { message: 'E-mail inválido' })
  email!: string

  @Field(() => String)
  password!: string
}
