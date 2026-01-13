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
   * MODIFICAÇÃO: Adição do status da receita
   * @param status - Estado atual da receita no sistema.
   */
  status: RecipeStatus
}

export type CreateRecipeInput = {
  title: string
  description?: string
  ingredients: { name: string; quantity: number; unit: string }[]
  steps: string[]
  servings: number
  categoryId: string
}
