# Estágio de construção
FROM node:20-alpine AS build

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o restante do código
COPY . .

# Construir o projeto
RUN npm run build

# Estágio de produção (usando Nginx para servir o conteúdo estático)
FROM nginx:alpine

# Copiar os arquivos construídos para o diretório do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expor a porta 80
EXPOSE 80

# Comando para rodar o Nginx
CMD ["nginx", "-g", "daemon off;"]
