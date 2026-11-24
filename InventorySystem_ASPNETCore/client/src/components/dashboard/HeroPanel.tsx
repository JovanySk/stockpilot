import {
  CircleDollarSign,
  Layers,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react"
import { formatearMoneda, formatearNumero } from "@/lib/format"
import { cn } from "@/lib/utils"

interface HeroPanelProps {
  unidades: number
  valorInventario: number
  productosCriticos: number
}

interface HighlightProps {
  icono: React.ComponentType<{ className?: string }>
  valor: string
  etiqueta: string
  alerta?: boolean
}

function Highlight({ icono: Icono, valor, etiqueta, alerta }: HighlightProps) {
  return (
    <div className="group flex items-center gap-3.5 rounded-xl border border-white/[0.08] bg-white/[0.05] px-5 py-4 backdrop-blur-md transition-all duration-200 hover:border-white/20 hover:bg-white/[0.08]">
      <div
        className={cn(
          "relative flex size-9 shrink-0 items-center justify-center rounded-lg",
          alerta ? "bg-amber-400/15" : "bg-indigo-400/15",
        )}
      >
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 rounded-lg blur-md transition-opacity opacity-60 group-hover:opacity-100",
            alerta ? "bg-amber-400/25" : "bg-indigo-400/25",
          )}
        />
        <Icono
          className={cn(
            "relative size-4",
            alerta ? "text-amber-300" : "text-indigo-300",
          )}
          aria-hidden
        />
      </div>
      <div className="leading-tight">
        <p className="font-mono text-[15px] font-semibold tabular-nums text-white">
          {valor}
        </p>
        <p className="mt-0.5 text-[11px] text-zinc-400">{etiqueta}</p>
      </div>
    </div>
  )
}

export function HeroPanel({
  unidades,
  valorInventario,
  productosCriticos,
}: HeroPanelProps) {
  return (
    <section
      aria-label="Resumen del inventario"
      className="relative h-full overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#141432] via-[#0d0d1f] to-[#080810] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.4)] md:p-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 70% 20%, black 30%, transparent 75%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-24 size-80 rounded-full bg-indigo-500/25 blur-[110px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-28 left-1/4 size-72 rounded-full bg-violet-600/20 blur-[110px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-8 top-16 size-40 rounded-full bg-cyan-400/10 blur-[80px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-indigo-300/50 to-transparent"
      />

      <div className="relative">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/25 bg-indigo-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-300">
            <span
              aria-hidden
              className="size-1.5 rounded-full bg-indigo-300 shadow-[0_0_8px_rgba(165,180,252,0.9)]"
            />
            StockPilot
          </span>
        </div>

        <h2 className="mt-4 text-2xl font-semibold leading-tight tracking-tight text-white md:text-[30px]">
          Panel de control de inventario
        </h2>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-zinc-400">
          Monitorea existencias, movimientos y valor operativo en tiempo real.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <Highlight
            icono={Layers}
            valor={`${formatearNumero(unidades)} unidades`}
            etiqueta="En existencia"
          />
          <Highlight
            icono={CircleDollarSign}
            valor={`${formatearMoneda(valorInventario)} MXN`}
            etiqueta="Valor del inventario"
          />
          <Highlight
            icono={productosCriticos > 0 ? TriangleAlert : ShieldCheck}
            valor={`${formatearNumero(productosCriticos)} productos críticos`}
            etiqueta={
              productosCriticos > 0 ? "Requieren atención" : "Stock saludable"
            }
            alerta={productosCriticos > 0}
          />
        </div>
      </div>
    </section>
  )
}
