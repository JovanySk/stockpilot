import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react"
import { Panel, PanelHeader } from "@/components/dashboard/Panel"
import { SkuTag } from "@/components/dashboard/SkuTag"
import { formatearFecha, formatearNumero } from "@/lib/format"
import { TipoMovimiento, type MovimientoInventario } from "@/types/dashboard"

function BadgeMovimiento({ tipo }: { tipo: TipoMovimiento }) {
  if (tipo === TipoMovimiento.Entrada) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300 ring-1 ring-inset ring-emerald-400/20">
        <ArrowDownToLine className="size-3" aria-hidden />
        Entrada
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-2.5 py-1 text-[11px] font-medium text-indigo-300 ring-1 ring-inset ring-indigo-400/20">
      <ArrowUpFromLine className="size-3" aria-hidden />
      Salida
    </span>
  )
}

export function LastMovementsTable({
  movimientos,
  filtroActivo = false,
}: {
  movimientos: MovimientoInventario[]
  filtroActivo?: boolean
}) {
  return (
    <Panel>
      <PanelHeader
        titulo="Últimos movimientos"
        descripcion="Entradas y salidas más recientes del inventario"
      />

      {movimientos.length === 0 ? (
        <p className="px-6 py-12 text-center text-sm text-zinc-500">
          {filtroActivo
            ? "Ningún movimiento coincide con la búsqueda."
            : "Aún no hay movimientos registrados."}
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto pb-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-left text-[11px] font-medium uppercase tracking-wider text-zinc-600">
                <th className="px-6 py-2.5 font-medium">Producto</th>
                <th className="px-3 py-2.5 font-medium">SKU</th>
                <th className="px-3 py-2.5 font-medium">Tipo</th>
                <th className="px-3 py-2.5 text-right font-medium">Cantidad</th>
                <th className="hidden px-3 py-2.5 font-medium lg:table-cell">
                  Motivo
                </th>
                <th className="hidden px-6 py-2.5 text-right font-medium sm:table-cell">
                  Fecha
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {movimientos.map((mov) => (
                <tr
                  key={mov.id}
                  className="transition-colors hover:bg-white/[0.03]"
                >
                  <td className="px-6 py-3.5">
                    <span
                      className="block max-w-52 truncate font-medium text-zinc-200"
                      title={mov.productoNombre}
                    >
                      {mov.productoNombre}
                    </span>
                  </td>
                  <td className="px-3 py-3.5">
                    <SkuTag codigo={mov.codigoSKU} />
                  </td>
                  <td className="px-3 py-3.5">
                    <BadgeMovimiento tipo={mov.tipoMovimiento} />
                  </td>
                  <td className="px-3 py-3.5 text-right font-mono font-medium tabular-nums text-white">
                    {formatearNumero(mov.cantidad)}
                  </td>
                  <td
                    className="hidden max-w-56 truncate px-3 py-3.5 text-xs text-zinc-500 lg:table-cell"
                    title={mov.motivo}
                  >
                    {mov.motivo}
                  </td>
                  <td className="hidden whitespace-nowrap px-6 py-3.5 text-right text-xs text-zinc-500 sm:table-cell">
                    {formatearFecha(mov.fechaMovimiento)}
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
