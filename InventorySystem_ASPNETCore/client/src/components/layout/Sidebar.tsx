import {
  Boxes,
  ClipboardList,
  FolderTree,
  LayoutDashboard,
  PackageSearch,
  Truck,
} from "lucide-react"
import { cn } from "@/lib/utils"

export type PaginaApp =
  | "dashboard"
  | "productos"
  | "categorias"
  | "proveedores"
  | "inventario"

interface NavItem {
  etiqueta: string
  icono: React.ComponentType<{ className?: string }>
  pagina: PaginaApp
}

interface NavGroup {
  titulo: string
  items: NavItem[]
}

const grupos: NavGroup[] = [
  {
    titulo: "General",
    items: [
      { etiqueta: "Dashboard", icono: LayoutDashboard, pagina: "dashboard" },
    ],
  },
  {
    titulo: "Operaciones",
    items: [
      { etiqueta: "Productos", icono: Boxes, pagina: "productos" },
      { etiqueta: "Categorías", icono: FolderTree, pagina: "categorias" },
      { etiqueta: "Proveedores", icono: Truck, pagina: "proveedores" },
      { etiqueta: "Inventario", icono: ClipboardList, pagina: "inventario" },
    ],
  },
]

interface SidebarProps {
  abierto: boolean
  onCerrar: () => void
  paginaActiva: PaginaApp
  onNavegar: (pagina: PaginaApp) => void
}

export function Sidebar({
  abierto,
  onCerrar,
  paginaActiva,
  onNavegar,
}: SidebarProps) {
  return (
    <>
      {abierto && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={onCerrar}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/[0.06] bg-[#0a0a14]/95 backdrop-blur-xl transition-transform md:static md:translate-x-0",
          abierto ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center gap-3.5 px-5 pb-7 pt-7">
          <div className="relative flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 via-violet-500 to-indigo-700 shadow-[0_0_24px_rgba(99,102,241,0.45)]">
            <PackageSearch className="size-5 text-white" aria-hidden />
          </div>
          <div className="leading-tight">
            <p className="text-base font-semibold tracking-tight text-white">
              StockPilot
            </p>
            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500">
              Inventory Control
            </p>
          </div>
        </div>

        <nav
          aria-label="Navegación principal"
          className="flex-1 space-y-7 overflow-y-auto px-3 pb-8"
        >
          {grupos.map((grupo) => (
            <div key={grupo.titulo}>
              <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
                {grupo.titulo}
              </p>
              <div className="space-y-1">
                {grupo.items.map(
                  ({ etiqueta, icono: Icono, pagina }) => {
                    const activo = pagina === paginaActiva

                    return (
                      <button
                        key={etiqueta}
                        type="button"
                        aria-current={activo ? "page" : undefined}
                        onClick={() => {
                          onNavegar(pagina)
                          onCerrar()
                        }}
                        className={cn(
                          "group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-indigo-400",
                          activo
                            ? "bg-gradient-to-r from-indigo-500/25 via-indigo-500/10 to-transparent font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                            : "text-zinc-400 hover:translate-x-0.5 hover:bg-white/[0.04] hover:text-zinc-100",
                        )}
                      >
                        {activo && (
                          <span
                            aria-hidden
                            className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-gradient-to-b from-indigo-300 to-violet-500 shadow-[0_0_12px_rgba(129,140,248,0.8)]"
                          />
                        )}
                        <span
                          className={cn(
                            "flex size-7 items-center justify-center rounded-lg transition-colors",
                            activo
                              ? "bg-indigo-400/15"
                              : "bg-transparent group-hover:bg-white/[0.04]",
                          )}
                        >
                          <Icono
                            className={cn("size-4", activo && "text-indigo-300")}
                            aria-hidden
                          />
                        </span>
                        {etiqueta}
                      </button>
                    )
                  },
                )}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </>
  )
}
