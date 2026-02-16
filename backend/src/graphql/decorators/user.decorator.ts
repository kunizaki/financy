import { createParameterDecorator, ResolverData } from 'type-graphql'
import { GraphqlContext } from '../context'
import { UserModel } from '../../models/user.model'
import { GraphQLError } from 'graphql'

export const GqlUser = () => {
    return createParameterDecorator(
        async ({ context }: ResolverData<GraphqlContext>): Promise<UserModel | null> => {
            if (!context || !context.user) return null

            // Evita consulta ao banco usando payload do JWT quando disponível
            const payload = context.userPayload
            if (payload) {
                return {
                    id: payload.id,
                    email: payload.email,
                    name: '',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                } as unknown as UserModel
            }

            // Fallback: se não houver payload, falha explicitamente
            throw new GraphQLError('Usuário não encontrado', {
                extensions: { code: 'UNAUTHENTICATED' },
            })
        }
    )
}