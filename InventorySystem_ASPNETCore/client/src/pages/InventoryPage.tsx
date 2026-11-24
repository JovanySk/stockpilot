import { useCallback, useEffect, useState } from "react"
import { CircleAlert, CircleCheck } from "lucide-react"
import {
  obtenerMovimientosProducto,
  obtenerStockInventario,
} from "@/api/inventoryApi"
import { obtenerProductos } from "@/api/productsApi"
import { MovementForm } from "@/components/inventory/MovementForm"
import { MovementHistoryTable } from "@/components/inventory/MovementHistoryTable"
import { ProductStockPanel } from "@/components/inventory/ProductStockPanel"
import type { MovimientoInventario } from "@/types/inventory"
import type { ProductoList } from "@/types/product"

interface InventoryPageProps {
  onEstadoCarga?: (cargando: boolean) => void
  recargaExterna?: number
}

const claseSelect =
  "h-10 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 text-[13px] text-zinc-200 outline-none transition-colors hover:border-white/20 focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/20 [&>option]:bg-[#12121f] [&>option]:text-zinc-200"

function ErrorEstado({ onReintentar }: { onReintentar: () => void }) {
  return (
    <div className="rounded-2xl border border-rose-400/20 bg-white/[0.03] px-6 py-14 text-center backdrop-blur-sm">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-rose-400/20 bg-rose-500/10">
        <CircleAlert className="size-7 text-rose-300" aria-hidden />
      </div>
      <p className="mt-4 font-semibold tracking-tight text-white">
        No se pudo cargar el inventario
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

export function InventoryPage({
  onEstadoCarga,
  recargaExterna,
}: InventoryPageProps) {
  const [productos, setProductos] = useState<ProductoList[]>([])
  const [cargandoProductos, setCargandoProductos] = useState(true)
  const [error, setError] = useState(false)
  const [productoId, setProductoId] = useState<number | null>(null)
  const [stockActual, setStockActual] = useState<number | null>(null)
  const [movimientos, setMovimientos] = useState<MovimientoInventario[]>([])
  const [cargandoDetalle, setCargandoDetalle] = useState(false)
  const [aviso, setAviso] = useState<string | null>(null)

  const producto = productos.find((p) => p.id === productoId) ?? null

  const cargarProductos = useCallback(async () => {
    setCargandoProductos(true)
    setError(false)
    onEstadoCarga?.(true)
    try {
      const lista = await obtenerProductos()
      setProductos(lista)
    } catch {
      setError(true)
      setProductos([])
    } finally {
      setCargandoProductos(false)
      onEstadoCarga?.(false)
    }
  }, [onEstadoCarga])

  const cargarDetalleProducto = useCallback(async (id: number) => {
    setCargandoDetalle(true)
    try {
      const [stock, historial] = await Promise.all([
        obtenerStockInventario(id),
        obtenerMovimientosProducto(id),
      ])
      setStockActual(stock.stock)
      setMovimientos(historial)
    } catch {
      setStockActual(null)
      setMovimientos([])
      setAviso("No se pudo cargar la información del producto.")
    } finally {
      setCargandoDetalle(false)
    }
  }, [])

  useEffect(() => {
    void cargarProductos()
  }, [cargarProductos, recargaExterna])

  useEffect(() => {
    if (productoId === null) {
      setStockActual(null)
      setMovimientos([])
      return
    }
    void cargarDetalleProducto(productoId)
  }, [productoId, cargarDetalleProducto, recargaExterna])

  useEffect(() => {
    if (!aviso) return
    const timer = window.setTimeout(() => setAviso(null), 4000)
    return () => window.clearTimeout(timer)
  }, [aviso])

  const manejarRegistrado = useCallback(
    (mensaje: string) => {
      setAviso(mensaje)
      void cargarProductos()
      if (productoId !== null) {
        void cargarDetalleProducto(productoId)
      }
    },
    [cargarProductos, cargarDetalleProducto, productoId],
  )

  if (cargandoProductos && productos.length === 0 && !error) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-1/2 animate-pulse rounded-lg border border-white/[0.04] bg-white/[0.03]" />
        <div className="grid gap-6 xl:grid-cols-3">
          <div className="h-96 animate-pulse rounded-2xl border border-white/[0.04] bg-white/[0.03] xl:col-span-2" />
          <div className="h-96 animate-pulse rounded-2xl border border-white/[0.04] bg-white/[0.03]" />
        </div>
      </div>
    )
  }

  if (error) {
    return <ErrorEstado onReintentar={() => void cargarProductos()} />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-white">
            Inventario
          </h2>
          <p className="mt-0.5 text-sm text-zinc-500">
            Registra entradas y salidas; el stock se calcula por movimientos
          </p>
        </div>
      </div>

      <div className="max-w-xl">
        <label
          htmlFor="selector-producto"
          className="mb-1.5 block text-[12px] font-medium text-zinc-400"
        >
          Producto <span className="text-indigo-300">*</span>
        </label>
        <select
          id="selector-producto"
          value={productoId ?? ""}
          onChange={(e) =>
            setProductoId(e.target.value ? Number(e.target.value) : null)
          }
          className={claseSelect}
        >
          <option value="">Selecciona un producto…</option>
          {productos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre} — {p.codigoSKU}
            </option>
          ))}
        </select>
      </div>

      {aviso && (
        <div
          role="status"
          className="flex items-center gap-2.5 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-[13px] text-emerald-300"
        >
          <CircleCheck className="size-4 shrink-0" aria-hidden />
          {aviso}
        </div>
      )}

      <div className="grid items-stretch gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <MovementForm
            producto={producto}
            stockActual={stockActual}
            onRegistrado={manejarRegistrado}
          />
        </div>
        <ProductStockPanel
          producto={producto}
          stockActual={stockActual}
          cargando={cargandoDetalle}
        />
      </div>

      <MovementHistoryTable
        movimientos={movimientos}
        productoSeleccionado={producto !== null}
        cargando={cargandoDetalle}
      />
    </div>
  )
}
