import { useCallback, useEffect, useMemo, useState } from "react"
import { CircleAlert, CircleCheck, Plus } from "lucide-react"
import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  mensajeDeError,
  obtenerProductoParaEditar,
  obtenerProductos,
} from "@/api/productsApi"
import { obtenerOpcionesCategorias } from "@/api/categoriesApi"
import { obtenerOpcionesProveedores } from "@/api/providersApi"
import { ProductDetailDrawer } from "@/components/products/ProductDetailDrawer"
import { ProductFilters } from "@/components/products/ProductFilters"
import { ProductForm } from "@/components/products/ProductForm"
import { ProductsTable } from "@/components/products/ProductsTable"
import type { OpcionCategoria } from "@/types/category"
import type { OpcionProveedor } from "@/types/provider"
import type {
  FiltrosProducto,
  ProductoEditData,
  ProductoFormPayload,
  ProductoList,
} from "@/types/product"

interface ProductsPageProps {
  onEstadoCarga?: (cargando: boolean) => void
  recargaExterna?: number
}

const FILTROS_INICIALES: FiltrosProducto = {
  texto: "",
  categoria: "",
  proveedor: "",
  soloStockBajo: false,
}

type EstadoModal =
  | { tipo: "cerrado" }
  | { tipo: "crear" }
  | { tipo: "editar"; datos: ProductoEditData }

function PaginaSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-9 w-2/3 animate-pulse rounded-lg border border-white/[0.04] bg-white/[0.03]" />
      <div className="h-96 animate-pulse rounded-2xl border border-white/[0.04] bg-white/[0.03]" />
    </div>
  )
}

function ErrorEstado({ onReintentar }: { onReintentar: () => void }) {
  return (
    <div className="rounded-2xl border border-rose-400/20 bg-white/[0.03] px-6 py-14 text-center backdrop-blur-sm">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-rose-400/20 bg-rose-500/10">
        <CircleAlert className="size-7 text-rose-300" aria-hidden />
      </div>
      <p className="mt-4 font-semibold tracking-tight text-white">
        No se pudieron cargar los productos
      </p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-zinc-500">
        Verifica que la API esté en ejecución y vuelve a intentarlo.
      </p>
      <button
        type="button"
        onClick={onReintentar}
        className="mt-5 inline-flex h-9 items-center rounded-lg bg-indigo-500 px-4 text-[13px] font-medium text-white shadow-[0_0_20px_rgba(99,102,241,0.35)] outline-none transition-colors hover:bg-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-300"
      >
        Reintentar
      </button>
    </div>
  )
}

