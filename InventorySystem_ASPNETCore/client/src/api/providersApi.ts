import axios from "axios"
import type {
  OpcionProveedor,
  Proveedor,
  ProveedorPayload,
} from "@/types/provider"
import type { RespuestaAccion, RespuestaCreacion } from "@/types/product"

const api = axios.create({
  baseURL: "/api",
  timeout: 10_000,
})

export async function obtenerOpcionesProveedores(): Promise<OpcionProveedor[]> {
  const { data } = await api.get<OpcionProveedor[]>("/providers/options")
  return data
}

export async function obtenerProveedores(): Promise<Proveedor[]> {
  const { data } = await api.get<Proveedor[]>("/providers")
  return data
}

export async function crearProveedor(
  payload: ProveedorPayload,
): Promise<RespuestaCreacion> {
  const { data } = await api.post<RespuestaCreacion>("/providers", payload)
  return data
}

export async function actualizarProveedor(
  id: number,
  payload: ProveedorPayload,
): Promise<RespuestaAccion> {
  const { data } = await api.put<RespuestaAccion>(`/providers/${id}`, payload)
  return data
}

export async function eliminarProveedor(id: number): Promise<RespuestaAccion> {
  const { data } = await api.delete<RespuestaAccion>(`/providers/${id}`)
  return data
}
