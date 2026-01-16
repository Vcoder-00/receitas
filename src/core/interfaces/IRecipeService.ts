import { Recipe, CreateRecipeInput } from "../models.js"

export interface IRecipeService {
  /**
   * CÓDIGO ORIGINAL
   * Listagem de receitas com filtros opcionais.
   */
  list(filter?: {
    categoryId?: string
    categoryName?: string
    search?: string
  }): Promise<Recipe[]>

  get(id: string): Promise<Recipe>
  create(input: CreateRecipeInput): Promise<Recipe>
  update(id: string, data: Partial<CreateRecipeInput>): Promise<Recipe>
  delete(id: string): Promise<void>

  /**
   * CÓDIGO NOVO
   * Escalonamento inteligente de porções (sem persistência).
   */
  scaleRecipe(id: string, newServings: number): Promise<Recipe>

  /**
   * CÓDIGO NOVO
   * Geração de lista de compras consolidada.
   */
  generateShoppingList(
    recipeIds: string[]
  ): Promise<{ ingredientId: string; unit: string; quantity: number }[]>

  /**
   * CÓDIGO NOVO
   * Transições de estado da receita (workflow).
   */
  publish(id: string): Promise<Recipe>
  archive(id: string): Promise<Recipe>
}
