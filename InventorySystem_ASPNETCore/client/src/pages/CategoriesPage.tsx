import { useCallback, useEffect, useMemo, useState } from "react"
import { CircleAlert, CircleCheck, Plus, Search } from "lucide-react"
import {
  actualizarCategoria,
  crearCategoria,
  eliminarCategoria,
  obtenerCategorias,
} from "@/api/categoriesApi"
import { mensajeDeError } from "@/api/productsApi"
import { CategoriesTable } from "@/components/catalog/CategoriesTable"
import { CategoryForm } from "@/components/catalog/CategoryForm"
import type { Categoria, CategoriaPayload } from "@/types/category"
import { cn } from "@/lib/utils"

interface CategoriesPageProps {
  onEstadoCarga?: (cargando: boolean) => void
  recargaExterna?: number
}

type Aviso = { tipo: "ok" | "error"; texto: string }

type EstadoModal =
  | { tipo: "cerrado" }
  | { tipo: "crear" }
  | { tipo: "editar"; datos: Categoria }

function ErrorEstado({ onReintentar }: { onReintentar: () => void }) {
  return (
    <div className="rounded-2xl border border-rose-400/20 bg-white/[0.03] px-6 py-14 text-center backdrop-blur-sm">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-rose-400/20 bg-rose-500/10">
        <CircleAlert className="size-7 text-rose-300" aria-hidden />
      </div>
      <p className="mt-4 font-semibold tracking-tight text-white">
        No se pudieron cargar las categorías
      </p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-zinc-500">
        Verifica que la API esté en ejecución y vuelve a intentarlo.
      </p>
      <button
        type="button"
        onClick={onReintentar}
        className="mt-5 inline-flex h-9 items-center rounded-lg bg-indigo-500 px-4 text-[13px] font-medium text-white shadow-[0_0_20px_rgba(99,102,241,0.35)] outline-none transition-colors hover:bg-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-300"
      >
        Reintentar
      </button>
    </div>
  )
}

export function CategoriesPage({
  onEstadoCarga,
  recargaExterna,
}: CategoriesPageProps) {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(false)
  const [busqueda, setBusqueda] = useState("")
  const [aviso, setAviso] = useState<Aviso | null>(null)
  const [modal, setModal] = useState<EstadoModal>({ tipo: "cerrado" })

  const cargar = useCallback(async () => {
    setCargando(true)
    setError(false)
    onEstadoCarga?.(true)
    try {
      const lista = await obtenerCategorias()
      setCategorias(lista)
    } catch {
      setError(true)
      setCategorias([])
    } finally {
      setCargando(false)
      onEstadoCarga?.(false)
    }
  }, [onEstadoCarga])

  useEffect(() => {
    void cargar()
  }, [cargar, recargaExterna])

  useEffect(() => {
    if (!aviso) return
    const timer = window.setTimeout(() => setAviso(null), 5000)
    return () => window.clearTimeout(timer)
  }, [aviso])

  const filtradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase()
    if (!texto) return categorias
    return categorias.filter(
      (c) =>
        c.nombre.toLowerCase().includes(texto) ||
        (c.descripcion?.toLowerCase().includes(texto) ?? false),
    )
  }, [categorias, busqueda])

  const guardar = useCallback(
    async (payload: CategoriaPayload) => {
      try {
        const respuesta =
          modal.tipo === "editar"
            ? await actualizarCategoria(modal.datos.id, payload)
            : await crearCategoria(payload)
        setModal({ tipo: "cerrado" })
        setAviso({ tipo: "ok", texto: respuesta.message })
        await cargar()
      } catch (error) {
        throw new Error(mensajeDeError(error))
      }
    },
    [modal, cargar],
  )

  const manejarEliminar = useCallback(
    async (categoria: Categoria) => {
      try {
        const respuesta = await eliminarCategoria(categoria.id)
        setAviso({ tipo: "ok", texto: respuesta.message })
        await cargar()
      } catch (error) {
        setAviso({ tipo: "error", texto: mensajeDeError(error) })
      }
    },
    [cargar],
  )

  if (cargando) {
    return (
      <div className="space-y-4">
        <div className="h-9 w-2/3 animate-pulse rounded-lg border border-white/[0.04] bg-white/[0.03]" />
        <div className="h-96 animate-pulse rounded-2xl border border-white/[0.04] bg-white/[0.03]" />
      </div>
    )
  }

  if (error) return <ErrorEstado onReintentar={() => void cargar()} />

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-white">
            Categorías
          </h2>
          <p className="mt-0.5 text-sm text-zinc-500">
            {filtradas.length} de {categorias.length} categorías activas
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModal({ tipo: "crear" })}
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-indigo-500 px-4 text-[13px] font-medium text-white shadow-[0_0_20px_rgba(99,102,241,0.35)] outline-none transition-colors hover:bg-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-300"
        >
          <Plus className="size-4" aria-hidden />
          Nueva categoría
        </button>
      </div>

      <div className="relative max-w-72">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-zinc-500"
          aria-hidden
        />
        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar categoría…"
          aria-label="Buscar categoría por nombre o descripción"
          className="h-9 w-full rounded-lg border border-white/10 bg-white/[0.04] pl-9 pr-3 text-[13px] text-zinc-200 outline-none transition-colors placeholder:text-zinc-600 hover:border-white/20 focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/20 [&::-webkit-search-cancel-button]:hidden"
        />
      </div>

      {aviso && (
        <div
          role={aviso.tipo === "error" ? "alert" : "status"}
          className={cn(
            "flex items-center gap-2.5 rounded-xl border px-4 py-3 text-[13px]",
            aviso.tipo === "ok"
              ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
              : "border-rose-400/25 bg-rose-500/10 text-rose-300",
          )}
        >
          {aviso.tipo === "ok" ? (
            <CircleCheck className="size-4 shrink-0" aria-hidden />
          ) : (
            <CircleAlert className="size-4 shrink-0" aria-hidden />
          )}
          {aviso.texto}
        </div>
      )}

      <CategoriesTable
        categorias={filtradas}
        filtroActivo={busqueda.trim() !== ""}
        onEditar={(c) => setModal({ tipo: "editar", datos: c })}
        onEliminar={manejarEliminar}
      />

      {modal.tipo !== "cerrado" && (
        <CategoryForm
          inicial={modal.tipo === "editar" ? modal.datos : undefined}
          onGuardar={guardar}
          onCancelar={() => setModal({ tipo: "cerrado" })}
        />
      )}
    </div>
  )
}
