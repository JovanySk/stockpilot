import { Gauge, PackageCheck, TriangleAlert } from "lucide-react"
import { Panel, PanelHeader } from "@/components/dashboard/Panel"
import { SkuTag } from "@/components/dashboard/SkuTag"
import { formatearNumero } from "@/lib/format"
import type { ProductoList } from "@/types/product"
import { cn } from "@/lib/utils"

interface ProductStockPanelProps {
  producto: ProductoList | null
  stockActual: number | null
  cargando: boolean
}

export function ProductStockPanel({
  producto,
  stockActual,
  cargando,
}: ProductStockPanelProps) {
  return (
    <Panel className="flex h-full flex-col">
      <PanelHeader
        titulo="Stock del producto"
        descripcion="Calculado desde los movimientos"
      />

      {producto === null ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-10 text-center">
          <div className="flex size-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
            <Gauge className="size-6 text-zinc-500" aria-hidden />
          </div>
          <p className="max-w-52 text-sm text-zinc-500">
            Selecciona un producto para consultar su stock.
          </p>
        </div>
      ) : cargando || stockActual === null ? (
        <div className="flex-1 space-y-3 px-6 pb-6 pt-4">
          <div className="h-20 animate-pulse rounded-xl bg-white/[0.04]" />
          <div className="h-12 animate-pulse rounded-xl bg-white/[0.04]" />
        </div>
      ) : (
        (() => {
          const stockBajo = stockActual <= producto.stockMinimo
          return (
            <div className="flex-1 space-y-4 px-6 pb-6 pt-4">
              <div>
                <p
                  className="truncate text-sm font-medium text-zinc-200"
                  title={producto.nombre}
                >
                  {producto.nombre}
                </p>
                <div className="mt-1.5">
                  <SkuTag codigo={producto.codigoSKU} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div
                  className={cn(
                    "rounded-xl border px-4 py-3.5",
                    stockBajo
                      ? "border-amber-400/25 bg-amber-500/10"
                      : "border-emerald-400/20 bg-emerald-500/[0.07]",
                  )}
                >
                  <p className="text-[11px] text-zinc-400">Stock actual</p>
                  <p
                    className={cn(
                      "mt-1 font-mono text-2xl font-semibold tabular-nums",
                      stockBajo ? "text-amber-300" : "text-emerald-300",
                    )}
                  >
                    {formatearNumero(stockActual)}
                  </p>
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3.5">
                  <p className="text-[11px] text-zinc-400">Stock mínimo</p>
                  <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-zinc-300">
                    {formatearNumero(producto.stockMinimo)}
                  </p>
                </div>
              </div>

              {stockBajo ? (
                <div className="flex items-center gap-2.5 rounded-xl border border-amber-400/25 bg-amber-500/10 px-4 py-3 text-[13px] text-amber-300">
                  <TriangleAlert className="size-4 shrink-0" aria-hidden />
                  Stock en o por debajo del mínimo. Requiere reabastecimiento.
                </div>
              ) : (
                <div className="flex items-center gap-2.5 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-[13px] text-emerald-300">
                  <PackageCheck className="size-4 shrink-0" aria-hidden />
                  Stock saludable, por encima del mínimo.
                </div>
              )}
            </div>
          )
        })()
      )}
    </Panel>
  )
}
