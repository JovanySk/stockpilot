export interface ProductoList {
  id: number
  nombre: string
  codigoSKU: string
  descripcion: string | null
  precio: number
  stockMinimo: number
  stockActual: number
  categoriaNombre: string
  proveedorNombre: string | null
  activo: boolean
  stockBajo: boolean
}

export interface ProductoStockDetalle {
  productoId: number
  nombre: string
  codigoSKU: string
  stockActual: number
  stockMinimo: number
  stockBajo: boolean
}

export interface FiltrosProducto {
  texto: string
  categoria: string
  proveedor: string
  soloStockBajo: boolean
}

export interface RespuestaAccion {
  success: boolean
  message: string
}

export interface RespuestaCreacion extends RespuestaAccion {
  id: number
}

export interface ProductoFormPayload {
  nombre: string
  codigoSKU: string
  descripcion: string | null
  precio: number
  stockMinimo: number
  categoriaId: number
  proveedorId: number | null
}

export interface ProductoEditData extends ProductoFormPayload {
  id: number
  activo: boolean
}
