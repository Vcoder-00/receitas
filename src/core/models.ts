/**
 * CÓDIGO MODIFICADO
 * Importação do tipo RecipeStatus para representar o estado da receita.
 */
import { RecipeStatus } from "./RecipeStatus.js"

export type Category = {
  id: string
  name: string
  createdAt: Date
}

export type Ingredient = {
  id: string
  name: string
  createdAt: Date
}

export type Recipe = {
  id: string
  title: string
  description?: string
  ingredients: { ingredientId: string; quantity: number; unit: string }[]
  steps: string[]
  servings: number
  categoryId: string
  createdAt: Date

  /**
   * CÓDIGO NOVO
   * Estado atual da receita (draft, published ou archived).
   * Necessário para aplicar as regras de negócio do workflow.
   */
  status: RecipeStatus
}

/**
 * CÓDIGO ORIGINAL
 * Estrutura de entrada para criação de receitas.
 */
export type CreateRecipeInput = {
  title: string
  description?: string
  ingredients: { name: string; quantity: number; unit: string }[]
  steps: string[]
  servings: number
  categoryId: string
}
