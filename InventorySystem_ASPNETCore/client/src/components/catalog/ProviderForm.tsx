import { useEffect, useState } from "react"
import { CircleAlert, Loader2, X } from "lucide-react"
import type { Proveedor, ProveedorPayload } from "@/types/provider"
import { cn } from "@/lib/utils"

interface ProviderFormProps {
  inicial?: Proveedor
  onGuardar: (payload: ProveedorPayload) => Promise<void>
  onCancelar: () => void
}

interface CamposProveedor {
  nombre: string
  contacto: string
  telefono: string
  email: string
  direccion: string
  activo: boolean
}

type ErroresProveedor = Partial<Record<keyof CamposProveedor, string>>

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const claseInput =
  "h-10 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 text-[13px] text-zinc-200 outline-none transition-colors placeholder:text-zinc-600 hover:border-white/20 focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/20"

function Campo({
  etiqueta,
  requerido,
  error,
  children,
}: {
  etiqueta: string
  requerido?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-medium text-zinc-400">
        {etiqueta}
        {requerido && <span className="ml-1 text-indigo-300">*</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 text-[12px] text-rose-300">{error}</p>}
    </div>
  )
}

export function ProviderForm({ inicial, onGuardar, onCancelar }: ProviderFormProps) {
  const modo = inicial ? "editar" : "crear"
  const [campos, setCampos] = useState<CamposProveedor>({
    nombre: inicial?.nombre ?? "",
    contacto: inicial?.contacto ?? "",
    telefono: inicial?.telefono ?? "",
    email: inicial?.email ?? "",
    direccion: inicial?.direccion ?? "",
    activo: inicial?.activo ?? true,
  })
  const [errores, setErrores] = useState<ErroresProveedor>({})
  const [errorApi, setErrorApi] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !enviando) onCancelar()
    }
    window.addEventListener("keydown", onEscape)
    return () => window.removeEventListener("keydown", onEscape)
  }, [onCancelar, enviando])

  const cambiar = <K extends keyof CamposProveedor>(
    campo: K,
    valor: CamposProveedor[K],
  ) => setCampos((prev) => ({ ...prev, [campo]: valor }))

  const validar = (): ErroresProveedor => {
    const errs: ErroresProveedor = {}
    if (!campos.nombre.trim()) {
      errs.nombre = "El nombre del proveedor es obligatorio."
    }
    if (campos.email.trim() && !EMAIL_REGEX.test(campos.email.trim())) {
      errs.email = "El correo no tiene un formato válido."
    }
    return errs
  }

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorApi(null)

    const errs = validar()
    setErrores(errs)
    if (Object.keys(errs).length > 0) return

    setEnviando(true)
    try {
      await onGuardar({
        nombre: campos.nombre.trim(),
        contacto: campos.contacto.trim() || null,
        telefono: campos.telefono.trim() || null,
        email: campos.email.trim() || null,
        direccion: campos.direccion.trim() || null,
        activo: campos.activo,
      })
    } catch (error) {
      setErrorApi(
        error instanceof Error ? error.message : "Ocurrió un error inesperado.",
      )
      setEnviando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Cerrar formulario"
        onClick={() => !enviando && onCancelar()}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={modo === "crear" ? "Nuevo proveedor" : "Editar proveedor"}
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-[#0b0b16] shadow-[0_0_60px_rgba(0,0,0,0.6)]"
      >
        <header className="sticky top-0 flex items-start justify-between gap-3 border-b border-white/[0.06] bg-[#0b0b16] px-6 py-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-300/80">
              {modo === "crear" ? "Nuevo registro" : "Edición"}
            </p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-white">
              {modo === "crear" ? "Nuevo proveedor" : "Editar proveedor"}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => !enviando && onCancelar()}
            aria-label="Cerrar"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <X className="size-4" aria-hidden />
          </button>
        </header>

        <form onSubmit={enviar} noValidate className="space-y-4 px-6 py-6">
          {errorApi && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-xl border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-[13px] text-rose-300"
            >
              <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
              {errorApi}
            </div>
          )}

          <Campo etiqueta="Nombre" requerido error={errores.nombre}>
            <input
              type="text"
              value={campos.nombre}
              onChange={(e) => cambiar("nombre", e.target.value)}
              maxLength={150}
              placeholder="Ej. TechSource MX"
              className={claseInput}
            />
          </Campo>

          <div className="grid gap-4 sm:grid-cols-2">
            <Campo etiqueta="Contacto" error={errores.contacto}>
              <input
                type="text"
                value={campos.contacto}
                onChange={(e) => cambiar("contacto", e.target.value)}
                maxLength={150}
                placeholder="Nombre del contacto"
                className={claseInput}
              />
            </Campo>

            <Campo etiqueta="Teléfono" error={errores.telefono}>
              <input
                type="tel"
                value={campos.telefono}
                onChange={(e) => cambiar("telefono", e.target.value)}
                maxLength={20}
                placeholder="+52 55 0000 0000"
                className={cn(claseInput, "font-mono tabular-nums")}
              />
            </Campo>
          </div>

          <Campo etiqueta="Correo electrónico" error={errores.email}>
            <input
              type="email"
              value={campos.email}
              onChange={(e) => cambiar("email", e.target.value)}
              maxLength={150}
              placeholder="contacto@proveedor.com"
              className={claseInput}
            />
          </Campo>

          <Campo etiqueta="Dirección" error={errores.direccion}>
            <textarea
              value={campos.direccion}
              onChange={(e) => cambiar("direccion", e.target.value)}
              maxLength={250}
              rows={2}
              placeholder="Calle, número, ciudad…"
              className={cn(claseInput, "h-auto resize-none py-2.5")}
            />
          </Campo>

          {modo === "editar" && (
            <label className="flex h-10 cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-3">
              <input
                type="checkbox"
                checked={campos.activo}
                onChange={(e) => cambiar("activo", e.target.checked)}
                className="size-4 accent-indigo-500"
              />
              <span className="text-[13px] text-zinc-300">Proveedor activo</span>
            </label>
          )}

          <div className="flex items-center justify-end gap-2.5 border-t border-white/[0.06] pt-5">
            <button
              type="button"
              onClick={onCancelar}
              disabled={enviando}
              className="inline-flex h-9 items-center rounded-lg px-4 text-[13px] font-medium text-zinc-400 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-indigo-500 px-4 text-[13px] font-medium text-white shadow-[0_0_20px_rgba(99,102,241,0.35)] outline-none transition-colors hover:bg-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-300 disabled:pointer-events-none disabled:opacity-70"
            >
              {enviando && (
                <Loader2 className="size-3.5 animate-spin" aria-hidden />
              )}
              {modo === "crear" ? "Crear proveedor" : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
