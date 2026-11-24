import { PackageCheck, TriangleAlert } from "lucide-react"
import { Panel, PanelHeader } from "@/components/dashboard/Panel"
import { SkuTag } from "@/components/dashboard/SkuTag"
import { formatearNumero } from "@/lib/format"
import type { ProductoStock } from "@/types/dashboard"

export function LowStockPanel({ productos }: { productos: ProductoStock[] }) {
  return (
    <Panel className="flex h-full flex-col">
      <PanelHeader
        titulo="Productos con stock bajo"
        descripcion="En o por debajo del stock mínimo"
      />

      {productos.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-10 text-center">
          <div className="relative">
            <div
              aria-hidden
              className="absolute inset-0 rounded-2xl bg-emerald-500/20 blur-xl"
            />
            <div className="relative flex size-14 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-500/10">
              <PackageCheck className="size-7 text-emerald-300" aria-hidden />
            </div>
          </div>
          <div>
            <p className="font-semibold tracking-tight text-white">
              Inventario saludable
            </p>
            <p className="mx-auto mt-1 max-w-60 text-xs leading-relaxed text-zinc-500">
              No hay productos por debajo del stock mínimo.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto pb-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-left text-[11px] font-medium uppercase tracking-wider text-zinc-600">
                <th className="px-6 py-2.5 font-medium">Producto</th>
                <th className="px-3 py-2.5 text-right font-medium">Stock</th>
                <th className="px-3 py-2.5 text-right font-medium">Mínimo</th>
                <th className="px-6 py-2.5 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {productos.map((prod) => (
                <tr
                  key={prod.productoId}
                  className="transition-colors hover:bg-white/[0.03]"
                >
                  <td className="px-6 py-3.5">
                    <div className="flex min-w-0 flex-col gap-1">
                      <span
                        className="max-w-44 truncate font-medium text-zinc-200"
                        title={prod.nombre}
                      >
                        {prod.nombre}
                      </span>
                      <SkuTag codigo={prod.codigoSKU} />
                    </div>
                  </td>
                  <td className="px-3 py-3.5 text-right font-mono font-medium tabular-nums text-white">
                    {formatearNumero(prod.stockActual)}
                  </td>
                  <td className="px-3 py-3.5 text-right font-mono tabular-nums text-zinc-500">
                    {formatearNumero(prod.stockMinimo)}
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-300 ring-1 ring-inset ring-amber-400/20">
                      <TriangleAlert className="size-3" aria-hidden />
                      Stock bajo
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  )
}
