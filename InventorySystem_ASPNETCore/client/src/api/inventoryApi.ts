import axios from "axios"
import type {
  MovimientoInventario,
  PayloadMovimiento,
  RespuestaMovimiento,
  StockProducto,
} from "@/types/inventory"

const api = axios.create({
  baseURL: "/api",
  timeout: 10_000,
})

export async function obtenerMovimientosProducto(
  productId: number,
): Promise<MovimientoInventario[]> {
  const { data } = await api.get<MovimientoInventario[]>(
    `/inventory/products/${productId}/movements`,
  )
  return data
}

export async function obtenerStockInventario(
  productId: number,
): Promise<StockProducto> {
  const { data } = await api.get<StockProducto>(
    `/inventory/products/${productId}/stock`,
  )
  return data
}

export async function registrarEntrada(
  payload: PayloadMovimiento,
): Promise<RespuestaMovimiento> {
  const { data } = await api.post<RespuestaMovimiento>(
    "/inventory/entries",
    payload,
  )
  return data
}

export async function registrarSalida(
  payload: PayloadMovimiento,
): Promise<RespuestaMovimiento> {
  const { data } = await api.post<RespuestaMovimiento>(
    "/inventory/outputs",
    payload,
  )
  return data
}
