# Projeto MeuStock - DESENVOLVIMENTO DE SOFTWARE PARA WEB(2024.1)
## Trabalho Final

### Instação

Siga os passos para instalar o projeto

1. API

Para executar o server precisa do docker instalado, ele é usado para criar o
conteiner com o banco de dados.

```console
docker compose -f <caminho-do-arquivo-compose> up -d
```

Caso apresente algum erro ao instalar, tente:

```console
npm i --legacy-peer-deps
````

Variáveis de ambiente, use:

```
# Auth
# Como é ambiente de desenvolvimento, não é necessário um JWT_SECRET muito forte
JWT_SECRET="secret_dev"

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/database?schema=public"
````

Instale normalmente:
```console
npx prisma migrate dev
````

2. WEB

Caso apresente algum erro ao instalar, tente:

```console
npm i
````
