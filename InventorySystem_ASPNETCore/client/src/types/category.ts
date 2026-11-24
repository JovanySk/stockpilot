export interface OpcionCategoria {
  id: number
  nombre: string
}

export interface Categoria {
  id: number
  nombre: string
  descripcion: string | null
  activo: boolean
  fechaCreacion: string
  totalProductosActivos: number
}

export interface CategoriaPayload {
  nombre: string
  descripcion: string | null
  activo: boolean
}
