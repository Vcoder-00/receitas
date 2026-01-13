import crypto from "node:crypto"
import { store } from "./store.js"
import { Category } from "./models.js"
import { ICategoryService } from "./interfaces/ICategoryService.js"
import { normalizeText } from "./utils/normalizeText.js"

export class CategoryService implements ICategoryService {
  async list(): Promise<Category[]> {
    return [...store.categories]
  }

  async get(id: string): Promise<Category> {
    const found = store.categories.find((c) => c.id === id)
    if (!found) throw new Error("Category not found")
    return found
  }

  /**
 * CÓDIGO MODIFICADO
 *
 * Implementa busca por nome de categoria de forma que ignora espaços adicionais e
 * vira case-insensitive.
 *
 * A função `normalizeText` remove acentos, converte para minúsculas e aplica
 * `.trim()`, garantindo que variações como:
 * "Sobremesas", " sobremesas ", "SÔBREMESAS" ou "sôbremesas" sejam tratadas como equivalentes.
 *
 * Isso impede duplicidades lógicas e garante integridade e consistência
 * dos dados no sistema.
 */
  async findByName(name: string): Promise<Category | undefined> {
  const normalized = normalizeText(name)

  return store.categories.find(c =>
    normalizeText(c.name) === normalized
  )
}

/**
 * CÓDIGO MODIFICADO
 * Versão mais segura e robusta da criação de categorias.
 * 
 * - Garante que `data.name` nunca seja null ou undefined, convertendo para string.
 * - Remove espaços em branco antes e depois do nome.
 * - Evita erro de runtime ao chamar `.trim()` em valores inválidos.
 * - Valida duplicidade usando o nome já normalizado.
 *
 */
  async create(data: { name: string }): Promise<Category> {
  const name = String(data.name ?? "").trim()

  if (!name) {
    throw new Error("Category name is required")
  }

  // verifica duplicidade com normalização
  const existing = await this.findByName(name)
  if (existing) {
    throw new Error("Category name already exists")
  }

  const category: Category = {
    id: crypto.randomUUID(),
    name,
    createdAt: new Date()
  }

  store.categories.push(category)

  return category
}
  async update(id: string, data: { name?: string }): Promise<Category> {
    const idx = store.categories.findIndex((c) => c.id === id)
    if (idx < 0) throw new Error("Category not found")
    const current = store.categories[idx]

    let name = current.name
    if (data.name !== undefined) {
      name = data.name.trim()
      const exists = await this.findByName(name)
      if (exists && exists.id !== id) {
        throw new Error("Category name must be unique")
      }
    }

    const updated = { ...current, name }
    store.categories[idx] = updated
    return updated
  }

  async delete(id: string): Promise<void> {
    // Check usage in recipes
    const hasRecipes = store.recipes.some((r) => r.categoryId === id)
    if (hasRecipes) throw new Error("Cannot delete category with recipes")
    
    const idx = store.categories.findIndex((c) => c.id === id)
    if (idx >= 0) {
      store.categories.splice(idx, 1)
    }
  }
}
