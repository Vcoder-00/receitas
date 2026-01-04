# Receitas — Sistema de Gerenciamento de Receitas e Categorias

Aplicação em camadas (SRP) construída com Node.js, TypeScript e Express, com contêiner simples de injeção de dependências. Inclui serviços de negócio, repositórios em memória e API HTTP.

## Sumário
- Visão Geral
- Arquitetura
- Pré-requisitos
- Instalação
- Execução
- Endpoints
- Exemplos rápidos (Windows)
- Estrutura do projeto

## Visão Geral
- CRUD de Categorias, Ingredientes e Receitas.
- Busca e filtragem de receitas por `categoryId` e por texto (`search`).
- Regras de negócio:
  - Unicidade de nome para Categoria e Ingrediente.
  - Receita deve referenciar uma Categoria existente.
  - Bloqueio de exclusão de Categoria quando houver Receitas relacionadas.

## Arquitetura Simplificada (2 Camadas)
- `core`: Contém toda a lógica de negócio, modelos de dados, interfaces e acesso aos dados (armazenamento em memória).
- `presentation`: API HTTP (Express), rotas e configuração do servidor.

O projeto aplica o princípio da **Inversão de Dependência (DIP)**:
- A camada `presentation` depende de **interfaces** definidas no `core` (`ICategoryService`, etc.), e não das implementações concretas.
- Isso desacopla as camadas e facilita testes e manutenção.

### Estrutura do Código
- Servidor e rotas: `src/presentation/http`.
- Interfaces (Contratos): `src/core/interfaces`.
- Implementação de Serviços: `src/core/*Service.ts`.
- Modelos e DTOs: `src/core/models.ts`.
- Dados em memória: `src/core/store.ts`.

### Documentação Visual
Diagramas UML estão disponíveis na pasta `docs/diagrams`:
- `package-diagram.puml`: Visão geral das camadas e componentes.
- `class-diagram.puml`: Detalhes das classes, interfaces e relacionamentos.
- `use-case-diagram.puml`: Casos de uso e interações do usuário.

### Fluxo de Dados
1. Requisição HTTP chega na `presentation`.
2. Controller/Rota chama o `Service` correspondente no `core`.
3. `Service` valida regras e manipula o `store` (banco de dados em memória).
4. Resposta retorna pela `presentation`.

## Pré-requisitos
- Node.js 18+ (recomendado 20+)
- npm 9+

## Instalação
1. Baixar o repositório:
   ```bash
   git clone https://github.com/mayllonveras/receitas/
   cd receitas
   ```
2. Instalar dependências:
   ```bash
   npm install
   ```

## Execução
- Desenvolvimento:
  ```bash
  npm run dev
  ```
- Produção local:
  ```bash
  npm run build
  npm start
  ```
- Porta: `PORT` (opcional). Padrão `3000`.

## Endpoints
Categorias
- `GET /categories` — lista todas
- `GET /categories/:id` — detalhe
- `POST /categories` — cria `{ name }`
- `PUT /categories/:id` — atualiza `{ name? }`
- `DELETE /categories/:id` — remove (bloqueado se houver receitas)

Ingredientes
- `GET /ingredients` — lista todos
- `GET /ingredients/:id` — detalhe
- `POST /ingredients` — cria `{ name }`
- `PUT /ingredients/:id` — atualiza `{ name? }`
- `DELETE /ingredients/:id` — remove

Receitas
- `GET /recipes?categoryId=&search=` — lista com filtros
- `GET /recipes/:id` — detalhe
- `POST /recipes` — cria `{ title, description?, ingredients: [{ name, quantity, unit }], steps[], categoryId }`
- `PUT /recipes/:id` — atualiza parcial dos mesmos campos
- `DELETE /recipes/:id` — remove

Códigos de erro: as validações retornam `400` com `{ error: "mensagem" }` (middleware em `src/presentation/http/middlewares/errorHandler.ts`).

