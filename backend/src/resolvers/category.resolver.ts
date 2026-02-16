import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { IsAuth } from '../middlewares/auth.middleware'
import { CategoryModel } from '../models/category.model'
import { CategoryService } from '../services/category.service'
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from '../dtos/input/category.input'
import { GqlUser } from '../graphql/decorators/user.decorator'
import { UserModel } from '../models/user.model'

@Resolver(() => CategoryModel)
@UseMiddleware(IsAuth)
export class CategoryResolver {
  private categoryService = new CategoryService()

  @Mutation(() => CategoryModel)
  async createCategory(
    @Arg('data', () => CreateCategoryInput) data: CreateCategoryInput,
    @GqlUser() user: UserModel,
  ): Promise<CategoryModel> {
    return this.categoryService.createCategory(data, user.id)
  }

  @Mutation(() => CategoryModel)
  async updateCategory(
    @Arg('id', () => String) id: string,
    @GqlUser() user: UserModel,
    @Arg('data', () => UpdateCategoryInput) data: UpdateCategoryInput,
  ): Promise<CategoryModel> {
    return this.categoryService.updateCategory(id, user.id, data)
  }

  @Mutation(() => Boolean)
  async deleteCategory(
    @Arg('id', () => String) id: string,
    @GqlUser() user: UserModel,
  ): Promise<boolean> {
    return this.categoryService.deleteCategory(id, user.id)
  }

  @Query(() => CategoryModel)
  async getCategory(
    @Arg('id', () => String) id: string,
    @GqlUser() user: UserModel,
  ): Promise<CategoryModel> {
    return this.categoryService.findCategory(id, user.id)
  }

  @Query(() => [CategoryModel])
  async listCategories(@GqlUser() user: UserModel): Promise<CategoryModel[]> {
    return this.categoryService.listCategories(user.id)
  }
}
