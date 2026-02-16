import { prismaClient } from '../lib/prisma/prisma'
import { UpdateUserInput } from '../dtos/input/user.input'
import { RegisterInput } from '../dtos/input/auth.input'
import { GraphQLError } from 'graphql'

export class UserService {
  async createUser(data: RegisterInput) {
    const findUser = await prismaClient.user.findUnique({
      where: {
        email: data.email,
      },
    })
    if (findUser)
      throw new GraphQLError('Usuário já cadastrado!', {
        extensions: { code: 'CONFLICT' },
      })

    return prismaClient.user.create({
      data: {
        name: data.name,
        email: data.email,
      },
    })
  }

  async findUser(id: string) {
    const user = await prismaClient.user.findUnique({
      where: {
        id,
      },
    })
    if (!user)
      throw new GraphQLError('Usuário não existe', {
        extensions: { code: 'NOT_FOUND' },
      })
    return user
  }

  async listUsers() {
    return prismaClient.user.findMany()
  }

  async updateUser(id: string, data: UpdateUserInput) {
    const user = await prismaClient.user.findUnique({
      where: { id },
    })
    if (!user)
      throw new GraphQLError('Usuário não existe', {
        extensions: { code: 'NOT_FOUND' },
      })

    return prismaClient.user.update({
      where: { id },
      data: {
        name: data.name ?? undefined,
      },
    })
  }

  async deleteUser(id: string) {
    const user = await prismaClient.user.findUnique({
      where: { id },
    })
    if (!user)
      throw new GraphQLError('Usuário não existe', {
        extensions: { code: 'NOT_FOUND' },
      })

    await prismaClient.user.delete({
      where: { id },
    })

    return true
  }
}
