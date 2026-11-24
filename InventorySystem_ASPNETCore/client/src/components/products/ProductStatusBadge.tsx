import { CircleCheck, CircleOff } from "lucide-react"

export function ProductStatusBadge({ activo }: { activo: boolean }) {
  if (activo) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300 ring-1 ring-inset ring-emerald-400/20">
        <CircleCheck className="size-3" aria-hidden />
        Activo
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-500/10 px-2.5 py-1 text-[11px] font-medium text-zinc-400 ring-1 ring-inset ring-zinc-400/20">
      <CircleOff className="size-3" aria-hidden />
      Inactivo
    </span>
  )
}
