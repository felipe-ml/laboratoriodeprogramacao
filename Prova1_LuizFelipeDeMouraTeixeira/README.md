# Sistema de Fitopatologia de Soja

Sistema web para gerenciamento de doenças da soja, desenvolvido com Spring Boot e Thymeleaf.

## Funcionalidades

- ✅ Cadastro de doenças da soja
- ✅ Listagem completa com informações detalhadas
- ✅ Edição e atualização de registros
- ✅ Exclusão de doenças
- ✅ Sistema de pesquisa avançado
- ✅ Interface responsiva com Bootstrap
- ✅ Validação de dados
- ✅ Mensagens de feedback

## Tecnologias Utilizadas

- **Backend**: Java 17 + Spring Boot 3.2.0
- **Frontend**: Thymeleaf + Bootstrap 5
- **Banco de Dados**: MySQL 8.0
- **ORM**: JPA/Hibernate
- **Gerenciamento**: Maven

## Campos do Sistema

### Campos Obrigatórios
- Nome da doença
- Agente causador
- Tipo de patógeno (Fungo, Bactéria, Vírus, Nematoide, Oomiceto)
- Severidade (Baixa, Média, Alta, Crítica)

### Campos Opcionais
- Sintomas
- Métodos de controle
- Região
- Temperatura favorável
- Umidade favorável

## Pré-requisitos

- Java 17 ou superior
- MySQL 8.0 ou superior
- Maven 3.6 ou superior

## Configuração do Banco de Dados

1. Instale o MySQL
2. Crie um usuário (ou use o root):
sql
CREATE DATABASE fitopatologia_soja;


3. Configure as credenciais no arquivo `application.properties`:
properties
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha


## Como Executar

1. Clone o repositório
2. Configure o banco de dados MySQL
3. Execute o comando:
bash
mvn spring-boot:run

4. Acesse: http://localhost:8080/doencas