## Clientes HTTP (Insomnia/Postman)
- A pasta `requests` contém coleções de requisições prontas:
  - `Insomnia_recipes_requests.yaml`: Coleção completa para importação direta no **Insomnia**.
  - `recipes_requests.yaml`: Especificação OpenAPI/Swagger (se aplicável) ou coleção genérica.
- Base URL: `http://localhost:3000` (ajuste `PORT` se necessário).
- Headers: `Content-Type: application/json` para requisições com corpo.
- Fluxo sugerido:
  - Criar Categoria
    - Método: `POST`
    - URL: `/categories`
    - Body (raw JSON): `{ "name": "Sobremesa" }`
  - Criar Ingrediente
    - Método: `POST`
    - URL: `/ingredients`
    - Body: `{ "name": "Leite" }`
  - Criar Receita
    - Método: `POST`
    - URL: `/recipes`
    - Body:
      ```json
      {
        "title": "Pavê de chocolate",
        "description": "Camadas de biscoito e creme",
        "ingredients": [
          { "name": "biscoito", "quantity": 200, "unit": "g" },
          { "name": "creme", "quantity": 300, "unit": "ml" },
          { "name": "chocolate", "quantity": 100, "unit": "g" }
        ],
        "steps": ["misturar", "montar", "gelar"],
        "servings": 8,
        "categoryId": "<ID_DA_CATEGORIA>"
      }
      ```
- Listagens e filtros:
  - `GET /categories`, `GET /ingredients`, `GET /recipes`
  - `GET /recipes?categoryId=<ID>` para filtrar por categoria
  - `GET /recipes?search=<texto>` para buscar por título/descrição/ingredientes
- Dicas de uso:
  - Crie um ambiente com variável `base_url` e use `{{ base_url }}` nas requisições.
  - Salve exemplos de corpo usando os arquivos em `requests/`.

## Atualização do `Insomnia_recipes_requests.yaml`

## Novas funcionalidades adicionadas

### Categorias Pré-definidas

O sistema passou a incluir um conjunto de categorias prontas, permitindo ao usuário criar rapidamente estruturas comuns sem precisar definir tudo manualmente. As categorias disponíveis são:

- **Carnes**
- **Massas**
- **Saladas**
- **Sopas**
- **Sobremesas**

Essas opções facilitam o início do fluxo de cadastro, oferecendo uma base sólida para a organização das receitas.

### Create New Category

Como agora existem categorias pré-definidas, o endpoint antes chamado **Create Category** foi renomeado para **Create New Category**.  
Esse método permanece responsável por criar categorias personalizadas, permitindo ao usuário expandir a taxonomia do sistema além das cinco opções iniciais.

A requisição aceita os mesmos parâmetros de antes, mantendo sua função original — criar qualquer categoria adicional que o usuário desejar.

## Exemplos rápidos (Windows PowerShell)
- Criar categoria usando arquivo:
  ```powershell
  curl.exe -s -X POST http://localhost:3000/categories -H "Content-Type: application/json" --data @requests/category.json
  ```
- Criar ingrediente usando arquivo:
  ```powershell
  curl.exe -s -X POST http://localhost:3000/ingredients -H "Content-Type: application/json" --data @requests/ingredient.json
  ```
- Criar receita (ajuste `categoryId`):
  ```powershell
  curl.exe -s -X POST http://localhost:3000/recipes -H "Content-Type: application/json" --data @requests/recipe.json
  ```
- Listar categorias:
  ```powershell
  curl.exe -s http://localhost:3000/categories
  ```
- Listar ingredientes:
  ```powershell
  curl.exe -s http://localhost:3000/ingredients
  ```
- Filtrar receitas por texto:
  ```powershell
  curl.exe -s "http://localhost:3000/recipes?search=chocolate"
  ```

