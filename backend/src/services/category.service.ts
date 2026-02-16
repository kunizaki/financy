import { prismaClient } from '../lib/prisma/prisma'
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from '../dtos/input/category.input'
import { GraphQLError } from 'graphql'

export class CategoryService {
  async createCategory(data: CreateCategoryInput, userId: string) {
    const categoryFound = await prismaClient.category.findUnique({
      where: {
        userId_title: {
          userId,
          title: data.title,
        },
      },
    })
    if (categoryFound)
      throw new GraphQLError('Categoria já cadastrada!', {
        extensions: { code: 'CONFLICT' },
      })

    return prismaClient.category.create({
      data: {
        userId,
        title: data.title,
        description: data?.description ?? undefined,
        icon: data.icon,
        color: data.color,
      },
    })
  }

  async findCategory(id: string, userId: string) {
    const categoryFound = await prismaClient.category.findUnique({
      where: {
        id,
        userId,
      },
    })
    if (!categoryFound)
      throw new GraphQLError(
        'Categoria não existe ou não pertence ao usuário',
        { extensions: { code: 'NOT_FOUND' } },
      )
    return categoryFound
  }

  async listCategories(userId: string) {
    return prismaClient.category.findMany({
      where: { userId },
    })
  }

  async updateCategory(id: string, userId: string, data: UpdateCategoryInput) {
    const categoryFound = await prismaClient.category.findUnique({
      where: { id, userId },
    })
    if (!categoryFound)
      throw new GraphQLError(
        'Categoria não existe ou não pertence ao usuário',
        { extensions: { code: 'NOT_FOUND' } },
      )

    return prismaClient.category.update({
      where: { id },
      data: {
        title: data.title,
        description: data?.description ?? undefined,
        icon: data.icon,
        color: data.color,
      },
    })
  }

  async deleteCategory(id: string, userId: string) {
    const categoryFound = await prismaClient.category.findUnique({
      where: { id, userId },
    })
    if (!categoryFound)
      throw new GraphQLError(
        'Categoria não existe ou não pertence ao usuário',
        { extensions: { code: 'NOT_FOUND' } },
      )

    await prismaClient.category.delete({
      where: { id },
    })

    return true
  }
}
