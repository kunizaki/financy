# Estágio de construção
FROM node:20-alpine AS build

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY src/lib/prisma ./src/lib/prisma/

# Instalar dependências
RUN npm install

# Copiar o restante do código
COPY . .

# Gerar o cliente do Prisma e construir o projeto
RUN npx prisma generate --schema=src/lib/prisma/schema.prisma
RUN npm run build

# Estágio de produção
FROM node:20-alpine

WORKDIR /app

# Copiar apenas os arquivos necessários do estágio de build
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/src/lib/prisma ./src/lib/prisma

# Variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=4000

# Expor a porta
EXPOSE 4000

# Comando para rodar a aplicação
CMD ["npm", "start"]
