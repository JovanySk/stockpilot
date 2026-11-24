import { useCallback, useEffect, useMemo, useState } from "react"
import {
  Boxes,
  CircleAlert,
  CircleDollarSign,
  FolderTree,
  Layers,
  TriangleAlert,
  Truck,
} from "lucide-react"
import { obtenerResumenDashboard } from "@/api/dashboardApi"
import { AnalyticsPanel } from "@/components/dashboard/AnalyticsPanel"
import { HeroPanel } from "@/components/dashboard/HeroPanel"
import { LastMovementsTable } from "@/components/dashboard/LastMovementsTable"
import { LowStockPanel } from "@/components/dashboard/LowStockPanel"
import { StockHealthPanel } from "@/components/dashboard/StockHealthPanel"
import { SummaryCard } from "@/components/dashboard/SummaryCard"
import { formatearMoneda, formatearNumero } from "@/lib/format"
import type { DashboardResumen } from "@/types/dashboard"

interface DashboardPageProps {
  onEstadoCarga?: (cargando: boolean) => void
  recargaExterna?: number
  busqueda?: string
}

function BloqueSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-2xl border border-white/[0.04] bg-white/[0.03] ${className ?? ""}`}
    />
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-3">
        <BloqueSkeleton className="h-72 xl:col-span-2" />
        <BloqueSkeleton className="h-72" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <BloqueSkeleton key={i} className="h-28" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <BloqueSkeleton className="h-80 xl:col-span-2" />
        <BloqueSkeleton className="h-80" />
      </div>
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
        No se pudo cargar el dashboard
      </p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-zinc-500">
        Verifica que la API esté en ejecución en{" "}
        <code className="font-mono text-xs text-zinc-400">
          http://localhost:5116
        </code>{" "}
        y vuelve a intentarlo.
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

export function DashboardPage({
  onEstadoCarga,
  recargaExterna,
  busqueda = "",
}: DashboardPageProps) {
  const [datos, setDatos] = useState<DashboardResumen | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(false)

  const cargar = useCallback(async () => {
    setCargando(true)
    setError(false)
    onEstadoCarga?.(true)
    try {
      const resumen = await obtenerResumenDashboard()
      setDatos(resumen)
    } catch {
      setError(true)
      setDatos(null)
    } finally {
      setCargando(false)
      onEstadoCarga?.(false)
    }
  }, [onEstadoCarga])

  useEffect(() => {
    void cargar()
  }, [cargar, recargaExterna])

  const filtro = busqueda.trim().toLowerCase()

  const movimientosFiltrados = useMemo(() => {
    if (!datos) return []
    if (!filtro) return datos.ultimosMovimientos
    return datos.ultimosMovimientos.filter(
      (m) =>
        m.productoNombre.toLowerCase().includes(filtro) ||
        m.codigoSKU.toLowerCase().includes(filtro),
    )
  }, [datos, filtro])

  const stockBajoFiltrado = useMemo(() => {
    if (!datos) return []
    if (!filtro) return datos.productosStockBajo
    return datos.productosStockBajo.filter(
      (p) =>
        p.nombre.toLowerCase().includes(filtro) ||
        p.codigoSKU.toLowerCase().includes(filtro),
    )
  }, [datos, filtro])

  if (cargando) return <DashboardSkeleton />
  if (error || !datos) return <ErrorEstado onReintentar={() => void cargar()} />

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <HeroPanel
            unidades={datos.totalUnidadesEnInventario}
            valorInventario={datos.valorTotalInventario}
            productosCriticos={datos.totalProductosStockBajo}
          />
        </div>
        <StockHealthPanel
          productosActivos={datos.totalProductosActivos}
          productosCriticos={datos.totalProductosStockBajo}
        />
      </div>

      <section
        aria-label="Indicadores generales"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        <SummaryCard
          titulo="Productos activos"
          valor={formatearNumero(datos.totalProductosActivos)}
          icono={Boxes}
          acento="indigo"
          descripcion="Productos disponibles en catálogo"
        />
        <SummaryCard
          titulo="Categorías activas"
          valor={formatearNumero(datos.totalCategoriasActivas)}
          icono={FolderTree}
          acento="cyan"
          descripcion="Líneas de producto en operación"
        />
        <SummaryCard
          titulo="Proveedores activos"
          valor={formatearNumero(datos.totalProveedoresActivos)}
          icono={Truck}
          acento="violet"
          descripcion="Socios de abastecimiento"
        />
        <SummaryCard
          titulo="Stock bajo"
          valor={formatearNumero(datos.totalProductosStockBajo)}
          icono={TriangleAlert}
          acento="amber"
          alerta={datos.totalProductosStockBajo > 0}
          descripcion={
            datos.totalProductosStockBajo > 0
              ? "Requieren reabastecimiento"
              : "Todo sobre el mínimo"
          }
        />
        <SummaryCard
          titulo="Unidades en inventario"
          valor={formatearNumero(datos.totalUnidadesEnInventario)}
          icono={Layers}
          acento="teal"
          descripcion="Existencias totales en almacén"
        />
        <SummaryCard
          titulo="Valor del inventario"
          valor={formatearMoneda(datos.valorTotalInventario)}
          icono={CircleDollarSign}
          acento="emerald"
          descripcion="Valuación a precio de venta"
        />
      </section>

      <div className="grid items-stretch gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <AnalyticsPanel movimientos={datos.ultimosMovimientos} />
        </div>
        <LowStockPanel productos={stockBajoFiltrado} />
      </div>

      <LastMovementsTable
        movimientos={movimientosFiltrados}
        filtroActivo={filtro.length > 0}
      />
    </div>
  )
}
