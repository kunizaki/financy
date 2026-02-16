import { UserModel } from '../models/user.model'
import { prismaClient } from '../lib/prisma/prisma'
import { LoginInput, RegisterInput } from '../dtos/input/auth.input'
import { comparePassword, hashPassword } from '../utils/hash'
import { signJwt } from '../utils/jwt'
import { GraphQLError } from 'graphql'

export class AuthService {
  async login(data: LoginInput) {
    const existingUser = await prismaClient.user.findUnique({
      where: {
        email: data.email,
      },
    })
    if (!existingUser)
      throw new GraphQLError('Usuário não cadastrado!', {
        extensions: { code: 'UNAUTHENTICATED' },
      })
    const compare = await comparePassword(data.password, existingUser.password)
    if (!compare)
      throw new GraphQLError('Senha inválida!', {
        extensions: { code: 'UNAUTHENTICATED' },
      })
    return this.gerenerateTokens(existingUser)
  }

  async register(data: RegisterInput) {
    const existingUser = await prismaClient.user.findUnique({
      where: {
        email: data.email,
      },
    })
    if (existingUser)
      throw new GraphQLError('E-mail já cadastrado!', {
        extensions: { code: 'CONFLICT' },
      })

    const hash = await hashPassword(data.password)

    const user = await prismaClient.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hash,
      },
    })
    return this.gerenerateTokens(user)
  }

  gerenerateTokens(user: UserModel) {
    const token = signJwt({ id: user.id, email: user.email }, '1d')
    const refreshToken = signJwt({ id: user.id, email: user.email }, '1d')
    return { token, refreshToken, user }
  }
}
