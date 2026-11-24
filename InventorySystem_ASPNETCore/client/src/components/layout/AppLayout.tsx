import { useState } from "react"
import { Sidebar, type PaginaApp } from "@/components/layout/Sidebar"
import { Topbar } from "@/components/layout/Topbar"

interface AppLayoutProps {
  children: React.ReactNode
  titulo: string
  paginaActiva: PaginaApp
  onNavegar: (pagina: PaginaApp) => void
  onActualizar: () => void
  actualizando: boolean
  busqueda?: string
  onBuscar?: (texto: string) => void
}

export function AppLayout({
  children,
  titulo,
  paginaActiva,
  onNavegar,
  onActualizar,
  actualizando,
  busqueda,
  onBuscar,
}: AppLayoutProps) {
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <div className="relative flex min-h-svh bg-[#060609] text-zinc-100">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 20% -10%, rgba(99,102,241,0.10), transparent 60%), radial-gradient(ellipse 50% 35% at 85% 15%, rgba(139,92,246,0.08), transparent 60%), radial-gradient(ellipse 45% 35% at 50% 110%, rgba(34,211,238,0.05), transparent 60%)",
          }}
        />
        <div className="absolute -top-32 left-1/3 size-[420px] rounded-full bg-indigo-600/[0.07] blur-[130px]" />
        <div className="absolute -right-24 top-1/2 size-[380px] rounded-full bg-violet-600/[0.07] blur-[130px]" />
      </div>

      <Sidebar
        abierto={menuAbierto}
        onCerrar={() => setMenuAbierto(false)}
        paginaActiva={paginaActiva}
        onNavegar={onNavegar}
      />

      <div className="relative flex min-w-0 flex-1 flex-col">
        <Topbar
          titulo={titulo}
          onAbrirMenu={() => setMenuAbierto(true)}
          onActualizar={onActualizar}
          actualizando={actualizando}
          busqueda={busqueda}
          onBuscar={onBuscar}
        />

        <main className="mx-auto w-full max-w-7xl flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
