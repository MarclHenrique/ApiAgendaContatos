# Documentação da API REST de Contatos (Backend Express.js)

Esta documentação descreve os endpoints da API REST desenvolvida em JavaScript com Express.js e PostgreSQL para gerenciar uma agenda de contatos.

## Endpoints da API

### Rota Base: `/contatos`

#### 1. Criar um Novo Contato

*   **Método:** `POST`
*   **Path:** `/contatos`
*   **Descrição:** Adiciona um novo contato à agenda.
*   **Corpo da Requisição (JSON):**
    ```json
    {
      "nome": "string (obrigatório)",
      "sobrenome": "string (opcional)",
      "data_nascimento": "string (opcional, formato YYYY-MM-DD)",
      "telefone": "string (obrigatório, único)",
      "familia": "boolean (opcional, default: false)"
    }
    ```
*   **Exemplo de Corpo:**
    ```json
    {
      "nome": "Beltrano",
      "sobrenome": "Silva",
      "data_nascimento": "1985-10-20",
      "telefone": "+5521998877665",
      "familia": true
    }
    ```
*   **Resposta de Sucesso (201 Created):**
    *   **Corpo:** Retorna o objeto do contato recém-criado, incluindo `id`, `criado_em` e `atualizado_em`.
    ```json
    {
      "id": 2,
      "nome": "Beltrano",
      "sobrenome": "Silva",
      "data_nascimento": "1985-10-20",
      "telefone": "+5521998877665",
      "familia": true,
      "criado_em": "2025-06-03T03:15:00.123456Z",
      "atualizado_em": "2025-06-03T03:15:00.123456Z"
    }
    ```
*   **Respostas de Erro:**
    *   `400 Bad Request`: Dados inválidos (ex: campos obrigatórios faltando, formato de data incorreto).
    *   `409 Conflict`: Telefone já cadastrado.
    *   `500 Internal Server Error`: Erro no servidor ou banco de dados.

#### 2. Listar Todos os Contatos

*   **Método:** `GET`
*   **Path:** `/contatos`
*   **Descrição:** Retorna uma lista de todos os contatos cadastrados.
*   **Corpo da Requisição:** Nenhum.
*   **Resposta de Sucesso (200 OK):**
    *   **Corpo:** Um array JSON contendo os objetos dos contatos.
    ```json
    [
      {
        "id": 1,
        "nome": "Fulano Silva",
        "sobrenome": "De Tal",
        "data_nascimento": "1990-05-15",
        "telefone": "+5511911112222",
        "familia": false,
        "criado_em": "2025-06-03T03:14:39.847786Z",
        "atualizado_em": "2025-06-03T03:14:40.043208Z"
      },
      {
        "id": 2,
        "nome": "Beltrano",
        "sobrenome": "Silva",
        "data_nascimento": "1985-10-20",
        "telefone": "+5521998877665",
        "familia": true,
        "criado_em": "2025-06-03T03:15:00.123456Z",
        "atualizado_em": "2025-06-03T03:15:00.123456Z"
      }
    ]
    ```
*   **Respostas de Erro:**
    *   `500 Internal Server Error`: Erro no servidor ou banco de dados.

### Rota Específica: `/contatos/{id}`

#### 3. Buscar Contato por ID

*   **Método:** `GET`
*   **Path:** `/contatos/{id}` (substitua `{id}` pelo ID numérico do contato)
*   **Descrição:** Retorna os detalhes de um contato específico.
*   **Corpo da Requisição:** Nenhum.
*   **Resposta de Sucesso (200 OK):**
    *   **Corpo:** O objeto JSON do contato encontrado.
    ```json
    {
      "id": 1,
      "nome": "Fulano Silva",
      "sobrenome": "De Tal",
      "data_nascimento": "1990-05-15",
      "telefone": "+5511911112222",
      "familia": false,
      "criado_em": "2025-06-03T03:14:39.847786Z",
      "atualizado_em": "2025-06-03T03:14:40.043208Z"
    }
    ```
*   **Respostas de Erro:**
    *   `400 Bad Request`: ID inválido (não numérico).
    *   `404 Not Found`: Contato com o ID especificado não encontrado.
    *   `500 Internal Server Error`: Erro no servidor ou banco de dados.

#### 4. Atualizar um Contato

*   **Método:** `PUT`
*   **Path:** `/contatos/{id}` (substitua `{id}` pelo ID numérico do contato)
*   **Descrição:** Atualiza os dados de um contato existente.
*   **Corpo da Requisição (JSON):** Similar ao POST, contendo os campos a serem atualizados.
    ```json
    {
      "nome": "Fulano Atualizado",
      "telefone": "+5511933334444"
    }
    ```
*   **Resposta de Sucesso (200 OK):**
    *   **Corpo:** Retorna o objeto do contato atualizado.
    ```json
    {
      "id": 1,
      "nome": "Fulano Atualizado",
      "sobrenome": "De Tal",
      "data_nascimento": "1990-05-15",
      "telefone": "+5511933334444",
      "familia": false,
      "criado_em": "2025-06-03T03:14:39.847786Z",
      "atualizado_em": "2025-06-03T03:16:00.987654Z" 
    }
    ```
*   **Respostas de Erro:**
    *   `400 Bad Request`: ID inválido ou dados inválidos no corpo.
    *   `404 Not Found`: Contato com o ID especificado não encontrado.
    *   `409 Conflict`: Tentativa de atualizar para um telefone que já existe em outro contato.
    *   `500 Internal Server Error`: Erro no servidor ou banco de dados.

#### 5. Deletar um Contato

*   **Método:** `DELETE`
*   **Path:** `/contatos/{id}` (substitua `{id}` pelo ID numérico do contato)
*   **Descrição:** Remove um contato da agenda.
*   **Corpo da Requisição:** Nenhum.
*   **Resposta de Sucesso (204 No Content):**
    *   **Corpo:** Nenhum.
*   **Respostas de Erro:**
    *   `400 Bad Request`: ID inválido.
    *   `404 Not Found`: Contato com o ID especificado não encontrado.
    *   `500 Internal Server Error`: Erro no servidor ou banco de dados.



