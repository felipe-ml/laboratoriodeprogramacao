# Prova 1 - Gerenciamento de fitopatologia de soja
Autor: Luiz Felipe de Moura Teixeira

## Requisitos implementados
- Cadastro (criação) de registros de fitopatologia.
- Listagem em tabela com busca por produtor.
- Edição/Atualização de registros.
- Exclusão de registro.
- Pesquisa por produtor (campo-chave).
- Arquitetura em camadas: model, repository, service, controller, view.
- Feedback ao usuário via alert (Thymeleaf + Bootstrap).
- Persistência via JPA/Hibernate (MySQL).

## Como executar
1. Tenha Java 17, Maven e um servidor MySQL local.
2. Crie banco de dados `fitopatologia`:
   - `CREATE DATABASE fitopatologia;`
3. Ajuste `src/main/resources/application.properties` com usuário/senha do MySQL.
4. No diretório do projeto, execute:
   - `mvn spring-boot:run`
5. Acesse: `http://localhost:8080/registros`

## Observações
- O projeto é intencionalmente simples e didático.
- Nome do arquivo entregue: `Prova1_LuizFelipeDeMouraTeixeira.zip`
- Antes da prova oral, não faça alterações no repositório.

## Estrutura
- `src/main/java/br/univ/fitopatologia`:
  - `model/Registro.java`
  - `repository/RegistroRepository.java`
  - `service/RegistroService.java`
  - `controller/RegistroController.java`
  - `FitopatologiaApplication.java`
- `src/main/resources/templates` (Thymeleaf + Bootstrap via webjars)
- `pom.xml`

Data de geração: 2025-09-27T18:14:12.987066 UTC
