import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react"
import { TipoMovimiento } from "@/types/dashboard"

export function MovementTypeBadge({ tipo }: { tipo: TipoMovimiento }) {
  if (tipo === TipoMovimiento.Entrada) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300 ring-1 ring-inset ring-emerald-400/20">
        <ArrowDownToLine className="size-3" aria-hidden />
        Entrada
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-1 text-[11px] font-medium text-rose-300 ring-1 ring-inset ring-rose-400/20">
      <ArrowUpFromLine className="size-3" aria-hidden />
      Salida
    </span>
  )
}
