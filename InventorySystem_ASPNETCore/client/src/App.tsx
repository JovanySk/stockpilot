import { useState } from "react"
import { AppLayout } from "@/components/layout/AppLayout"
import type { PaginaApp } from "@/components/layout/Sidebar"
import { CategoriesPage } from "@/pages/CategoriesPage"
import { DashboardPage } from "@/pages/DashboardPage"
import { InventoryPage } from "@/pages/InventoryPage"
import { ProductsPage } from "@/pages/ProductsPage"
import { ProvidersPage } from "@/pages/ProvidersPage"

const titulos: Record<PaginaApp, string> = {
  dashboard: "Dashboard",
  productos: "Productos",
  categorias: "Categorías",
  proveedores: "Proveedores",
  inventario: "Inventario",
}

export default function App() {
  const [pagina, setPagina] = useState<PaginaApp>("dashboard")
  const [cargando, setCargando] = useState(false)
  const [recarga, setRecarga] = useState(0)
  const [busqueda, setBusqueda] = useState("")

  const paginas: Record<PaginaApp, React.ReactNode> = {
    dashboard: (
      <DashboardPage
        onEstadoCarga={setCargando}
        recargaExterna={recarga}
        busqueda={busqueda}
      />
    ),
    productos: (
      <ProductsPage onEstadoCarga={setCargando} recargaExterna={recarga} />
    ),
    categorias: (
      <CategoriesPage onEstadoCarga={setCargando} recargaExterna={recarga} />
    ),
    proveedores: (
      <ProvidersPage onEstadoCarga={setCargando} recargaExterna={recarga} />
    ),
    inventario: (
      <InventoryPage onEstadoCarga={setCargando} recargaExterna={recarga} />
    ),
  }

  return (
    <AppLayout
      titulo={titulos[pagina]}
      paginaActiva={pagina}
      onNavegar={setPagina}
      onActualizar={() => setRecarga((n) => n + 1)}
      actualizando={cargando}
      busqueda={pagina === "dashboard" ? busqueda : undefined}
      onBuscar={pagina === "dashboard" ? setBusqueda : undefined}
    >
      {paginas[pagina]}
    </AppLayout>
  )
}
