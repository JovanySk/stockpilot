import { PackageCheck, TriangleAlert } from "lucide-react"

export function ProductStockBadge({ stockBajo }: { stockBajo: boolean }) {
  if (stockBajo) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-300 ring-1 ring-inset ring-amber-400/20">
        <TriangleAlert className="size-3" aria-hidden />
        Stock bajo
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300 ring-1 ring-inset ring-emerald-400/20">
      <PackageCheck className="size-3" aria-hidden />
      Saludable
    </span>
  )
}
