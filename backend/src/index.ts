import 'reflect-metadata'
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { ApolloServer } from '@apollo/server'
import { buildSchema } from 'type-graphql'
import { expressMiddleware } from '@as-integrations/express5'
import { AuthResolver } from './resolvers/auth.resolver'
import { UserResolver } from './resolvers/user.resolver'
import { buildContext } from './graphql/context'
import { CategoryResolver } from './resolvers/category.resolver'
import { TransactionResolver } from './resolvers/transaction.resolver'

async function bootstrap() {
  const app = express()

  // Habilitar CORS
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
      credentials: true,
    }),
  )

  const schema = await buildSchema({
    resolvers: [
      AuthResolver,
      UserResolver,
      CategoryResolver,
      TransactionResolver,
    ],
    validate: true,
    emitSchemaFile: './schema.graphql',
  })

  const server = new ApolloServer({
    schema,
    plugins: [
      {
        async requestDidStart() {
          return {
            async willSendResponse({ response }) {
              if (
                response.body.kind === 'single' &&
                response.body.singleResult.errors?.some(
                  (err) => err.extensions?.code === 'UNAUTHENTICATED',
                )
              ) {
                response.http.status = 401
              }
            },
          }
        },
      },
    ],
  })

  await server.start()

  app.use(
    '/graphql',
    express.json(),
    expressMiddleware(server, {
      context: buildContext,
    }),
  )

  const port = process.env.PORT || 4000

  app.listen(
    {
      port,
    },
    () => {
      console.log(`Servidor iniciado na porta ${port}!`)
    },
  )
}

bootstrap()
