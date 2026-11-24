export const TipoMovimiento = {
  Entrada: 0,
  Salida: 1,
} as const

export type TipoMovimiento = (typeof TipoMovimiento)[keyof typeof TipoMovimiento]

export interface MovimientoInventario {
  id: number
  productoId: number
  productoNombre: string
  codigoSKU: string
  tipoMovimiento: TipoMovimiento
  cantidad: number
  motivo: string
  fechaMovimiento: string
  usuarioRegistro: string | null
  observaciones: string | null
}

export interface ProductoStock {
  productoId: number
  nombre: string
  codigoSKU: string
  stockActual: number
  stockMinimo: number
  stockBajo: boolean
}

export interface DashboardResumen {
  totalProductosActivos: number
  totalCategoriasActivas: number
  totalProveedoresActivos: number
  totalProductosStockBajo: number
  totalUnidadesEnInventario: number
  valorTotalInventario: number
  ultimosMovimientos: MovimientoInventario[]
  productosStockBajo: ProductoStock[]
}
