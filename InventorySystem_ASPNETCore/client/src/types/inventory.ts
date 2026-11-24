import type { MovimientoInventario } from "@/types/dashboard"

export type { MovimientoInventario }

export interface PayloadMovimiento {
  productoId: number
  cantidad: number
  motivo: string
  observaciones: string | null
  usuarioRegistro?: string | null
}

export interface StockProducto {
  productId: number
  stock: number
}

export interface RespuestaMovimiento {
  success: boolean
  message: string
  movimiento: MovimientoInventario
}
