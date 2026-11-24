import { useState } from "react"
import { Check, FolderX, Pencil, Trash2, X } from "lucide-react"
import { Panel } from "@/components/dashboard/Panel"
import { formatearFecha, formatearNumero } from "@/lib/format"
import type { Categoria } from "@/types/category"

interface CategoriesTableProps {
  categorias: Categoria[]
  filtroActivo: boolean
  onEditar: (categoria: Categoria) => void
  onEliminar: (categoria: Categoria) => Promise<void>
}

function AccionesFila({
  categoria,
  onEditar,
  onEliminar,
}: {
  categoria: Categoria
  onEditar: (categoria: Categoria) => void
  onEliminar: (categoria: Categoria) => Promise<void>
}) {
  const [confirmando, setConfirmando] = useState(false)
  const [eliminando, setEliminando] = useState(false)

  if (confirmando) {
    return (
      <div className="flex items-center justify-end gap-1.5">
        <span className="mr-1 text-[11px] text-zinc-500">¿Desactivar?</span>
        <button
          type="button"
          disabled={eliminando}
          onClick={async () => {
            setEliminando(true)
            try {
              await onEliminar(categoria)
            } finally {
              setEliminando(false)
              setConfirmando(false)
            }
          }}
          aria-label={`Confirmar desactivación de ${categoria.nombre}`}
          className="flex size-7 items-center justify-center rounded-md bg-rose-500/15 text-rose-300 ring-1 ring-inset ring-rose-400/30 transition-colors hover:bg-rose-500/25 disabled:opacity-50"
        >
          <Check className="size-3.5" aria-hidden />
        </button>
        <button
          type="button"
          disabled={eliminando}
          onClick={() => setConfirmando(false)}
          aria-label="Cancelar"
          className="flex size-7 items-center justify-center rounded-md text-zinc-400 ring-1 ring-inset ring-white/10 transition-colors hover:bg-white/5 hover:text-white"
        >
          <X className="size-3.5" aria-hidden />
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-end gap-1.5">
      <button
        type="button"
        onClick={() => onEditar(categoria)}
        aria-label={`Editar ${categoria.nombre}`}
        title="Editar categoría"
        className="flex size-7 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
      >
        <Pencil className="size-3.5" aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => setConfirmando(true)}
        aria-label={`Desactivar ${categoria.nombre}`}
        title="Desactivar categoría"
        className="flex size-7 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-rose-500/15 hover:text-rose-300"
      >
        <Trash2 className="size-3.5" aria-hidden />
      </button>
    </div>
  )
}

export function CategoriesTable({
  categorias,
  filtroActivo,
  onEditar,
  onEliminar,
}: CategoriesTableProps) {
  if (categorias.length === 0) {
    return (
      <Panel>
        <div className="flex flex-col items-center gap-4 px-6 py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
            <FolderX className="size-7 text-zinc-500" aria-hidden />
          </div>
          <div>
            <p className="font-semibold tracking-tight text-white">
              {filtroActivo ? "Sin resultados" : "No hay categorías registradas"}
            </p>
            <p className="mx-auto mt-1 max-w-64 text-sm text-zinc-500">
              {filtroActivo
                ? "Ninguna categoría coincide con la búsqueda."
                : "Las categorías del catálogo aparecerán aquí."}
            </p>
          </div>
        </div>
      </Panel>
    )
  }

  return (
    <Panel>
      <div className="overflow-x-auto pb-2 pt-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] text-left text-[11px] font-medium uppercase tracking-wider text-zinc-600">
              <th className="px-6 py-3 font-medium">Nombre</th>
              <th className="hidden px-3 py-3 font-medium lg:table-cell">
                Descripción
              </th>
              <th className="px-3 py-3 text-right font-medium">
                Productos activos
              </th>
              <th className="hidden px-3 py-3 font-medium md:table-cell">
                Creada
              </th>
              <th className="px-6 py-3 text-right font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {categorias.map((cat) => (
              <tr
                key={cat.id}
                className="transition-colors hover:bg-white/[0.03]"
              >
                <td className="px-6 py-3.5 font-medium text-zinc-200">
                  {cat.nombre}
                </td>
                <td
                  className="hidden max-w-72 truncate px-3 py-3.5 text-[13px] text-zinc-500 lg:table-cell"
                  title={cat.descripcion ?? undefined}
                >
                  {cat.descripcion ?? "—"}
                </td>
                <td className="px-3 py-3.5 text-right font-mono text-[13px] font-medium tabular-nums text-white">
                  {formatearNumero(cat.totalProductosActivos)}
                </td>
                <td className="hidden whitespace-nowrap px-3 py-3.5 text-xs text-zinc-500 md:table-cell">
                  {formatearFecha(cat.fechaCreacion)}
                </td>
                <td className="px-6 py-3.5">
                  <AccionesFila
                    categoria={cat}
                    onEditar={onEditar}
                    onEliminar={onEliminar}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}
