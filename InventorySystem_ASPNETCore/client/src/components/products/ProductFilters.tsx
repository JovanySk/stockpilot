import { FilterX, Search, TriangleAlert } from "lucide-react"
import type { FiltrosProducto } from "@/types/product"
import { cn } from "@/lib/utils"

interface ProductFiltersProps {
  filtros: FiltrosProducto
  categorias: string[]
  proveedores: string[]
  onCambiar: (filtros: FiltrosProducto) => void
}

const claseSelect =
  "h-9 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-[13px] text-zinc-200 outline-none transition-colors hover:border-white/20 focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/20 [&>option]:bg-[#12121f] [&>option]:text-zinc-200"

export function ProductFilters({
  filtros,
  categorias,
  proveedores,
  onCambiar,
}: ProductFiltersProps) {
  const hayFiltros =
    filtros.texto !== "" ||
    filtros.categoria !== "" ||
    filtros.proveedor !== "" ||
    filtros.soloStockBajo

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <div className="relative min-w-52 flex-1 sm:max-w-72">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-zinc-500"
          aria-hidden
        />
        <input
          type="search"
          value={filtros.texto}
          onChange={(e) => onCambiar({ ...filtros, texto: e.target.value })}
          placeholder="Buscar por nombre o SKU…"
          aria-label="Buscar producto por nombre o SKU"
          className="h-9 w-full rounded-lg border border-white/10 bg-white/[0.04] pl-9 pr-3 text-[13px] text-zinc-200 outline-none transition-colors placeholder:text-zinc-600 hover:border-white/20 focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/20 [&::-webkit-search-cancel-button]:hidden"
        />
      </div>

      <select
        value={filtros.categoria}
        onChange={(e) => onCambiar({ ...filtros, categoria: e.target.value })}
        aria-label="Filtrar por categoría"
        className={claseSelect}
      >
        <option value="">Todas las categorías</option>
        {categorias.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        value={filtros.proveedor}
        onChange={(e) => onCambiar({ ...filtros, proveedor: e.target.value })}
        aria-label="Filtrar por proveedor"
        className={claseSelect}
      >
        <option value="">Todos los proveedores</option>
        {proveedores.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={() =>
          onCambiar({ ...filtros, soloStockBajo: !filtros.soloStockBajo })
        }
        aria-pressed={filtros.soloStockBajo}
        className={cn(
          "inline-flex h-9 items-center gap-2 rounded-lg border px-3.5 text-[13px] font-medium outline-none transition-all focus-visible:ring-2 focus-visible:ring-indigo-400",
          filtros.soloStockBajo
            ? "border-amber-400/40 bg-amber-500/15 text-amber-300"
            : "border-white/10 bg-white/[0.04] text-zinc-400 hover:border-white/20 hover:text-zinc-200",
        )}
      >
        <TriangleAlert className="size-3.5" aria-hidden />
        Solo stock bajo
      </button>

      {hayFiltros && (
        <button
          type="button"
          onClick={() =>
            onCambiar({
              texto: "",
              categoria: "",
              proveedor: "",
              soloStockBajo: false,
            })
          }
          className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-[13px] text-zinc-500 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          <FilterX className="size-3.5" aria-hidden />
          Limpiar
        </button>
      )}
    </div>
  )
}
