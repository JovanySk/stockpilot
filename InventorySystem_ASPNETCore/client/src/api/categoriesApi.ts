import axios from "axios"
import type {
  Categoria,
  CategoriaPayload,
  OpcionCategoria,
} from "@/types/category"
import type { RespuestaAccion, RespuestaCreacion } from "@/types/product"

const api = axios.create({
  baseURL: "/api",
  timeout: 10_000,
})

export async function obtenerOpcionesCategorias(): Promise<OpcionCategoria[]> {
  const { data } = await api.get<OpcionCategoria[]>("/categories/options")
  return data
}

export async function obtenerCategorias(): Promise<Categoria[]> {
  const { data } = await api.get<Categoria[]>("/categories")
  return data
}

export async function crearCategoria(
  payload: CategoriaPayload,
): Promise<RespuestaCreacion> {
  const { data } = await api.post<RespuestaCreacion>("/categories", payload)
  return data
}

export async function actualizarCategoria(
  id: number,
  payload: CategoriaPayload,
): Promise<RespuestaAccion> {
  const { data } = await api.put<RespuestaAccion>(`/categories/${id}`, payload)
  return data
}

export async function eliminarCategoria(id: number): Promise<RespuestaAccion> {
  const { data } = await api.delete<RespuestaAccion>(`/categories/${id}`)
  return data
}
