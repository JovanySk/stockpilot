import { useCallback, useEffect, useMemo, useState } from "react"
import { CircleAlert, CircleCheck, Plus, Search } from "lucide-react"
import { mensajeDeError } from "@/api/productsApi"
import {
  actualizarProveedor,
  crearProveedor,
  eliminarProveedor,
  obtenerProveedores,
} from "@/api/providersApi"
import { ProviderForm } from "@/components/catalog/ProviderForm"
import { ProvidersTable } from "@/components/catalog/ProvidersTable"
import type { Proveedor, ProveedorPayload } from "@/types/provider"
import { cn } from "@/lib/utils"

interface ProvidersPageProps {
  onEstadoCarga?: (cargando: boolean) => void
  recargaExterna?: number
}

type Aviso = { tipo: "ok" | "error"; texto: string }

type EstadoModal =
  | { tipo: "cerrado" }
  | { tipo: "crear" }
  | { tipo: "editar"; datos: Proveedor }

function ErrorEstado({ onReintentar }: { onReintentar: () => void }) {
  return (
    <div className="rounded-2xl border border-rose-400/20 bg-white/[0.03] px-6 py-14 text-center backdrop-blur-sm">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-rose-400/20 bg-rose-500/10">
        <CircleAlert className="size-7 text-rose-300" aria-hidden />
      </div>
      <p className="mt-4 font-semibold tracking-tight text-white">
        No se pudieron cargar los proveedores
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

export function ProvidersPage({
  onEstadoCarga,
  recargaExterna,
}: ProvidersPageProps) {
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
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
      const lista = await obtenerProveedores()
      setProveedores(lista)
    } catch {
      setError(true)
      setProveedores([])
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

  const filtrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase()
    if (!texto) return proveedores
    return proveedores.filter(
      (p) =>
        p.nombre.toLowerCase().includes(texto) ||
        (p.contacto?.toLowerCase().includes(texto) ?? false) ||
        (p.email?.toLowerCase().includes(texto) ?? false),
    )
  }, [proveedores, busqueda])

  const guardar = useCallback(
    async (payload: ProveedorPayload) => {
      try {
        const respuesta =
          modal.tipo === "editar"
            ? await actualizarProveedor(modal.datos.id, payload)
            : await crearProveedor(payload)
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
    async (proveedor: Proveedor) => {
      try {
        const respuesta = await eliminarProveedor(proveedor.id)
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
            Proveedores
          </h2>
          <p className="mt-0.5 text-sm text-zinc-500">
            {filtrados.length} de {proveedores.length} proveedores activos
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModal({ tipo: "crear" })}
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-indigo-500 px-4 text-[13px] font-medium text-white shadow-[0_0_20px_rgba(99,102,241,0.35)] outline-none transition-colors hover:bg-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-300"
        >
          <Plus className="size-4" aria-hidden />
          Nuevo proveedor
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
          placeholder="Buscar proveedor…"
          aria-label="Buscar proveedor por nombre, contacto o correo"
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

      <ProvidersTable
        proveedores={filtrados}
        filtroActivo={busqueda.trim() !== ""}
        onEditar={(p) => setModal({ tipo: "editar", datos: p })}
        onEliminar={manejarEliminar}
      />

      {modal.tipo !== "cerrado" && (
        <ProviderForm
          inicial={modal.tipo === "editar" ? modal.datos : undefined}
          onGuardar={guardar}
          onCancelar={() => setModal({ tipo: "cerrado" })}
        />
      )}
    </div>
  )
}
