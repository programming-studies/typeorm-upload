# Rodar o projeto

  - Levantar container de banco de dados (postgres)
    - `docker run --name gostack-11-desafio-06-database -e POSTGRES_PASSWORD=docker -e POSTGRES_DB=gostack_desafio06_tests -d -p 5432:5432 postgres`
  - Instala as dependências
    - `yarn`
  - Executar migrations
    - `yarn typeorm migration:run`
  - Executa o projeto em modo desenvolvimento
    - `yarn dev:server`
  - Executa os testes do projeto
    - `yarn test`
