import { PackageCheck, TriangleAlert } from "lucide-react"
import { Panel, PanelHeader } from "@/components/dashboard/Panel"
import { formatearNumero } from "@/lib/format"

interface StockHealthPanelProps {
  productosActivos: number
  productosCriticos: number
}

const COLOR_OK = "#059669"
const COLOR_CRITICO = "#e11d48"

export function StockHealthPanel({
  productosActivos,
  productosCriticos,
}: StockHealthPanelProps) {
  const saludables = Math.max(0, productosActivos - productosCriticos)
  const porcentaje =
    productosActivos > 0
      ? Math.round((saludables / productosActivos) * 100)
      : 100

  const radio = 56
  const circunferencia = 2 * Math.PI * radio
  const arcoSaludable = (saludables / Math.max(1, productosActivos)) * circunferencia

  return (
    <Panel className="flex h-full flex-col">
      <PanelHeader
        titulo="Estado del stock"
        descripcion="Salud del catálogo según stock mínimo"
      />

      <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 pb-6 pt-4">
        <div className="relative">
          <svg
            width="150"
            height="150"
            viewBox="0 0 150 150"
            role="img"
            aria-label={`${porcentaje}% de los productos con stock saludable`}
          >
            <circle
              cx="75"
              cy="75"
              r={radio}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="10"
            />
            <circle
              cx="75"
              cy="75"
              r={radio}
              fill="none"
              stroke={productosCriticos > 0 ? COLOR_CRITICO : "rgba(255,255,255,0.06)"}
              strokeWidth="10"
              strokeLinecap="round"
            />
            <circle
              cx="75"
              cy="75"
              r={radio}
              fill="none"
              stroke={COLOR_OK}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${arcoSaludable} ${circunferencia}`}
              transform="rotate(-90 75 75)"
              className="transition-[stroke-dasharray] duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-3xl font-semibold tabular-nums text-white">
              {porcentaje}%
            </span>
            <span className="mt-0.5 text-[11px] text-zinc-500">saludable</span>
          </div>
        </div>

        <div className="grid w-full grid-cols-2 gap-2">
          <div className="flex items-center gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2.5">
            <PackageCheck className="size-4 shrink-0 text-emerald-400" aria-hidden />
            <div className="leading-tight">
              <p className="font-mono text-sm font-semibold tabular-nums text-white">
                {formatearNumero(saludables)}
              </p>
              <p className="text-[10px] text-zinc-500">En orden</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2.5">
            <TriangleAlert className="size-4 shrink-0 text-rose-400" aria-hidden />
            <div className="leading-tight">
              <p className="font-mono text-sm font-semibold tabular-nums text-white">
                {formatearNumero(productosCriticos)}
              </p>
              <p className="text-[10px] text-zinc-500">Críticos</p>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  )
}
