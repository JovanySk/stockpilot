import { Menu, RefreshCw, Search, X } from "lucide-react"
import { fechaActualLarga } from "@/lib/format"
import { cn } from "@/lib/utils"

interface TopbarProps {
  titulo: string
  onAbrirMenu: () => void
  onActualizar: () => void
  actualizando: boolean
  busqueda?: string
  onBuscar?: (texto: string) => void
}

export function Topbar({
  titulo,
  onAbrirMenu,
  onActualizar,
  actualizando,
  busqueda,
  onBuscar,
}: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-white/[0.06] bg-[#07070d]/75 px-4 backdrop-blur-xl md:px-8">
      <button
        type="button"
        onClick={onAbrirMenu}
        aria-label="Abrir menú"
        className="flex size-9 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-white/5 hover:text-white md:hidden"
      >
        <Menu className="size-5" aria-hidden />
      </button>

      <div className="min-w-0">
        <h1 className="truncate text-[15px] font-semibold tracking-tight text-white">
          {titulo}
        </h1>
        <p className="truncate text-xs text-zinc-500">{fechaActualLarga()}</p>
      </div>

      <div className="ml-auto flex items-center gap-2.5">
        {onBuscar && (
          <div className="relative hidden sm:block">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-zinc-500"
              aria-hidden
            />
            <input
              type="search"
              value={busqueda ?? ""}
              onChange={(e) => onBuscar(e.target.value)}
              placeholder="Filtrar producto o SKU…"
              aria-label="Filtrar movimientos y productos por nombre o SKU"
              className="h-9 w-52 rounded-lg border border-white/10 bg-white/[0.04] pl-9 pr-8 text-[13px] text-zinc-200 outline-none transition-colors placeholder:text-zinc-600 hover:border-white/20 focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/20 lg:w-64 [&::-webkit-search-cancel-button]:hidden"
            />
            {busqueda && (
              <button
                type="button"
                onClick={() => onBuscar("")}
                aria-label="Limpiar búsqueda"
                className="absolute right-2 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center rounded text-zinc-500 transition-colors hover:text-white"
              >
                <X className="size-3.5" aria-hidden />
              </button>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={onActualizar}
          disabled={actualizando}
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 text-[13px] font-medium text-zinc-200 outline-none transition-all hover:border-indigo-400/40 hover:bg-indigo-500/10 hover:text-white focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:pointer-events-none disabled:opacity-50"
        >
          <RefreshCw
            className={cn("size-3.5", actualizando && "animate-spin")}
            aria-hidden
          />
          <span className="hidden sm:inline">Actualizar</span>
        </button>
      </div>
    </header>
  )
}