## Estrutura do projeto
```
receitas/
├─ src/
│  ├─ core/
│  │  ├─ CategoryService.ts
│  │  ├─ IngredientService.ts
│  │  ├─ RecipeService.ts
│  │  ├─ models.ts
│  │  └─ store.ts
│  └─ presentation/
│     └─ http/
│        ├─ middlewares/errorHandler.ts
│        ├─ routes/categories.ts
│        ├─ routes/ingredients.ts
│        ├─ routes/recipes.ts
│        └─ server.ts
├─ requests/
│  ├─ category.json
│  ├─ ingredient.json
│  ├─ ingredient-update.json
│  ├─ recipe.json
│  ├─ Insomnia_recipes_requests.yaml
│  └─ recipes_requests.yaml
├─ package.json
├─ tsconfig.json
└─ README.md
```

## Composição do servidor
- O servidor instancia diretamente os repositórios em memória e os serviços.

### Observação sobre DTOs de criação
- Os repositórios recebem entidades já criadas com `id` e `createdAt` (gerados pela fábrica/serviço).
- As requisições HTTP enviam apenas os campos de entrada (ex.: `{ name }` para categoria/ingrediente; `{ title, description?, ingredients[], steps[], categoryId }` para receita).

## Scripts
- `npm run dev` — inicia em modo desenvolvimento (ts-node)
- `npm run build` — compila TypeScript
- `npm start` — executa o build compilado

## Novas funcionalidades adicionadas ao sistema

## Escalonamento de Porções

Recalcula os ingredientes de uma receita para um novo número de porções, sem modificar ou persistir a receita original.

### Regras que foram implementadas
- O valor de `servings` deve ser maior que 0.
- A receita deve existir.
- As quantidades dos ingredientes são ajustadas proporcionalmente.
- A operação não altera o estado do sistema.
- A receita original permanece inalterada.

### Cálculo
- factor = newServings / recipe.servings

### Endpoint
- POST /recipes/:id/scale

### Body
```json
{
  "servings": 8
}
```
### Exemplo 
```json
{
  "id": "123",
  "name": "Bolo de Cenoura",
  "servings": 8,
  "ingredients": [
    { "ingredientId": "farinha", "quantity": 600, "unit": "g" },
    { "ingredientId": "cenoura", "quantity": 4, "unit": "un" }
  ]
}
```
### Funcionamento
- A receita é obtida pelo ID.
- O fator proporcional é calculado.
- As quantidades dos ingredientes são recalculadas.
- Um novo objeto de receita é retornado.
- Não há persistência de dados.
- A receita original não é modificada.

## Lista de Compras Consolidada

Gera uma lista única de ingredientes combinando múltiplas receitas, somando quantidades iguais sem modificar nenhum dado original.

### Regras que foram implementadas
- O array recipeIds deve existir e não pode ser vazio.
- Cada ID deve corresponder a uma receita existente.
- Ingredientes iguais (mesmo ingredientId e mesma unit) são somados.
- A operação não altera o estado do sistema.
- Nenhuma receita é modificada ou persistida.
- O retorno é apenas uma lista consolidada em memória.

### Lógica de Consolidação
- Para cada receita encontrada:
- Percorre seus ingredientes.
- Procura na lista final um item com o mesmo ingredientId e unit.
- Se existir → soma a quantidade.
- Se não existir → adiciona um novo item.

### Endpoint
- POST /recipes/shopping-list

### Body 
```json
{
  "recipeIds": ["123", "456", "789"]
}
```
### Exemplo
```json
[
  { "ingredientId": "farinha", "unit": "g", "quantity": 1200 },
  { "ingredientId": "cenoura", "unit": "un", "quantity": 6 },
  { "ingredientId": "açúcar", "unit": "g", "quantity": 800 }
]
```
### Funcionamento
- Cada receita é obtida pelo ID informado.
- Todos os ingredientes são percorridos.
- Ingredientes compatíveis são somados na lista final.
- Um array consolidado é retornado.
- Não há persistência de dados.
- Nenhuma receita original é modificada.
