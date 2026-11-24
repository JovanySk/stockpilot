import { useEffect, useState } from "react"
import { CircleAlert, Loader2, X } from "lucide-react"
import type { Categoria, CategoriaPayload } from "@/types/category"
import { cn } from "@/lib/utils"

interface CategoryFormProps {
  inicial?: Categoria
  onGuardar: (payload: CategoriaPayload) => Promise<void>
  onCancelar: () => void
}

const claseInput =
  "h-10 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 text-[13px] text-zinc-200 outline-none transition-colors placeholder:text-zinc-600 hover:border-white/20 focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/20"

export function CategoryForm({ inicial, onGuardar, onCancelar }: CategoryFormProps) {
  const modo = inicial ? "editar" : "crear"
  const [nombre, setNombre] = useState(inicial?.nombre ?? "")
  const [descripcion, setDescripcion] = useState(inicial?.descripcion ?? "")
  const [activo, setActivo] = useState(inicial?.activo ?? true)
  const [errorNombre, setErrorNombre] = useState<string | null>(null)
  const [errorApi, setErrorApi] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !enviando) onCancelar()
    }
    window.addEventListener("keydown", onEscape)
    return () => window.removeEventListener("keydown", onEscape)
  }, [onCancelar, enviando])

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorApi(null)

    if (!nombre.trim()) {
      setErrorNombre("El nombre de la categoría es obligatorio.")
      return
    }
    setErrorNombre(null)

    setEnviando(true)
    try {
      await onGuardar({
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || null,
        activo,
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
        aria-label={modo === "crear" ? "Nueva categoría" : "Editar categoría"}
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0b0b16] shadow-[0_0_60px_rgba(0,0,0,0.6)]"
      >
        <header className="flex items-start justify-between gap-3 border-b border-white/[0.06] px-6 py-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-300/80">
              {modo === "crear" ? "Nuevo registro" : "Edición"}
            </p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-white">
              {modo === "crear" ? "Nueva categoría" : "Editar categoría"}
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

          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-zinc-400">
              Nombre <span className="text-indigo-300">*</span>
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              maxLength={100}
              placeholder="Ej. Electrónica"
              className={claseInput}
            />
            {errorNombre && (
              <p className="mt-1.5 text-[12px] text-rose-300">{errorNombre}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-zinc-400">
              Descripción
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder="Descripción breve de la categoría…"
              className={cn(claseInput, "h-auto resize-none py-2.5")}
            />
          </div>

          {modo === "editar" && (
            <label className="flex h-10 cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-3">
              <input
                type="checkbox"
                checked={activo}
                onChange={(e) => setActivo(e.target.checked)}
                className="size-4 accent-indigo-500"
              />
              <span className="text-[13px] text-zinc-300">Categoría activa</span>
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
              {modo === "crear" ? "Crear categoría" : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
