import { History } from "lucide-react"
import { Panel, PanelHeader } from "@/components/dashboard/Panel"
import { MovementTypeBadge } from "@/components/inventory/MovementTypeBadge"
import { formatearFecha, formatearNumero } from "@/lib/format"
import type { MovimientoInventario } from "@/types/inventory"

interface MovementHistoryTableProps {
  movimientos: MovimientoInventario[]
  productoSeleccionado: boolean
  cargando: boolean
}

export function MovementHistoryTable({
  movimientos,
  productoSeleccionado,
  cargando,
}: MovementHistoryTableProps) {
  return (
    <Panel>
      <PanelHeader
        titulo="Historial de movimientos"
        descripcion={
          productoSeleccionado
            ? "Movimientos registrados del producto seleccionado"
            : "Selecciona un producto para ver su historial"
        }
      />

      {!productoSeleccionado ? (
        <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
          <div className="flex size-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
            <History className="size-6 text-zinc-500" aria-hidden />
          </div>
          <p className="max-w-60 text-sm text-zinc-500">
            El historial del producto aparecerá aquí.
          </p>
        </div>
      ) : cargando ? (
        <div className="space-y-2 px-6 pb-6 pt-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={i}
              className="h-11 animate-pulse rounded-lg bg-white/[0.04]"
            />
          ))}
        </div>
      ) : movimientos.length === 0 ? (
        <p className="px-6 py-12 text-center text-sm text-zinc-500">
          Este producto aún no tiene movimientos registrados.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto pb-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-left text-[11px] font-medium uppercase tracking-wider text-zinc-600">
                <th className="px-6 py-2.5 font-medium">Fecha</th>
                <th className="px-3 py-2.5 font-medium">Tipo</th>
                <th className="px-3 py-2.5 text-right font-medium">Cantidad</th>
                <th className="px-3 py-2.5 font-medium">Motivo</th>
                <th className="hidden px-3 py-2.5 font-medium md:table-cell">
                  Usuario
                </th>
                <th className="hidden px-6 py-2.5 font-medium lg:table-cell">
                  Observaciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {movimientos.map((mov) => (
                <tr
                  key={mov.id}
                  className="transition-colors hover:bg-white/[0.03]"
                >
                  <td className="whitespace-nowrap px-6 py-3.5 text-xs text-zinc-400">
                    {formatearFecha(mov.fechaMovimiento)}
                  </td>
                  <td className="px-3 py-3.5">
                    <MovementTypeBadge tipo={mov.tipoMovimiento} />
                  </td>
                  <td className="px-3 py-3.5 text-right font-mono text-[13px] font-medium tabular-nums text-white">
                    {formatearNumero(mov.cantidad)}
                  </td>
                  <td
                    className="max-w-48 truncate px-3 py-3.5 text-[13px] text-zinc-300"
                    title={mov.motivo}
                  >
                    {mov.motivo}
                  </td>
                  <td className="hidden whitespace-nowrap px-3 py-3.5 text-[13px] text-zinc-500 md:table-cell">
                    {mov.usuarioRegistro ?? "—"}
                  </td>
                  <td
                    className="hidden max-w-64 truncate px-6 py-3.5 text-xs text-zinc-500 lg:table-cell"
                    title={mov.observaciones ?? undefined}
                  >
                    {mov.observaciones ?? "—"}
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
