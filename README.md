Backend
============

Para rodar:
1. docker-compose up

Documentação (`/docs`):

1. Desenvolvido utilizando node 12.16 e NestJS.
2. Banco de dados: MySQL 8
3. Login utilizando: JWT
4. Contém as seguintes rotas:
    - /user
        - signup - POST - (cadastro de novo usuário)
        - signin - POST - (login)
        - detail - GET - (detalhes do usuário logado)
    - /account
        - /account - POST - (cadastro de uma conta)
        - /account/deposit - POST - (realiza um depósito)
        - /account/refund - POST - (realiza um saque)
        - /account/transfer - POST - (realiza uma transferência)
        - /account - GET - (contas existentes para o usuário logado)
        - /account/types - GET - (todos tipos de contas disponíveis)
    - /record
        - /record/extract - GET - (transações realizadas)

Frontend
============

Para rodar:
1. npm install
2. npm run dev

Documentação:

1. Desenvolvido utilizando AdminLTE 3
2. Login utilizado: JWT


