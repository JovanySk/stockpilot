import axios, { isAxiosError } from "axios"
import type {
  ProductoEditData,
  ProductoFormPayload,
  ProductoList,
  ProductoStockDetalle,
  RespuestaAccion,
  RespuestaCreacion,
} from "@/types/product"

const api = axios.create({
  baseURL: "/api",
  timeout: 10_000,
})

export interface ParametrosProductos {
  search?: string
  categoryId?: number
  providerId?: number
  lowStock?: boolean
}

export async function obtenerProductos(
  params?: ParametrosProductos,
): Promise<ProductoList[]> {
  const { data } = await api.get<ProductoList[]>("/products", { params })
  return data
}

export async function obtenerProducto(id: number): Promise<ProductoList> {
  const { data } = await api.get<ProductoList>(`/products/${id}`)
  return data
}

export async function obtenerStockProducto(
  id: number,
): Promise<ProductoStockDetalle> {
  const { data } = await api.get<ProductoStockDetalle>(`/products/${id}/stock`)
  return data
}

export async function eliminarProducto(id: number): Promise<RespuestaAccion> {
  const { data } = await api.delete<RespuestaAccion>(`/products/${id}`)
  return data
}

export async function obtenerProductoParaEditar(
  id: number,
): Promise<ProductoEditData> {
  const { data } = await api.get<ProductoEditData>(`/products/${id}/edit`)
  return data
}

export async function crearProducto(
  payload: ProductoFormPayload,
): Promise<RespuestaCreacion> {
  const { data } = await api.post<RespuestaCreacion>("/products", payload)
  return data
}

export async function actualizarProducto(
  id: number,
  payload: ProductoFormPayload & { activo: boolean },
): Promise<RespuestaAccion> {
  const { data } = await api.put<RespuestaAccion>(`/products/${id}`, payload)
  return data
}

/**
 * Normaliza errores de la API a un mensaje legible:
 * soporta { message }, ValidationProblemDetails { errors } y fallos de red.
 */
export function mensajeDeError(error: unknown): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; errors?: Record<string, string[]> }
      | undefined

    if (data?.message) return data.message

    if (data?.errors) {
      const primera = Object.values(data.errors).flat()[0]
      if (primera) return primera
    }

    if (!error.response) {
      return "No se pudo conectar con la API. Verifica que esté en ejecución."
    }
  }
  return "Ocurrió un error inesperado. Intenta de nuevo."
}
