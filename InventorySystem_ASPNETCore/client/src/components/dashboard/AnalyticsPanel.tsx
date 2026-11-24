import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { ArrowDownToLine, ArrowUpFromLine, Info } from "lucide-react"
import { Panel, PanelHeader } from "@/components/dashboard/Panel"
import { SkuTag } from "@/components/dashboard/SkuTag"
import { formatearNumero } from "@/lib/format"
import { TipoMovimiento, type MovimientoInventario } from "@/types/dashboard"

// Palette validated with the dataviz six-checks against surface #0f101c (dark):
// deutan ΔE 84.3, contrast >= 3:1, lightness band OK.
const COLOR_ENTRADAS = "#059669"
const COLOR_SALIDAS = "#6366f1"

interface PuntoDia {
  dia: string
  entradas: number
  salidas: number
}

interface ActividadProducto {
  nombre: string
  codigoSKU: string
  entradas: number
  salidas: number
  total: number
}

const formatoDia = new Intl.DateTimeFormat("es-MX", {
  day: "2-digit",
  month: "short",
})

function agruparPorDia(movimientos: MovimientoInventario[]): PuntoDia[] {
  const mapa = new Map<string, PuntoDia>()

  for (const mov of movimientos) {
    const fecha = new Date(mov.fechaMovimiento)
    if (Number.isNaN(fecha.getTime())) continue

    const clave = fecha.toISOString().slice(0, 10)
    const punto = mapa.get(clave) ?? {
      dia: formatoDia.format(fecha),
      entradas: 0,
      salidas: 0,
    }

    if (mov.tipoMovimiento === TipoMovimiento.Entrada) {
      punto.entradas += mov.cantidad
    } else {
      punto.salidas += mov.cantidad
    }
    mapa.set(clave, punto)
  }

  return [...mapa.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, punto]) => punto)
}

function actividadPorProducto(
  movimientos: MovimientoInventario[],
): ActividadProducto[] {
  const mapa = new Map<number, ActividadProducto>()

  for (const mov of movimientos) {
    const item = mapa.get(mov.productoId) ?? {
      nombre: mov.productoNombre,
      codigoSKU: mov.codigoSKU,
      entradas: 0,
      salidas: 0,
      total: 0,
    }
    if (mov.tipoMovimiento === TipoMovimiento.Entrada) {
      item.entradas += mov.cantidad
    } else {
      item.salidas += mov.cantidad
    }
    item.total = item.entradas + item.salidas
    mapa.set(mov.productoId, item)
  }

  return [...mapa.values()].sort((a, b) => b.total - a.total).slice(0, 6)
}

function GraficaDiaria({ datos }: { datos: PuntoDia[] }) {
  return (
    <div className="flex-1 px-4 pb-4 pt-2">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={datos} barGap={2} barSize={18}>
          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="dia"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#71717a", fontSize: 11 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            width={36}
            tick={{ fill: "#71717a", fontSize: 11 }}
          />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.04)" }}
            contentStyle={{
              backgroundColor: "#12121f",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10,
              fontSize: 12,
              color: "#e4e4e7",
            }}
            labelStyle={{ color: "#a1a1aa" }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 12, color: "#a1a1aa" }}
          />
          <Bar
            dataKey="entradas"
            name="Entradas"
            fill={COLOR_ENTRADAS}
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="salidas"
            name="Salidas"
            fill={COLOR_SALIDAS}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function ActividadProductos({
  actividad,
}: {
  actividad: ActividadProducto[]
}) {
  const maximo = Math.max(1, ...actividad.map((a) => a.total))

  return (
    <div className="flex-1 space-y-4 px-6 pb-6 pt-3">
      {actividad.map((item) => (
        <div key={item.codigoSKU}>
          <div className="flex items-baseline justify-between gap-3">
            <span
              className="min-w-0 truncate text-[13px] font-medium text-zinc-200"
              title={item.nombre}
            >
              {item.nombre}
            </span>
            <span className="shrink-0 font-mono text-[13px] font-semibold tabular-nums text-white">
              {formatearNumero(item.total)}
            </span>
          </div>
          <div className="mt-1.5 flex items-center gap-3">
            <SkuTag codigo={item.codigoSKU} />
            <div
              className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.05]"
              role="img"
              aria-label={`${item.nombre}: ${item.entradas} entradas, ${item.salidas} salidas`}
            >
              <div
                className="flex h-full"
                style={{ width: `${(item.total / maximo) * 100}%` }}
              >
                {item.entradas > 0 && (
                  <div
                    className="h-full rounded-l-full"
                    style={{
                      backgroundColor: COLOR_ENTRADAS,
                      width: `${(item.entradas / item.total) * 100}%`,
                      boxShadow: "0 0 12px rgba(5,150,105,0.45)",
                    }}
                  />
                )}
                {item.salidas > 0 && (
                  <div
                    className="h-full rounded-r-full"
                    style={{
                      backgroundColor: COLOR_SALIDAS,
                      width: `${(item.salidas / item.total) * 100}%`,
                      boxShadow: "0 0 12px rgba(99,102,241,0.45)",
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/[0.06] pt-4">
        <span className="inline-flex items-center gap-1.5 text-[11px] text-zinc-400">
          <ArrowDownToLine
            className="size-3"
            style={{ color: COLOR_ENTRADAS }}
            aria-hidden
          />
          Entradas
        </span>
        <span className="inline-flex items-center gap-1.5 text-[11px] text-zinc-400">
          <ArrowUpFromLine
            className="size-3"
            style={{ color: COLOR_SALIDAS }}
            aria-hidden
          />
          Salidas
        </span>
        <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] text-zinc-600">
          <Info className="size-3" aria-hidden />
          Historial insuficiente para tendencia diaria
        </span>
      </div>
    </div>
  )
}

export function AnalyticsPanel({
  movimientos,
}: {
  movimientos: MovimientoInventario[]
}) {
  const porDia = agruparPorDia(movimientos)
  const tieneHistorial = porDia.length >= 2

  return (
    <Panel className="flex h-full min-h-80 flex-col">
      <PanelHeader
        titulo={
          tieneHistorial
            ? "Tendencia de movimientos"
            : "Actividad de inventario"
        }
        descripcion={
          tieneHistorial
            ? "Unidades por día según los últimos movimientos"
            : "Unidades movidas por producto en los últimos movimientos"
        }
      />

      {movimientos.length === 0 ? (
        <p className="flex flex-1 items-center justify-center px-6 py-12 text-sm text-zinc-500">
          Aún no hay movimientos registrados.
        </p>
      ) : tieneHistorial ? (
        <GraficaDiaria datos={porDia} />
      ) : (
        <ActividadProductos actividad={actividadPorProducto(movimientos)} />
      )}
    </Panel>
  )
}