export function ProductsPage({ onEstadoCarga, recargaExterna }: ProductsPageProps) {
  const [productos, setProductos] = useState<ProductoList[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(false)
  const [filtros, setFiltros] = useState<FiltrosProducto>(FILTROS_INICIALES)
  const [detalleId, setDetalleId] = useState<number | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)
  const [modal, setModal] = useState<EstadoModal>({ tipo: "cerrado" })
  const [categorias, setCategorias] = useState<OpcionCategoria[]>([])
  const [proveedores, setProveedores] = useState<OpcionProveedor[]>([])
  const [opcionesListas, setOpcionesListas] = useState(false)
  const [abriendoModal, setAbriendoModal] = useState(false)

  const cargar = useCallback(async () => {
    setCargando(true)
    setError(false)
    onEstadoCarga?.(true)
    try {
      const lista = await obtenerProductos()
      setProductos(lista)
    } catch {
      setError(true)
      setProductos([])
    } finally {
      setCargando(false)
      onEstadoCarga?.(false)
    }
  }, [onEstadoCarga])

  useEffect(() => {
    void cargar()
  }, [cargar, recargaExterna])

  useEffect(() => {
    if (!aviso) return
    const timer = window.setTimeout(() => setAviso(null), 4000)
    return () => window.clearTimeout(timer)
  }, [aviso])

  const cargarOpciones = useCallback(async () => {
    if (opcionesListas) return
    const [cats, provs] = await Promise.all([
      obtenerOpcionesCategorias(),
      obtenerOpcionesProveedores(),
    ])
    setCategorias(cats)
    setProveedores(provs)
    setOpcionesListas(true)
  }, [opcionesListas])

  const abrirCrear = useCallback(async () => {
    setAbriendoModal(true)
    try {
      await cargarOpciones()
      setModal({ tipo: "crear" })
    } catch {
      setAviso("No se pudieron cargar las opciones del formulario.")
    } finally {
      setAbriendoModal(false)
    }
  }, [cargarOpciones])

  const abrirEditar = useCallback(
    async (producto: ProductoList) => {
      setAbriendoModal(true)
      try {
        const [datos] = await Promise.all([
          obtenerProductoParaEditar(producto.id),
          cargarOpciones(),
        ])
        setModal({ tipo: "editar", datos })
      } catch {
        setAviso("No se pudo cargar el producto para edición.")
      } finally {
        setAbriendoModal(false)
      }
    },
    [cargarOpciones],
  )

  const guardarCrear = useCallback(
    async (payload: ProductoFormPayload & { activo: boolean }) => {
      try {
        const respuesta = await crearProducto(payload)
        setModal({ tipo: "cerrado" })
        setAviso(respuesta.message || "Producto creado correctamente.")
        await cargar()
      } catch (error) {
        throw new Error(mensajeDeError(error))
      }
    },
    [cargar],
  )

  const guardarEditar = useCallback(
    async (payload: ProductoFormPayload & { activo: boolean }) => {
      if (modal.tipo !== "editar") return
      try {
        const respuesta = await actualizarProducto(modal.datos.id, payload)
        setModal({ tipo: "cerrado" })
        setAviso(respuesta.message || "Producto actualizado correctamente.")
        await cargar()
      } catch (error) {
        throw new Error(mensajeDeError(error))
      }
    },
    [modal, cargar],
  )

  const manejarEliminar = useCallback(
    async (producto: ProductoList) => {
      try {
        const respuesta = await eliminarProducto(producto.id)
        setAviso(respuesta.message || "Producto desactivado correctamente.")
        await cargar()
      } catch {
        setAviso("No se pudo desactivar el producto.")
      }
    },
    [cargar],
  )

  const categoriasFiltro = useMemo(
    () => [...new Set(productos.map((p) => p.categoriaNombre))].sort(),
    [productos],
  )
  const proveedoresFiltro = useMemo(
    () =>
      [
        ...new Set(
          productos
            .map((p) => p.proveedorNombre)
            .filter((p): p is string => p !== null),
        ),
      ].sort(),
    [productos],
  )

  const productosFiltrados = useMemo(() => {
    const texto = filtros.texto.trim().toLowerCase()
    return productos.filter((p) => {
      if (
        texto &&
        !p.nombre.toLowerCase().includes(texto) &&
        !p.codigoSKU.toLowerCase().includes(texto)
      ) {
        return false
      }
      if (filtros.categoria && p.categoriaNombre !== filtros.categoria) {
        return false
      }
      if (filtros.proveedor && p.proveedorNombre !== filtros.proveedor) {
        return false
      }
      if (filtros.soloStockBajo && !p.stockBajo) {
        return false
      }
      return true
    })
  }, [productos, filtros])

  const filtroActivo =
    filtros.texto.trim() !== "" ||
    filtros.categoria !== "" ||
    filtros.proveedor !== "" ||
    filtros.soloStockBajo

  if (cargando) return <PaginaSkeleton />
  if (error) return <ErrorEstado onReintentar={() => void cargar()} />

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-white">
            Productos
          </h2>
          <p className="mt-0.5 text-sm text-zinc-500">
            {productosFiltrados.length} de {productos.length} productos activos
          </p>
        </div>

        <button
          type="button"
          onClick={() => void abrirCrear()}
          disabled={abriendoModal}
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-indigo-500 px-4 text-[13px] font-medium text-white shadow-[0_0_20px_rgba(99,102,241,0.35)] outline-none transition-colors hover:bg-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-300 disabled:pointer-events-none disabled:opacity-70"
        >
          <Plus className="size-4" aria-hidden />
          Nuevo producto
        </button>
      </div>

      <ProductFilters
        filtros={filtros}
        categorias={categoriasFiltro}
        proveedores={proveedoresFiltro}
        onCambiar={setFiltros}
      />

      {aviso && (
        <div
          role="status"
          className="flex items-center gap-2.5 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-[13px] text-emerald-300"
        >
          <CircleCheck className="size-4 shrink-0" aria-hidden />
          {aviso}
        </div>
      )}

      <ProductsTable
        productos={productosFiltrados}
        filtroActivo={filtroActivo}
        onVerDetalle={(p) => setDetalleId(p.id)}
        onEditar={(p) => void abrirEditar(p)}
        onEliminar={manejarEliminar}
      />

      {detalleId !== null && (
        <ProductDetailDrawer
          productoId={detalleId}
          onCerrar={() => setDetalleId(null)}
        />
      )}

      {modal.tipo === "crear" && (
        <ProductForm
          modo="crear"
          categorias={categorias}
          proveedores={proveedores}
          onGuardar={guardarCrear}
          onCancelar={() => setModal({ tipo: "cerrado" })}
        />
      )}

      {modal.tipo === "editar" && (
        <ProductForm
          modo="editar"
          inicial={modal.datos}
          categorias={categorias}
          proveedores={proveedores}
          onGuardar={guardarEditar}
          onCancelar={() => setModal({ tipo: "cerrado" })}
        />
      )}
    </div>
  )
}
