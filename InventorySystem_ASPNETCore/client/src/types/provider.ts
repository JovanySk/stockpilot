export interface OpcionProveedor {
  id: number
  nombre: string
}

export interface Proveedor {
  id: number
  nombre: string
  contacto: string | null
  telefono: string | null
  email: string | null
  direccion: string | null
  activo: boolean
  fechaCreacion: string
  totalProductosActivos: number
}

export interface ProveedorPayload {
  nombre: string
  contacto: string | null
  telefono: string | null
  email: string | null
  direccion: string | null
  activo: boolean
}
