# Financy

Este projeto é uma aplicação composta por um backend e um frontend, projetada para ser executada em um ambiente de desenvolvimento isolado usando Docker.

## Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Como Executar o Projeto

Para facilitar o processo de inicialização, utilizamos um script chamado `dev.sh` que configura e levanta todos os serviços necessários em modo de desenvolvimento.

### Passos para execução:

1.  **Dar permissão de execução ao script (se necessário):**

    Abra o terminal no diretório raiz do projeto e execute:
    ```bash
    chmod +x dev.sh
    ```

2.  **Executar o script:**

    ```bash
    ./dev.sh
    ```

O script `dev.sh` executará os seguintes passos automaticamente:
- Derrubará containers antigos e removerá volumes órfãos.
- Construirá as imagens do backend e frontend.
- Iniciará os containers com as configurações de desenvolvimento.
- Instalará as dependências (`npm install`).
- Executará as migrações do banco de dados (Prisma).
- Iniciará os servidores de desenvolvimento.

## Acesso aos Serviços

Após a execução do script, os serviços estarão disponíveis nos seguintes endereços:

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend (API):** [http://localhost:4000](http://localhost:4000)

## Estrutura do Projeto

- `/backend`: API construída com Node.js e Prisma.
- `/frontend`: Interface do usuário.
- `dev.sh`: Script utilitário para ambiente de desenvolvimento.
- `docker-compose.yml`: Configuração base do Docker Compose.
- `docker-compose.dev.yml`: Sobrescritas específicas para desenvolvimento (hot reload, volumes, etc).

---
Projeto desenvolvido como parte dos estudos na Rocketseat.
