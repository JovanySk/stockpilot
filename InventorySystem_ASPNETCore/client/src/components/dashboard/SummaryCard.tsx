import { cn } from "@/lib/utils"

export type AcentoCard =
  | "indigo"
  | "cyan"
  | "violet"
  | "amber"
  | "teal"
  | "emerald"

const acentos: Record<
  AcentoCard,
  { badge: string; icono: string; glow: string; borde: string; linea: string }
> = {
  indigo: {
    badge: "bg-indigo-500/15",
    icono: "text-indigo-300",
    glow: "bg-indigo-500/20",
    borde: "hover:border-indigo-400/30",
    linea: "from-indigo-400/60",
  },
  cyan: {
    badge: "bg-cyan-500/15",
    icono: "text-cyan-300",
    glow: "bg-cyan-500/20",
    borde: "hover:border-cyan-400/30",
    linea: "from-cyan-400/60",
  },
  violet: {
    badge: "bg-violet-500/15",
    icono: "text-violet-300",
    glow: "bg-violet-500/20",
    borde: "hover:border-violet-400/30",
    linea: "from-violet-400/60",
  },
  amber: {
    badge: "bg-amber-500/15",
    icono: "text-amber-300",
    glow: "bg-amber-500/20",
    borde: "hover:border-amber-400/30",
    linea: "from-amber-400/60",
  },
  teal: {
    badge: "bg-teal-500/15",
    icono: "text-teal-300",
    glow: "bg-teal-500/20",
    borde: "hover:border-teal-400/30",
    linea: "from-teal-400/60",
  },
  emerald: {
    badge: "bg-emerald-500/15",
    icono: "text-emerald-300",
    glow: "bg-emerald-500/20",
    borde: "hover:border-emerald-400/30",
    linea: "from-emerald-400/60",
  },
}

interface SummaryCardProps {
  titulo: string
  valor: string
  icono: React.ComponentType<{ className?: string }>
  acento: AcentoCard
  descripcion?: string
  alerta?: boolean
}

export function SummaryCard({
  titulo,
  valor,
  icono: Icono,
  acento,
  descripcion,
  alerta,
}: SummaryCardProps) {
  const estilos = acentos[acento]

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)]",
        estilos.borde,
      )}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r to-transparent",
          estilos.linea,
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -right-10 -top-10 size-32 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100",
          estilos.glow,
        )}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-zinc-500">{titulo}</p>
          <p
            className={cn(
              "mt-2.5 font-mono text-[26px] font-semibold leading-none tabular-nums tracking-tight",
              alerta ? "text-amber-300" : "text-white",
            )}
          >
            {valor}
          </p>
          {descripcion && (
            <p className="mt-2.5 truncate text-[11px] text-zinc-600">
              {descripcion}
            </p>
          )}
        </div>

        <div
          className={cn(
            "relative flex size-10 shrink-0 items-center justify-center rounded-xl",
            estilos.badge,
          )}
        >
          <div
            aria-hidden
            className={cn(
              "absolute inset-0 rounded-xl blur-md",
              estilos.glow,
            )}
          />
          <Icono className={cn("relative size-[18px]", estilos.icono)} aria-hidden />
        </div>
      </div>
    </div>
  )
}
