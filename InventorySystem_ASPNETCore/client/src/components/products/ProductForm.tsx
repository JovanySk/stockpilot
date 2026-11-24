import { useEffect, useState } from "react"
import { CircleAlert, Loader2, X } from "lucide-react"
import type { OpcionCategoria } from "@/types/category"
import type { OpcionProveedor } from "@/types/provider"
import type { ProductoEditData, ProductoFormPayload } from "@/types/product"
import { cn } from "@/lib/utils"

interface ProductFormProps {
  modo: "crear" | "editar"
  inicial?: ProductoEditData
  categorias: OpcionCategoria[]
  proveedores: OpcionProveedor[]
  onGuardar: (
    payload: ProductoFormPayload & { activo: boolean },
  ) => Promise<void>
  onCancelar: () => void
}

interface CamposForm {
  nombre: string
  codigoSKU: string
  descripcion: string
  precio: string
  stockMinimo: string
  categoriaId: string
  proveedorId: string
  activo: boolean
}

type ErroresForm = Partial<Record<keyof CamposForm, string>>

const claseInput =
  "h-10 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 text-[13px] text-zinc-200 outline-none transition-colors placeholder:text-zinc-600 hover:border-white/20 focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/20"

const claseSelect = cn(
  claseInput,
  "[&>option]:bg-[#12121f] [&>option]:text-zinc-200",
)

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

export function ProductForm({
  modo,
  inicial,
  categorias,
  proveedores,
  onGuardar,
  onCancelar,
}: ProductFormProps) {
  const [campos, setCampos] = useState<CamposForm>({
    nombre: inicial?.nombre ?? "",
    codigoSKU: inicial?.codigoSKU ?? "",
    descripcion: inicial?.descripcion ?? "",
    precio: inicial !== undefined ? String(inicial.precio) : "",
    stockMinimo: inicial !== undefined ? String(inicial.stockMinimo) : "",
    categoriaId: inicial?.categoriaId ? String(inicial.categoriaId) : "",
    proveedorId: inicial?.proveedorId ? String(inicial.proveedorId) : "",
    activo: inicial?.activo ?? true,
  })
  const [errores, setErrores] = useState<ErroresForm>({})
  const [errorApi, setErrorApi] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !enviando) onCancelar()
    }
    window.addEventListener("keydown", onEscape)
    return () => window.removeEventListener("keydown", onEscape)
  }, [onCancelar, enviando])

  const cambiar = <K extends keyof CamposForm>(campo: K, valor: CamposForm[K]) =>
    setCampos((prev) => ({ ...prev, [campo]: valor }))

  const validar = (): ErroresForm => {
    const errs: ErroresForm = {}

    if (!campos.nombre.trim()) errs.nombre = "El nombre es obligatorio."
    if (!campos.codigoSKU.trim()) errs.codigoSKU = "El código SKU es obligatorio."
    if (!campos.categoriaId) errs.categoriaId = "Selecciona una categoría."

    const precio = Number(campos.precio)
    if (campos.precio.trim() === "" || Number.isNaN(precio)) {
      errs.precio = "Ingresa un precio válido."
    } else if (precio < 0) {
      errs.precio = "El precio no puede ser negativo."
    }

    const stockMinimo = Number(campos.stockMinimo)
    if (
      campos.stockMinimo.trim() === "" ||
      !Number.isInteger(stockMinimo)
    ) {
      errs.stockMinimo = "Ingresa un número entero."
    } else if (stockMinimo < 0) {
      errs.stockMinimo = "El stock mínimo no puede ser negativo."
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
        codigoSKU: campos.codigoSKU.trim(),
        descripcion: campos.descripcion.trim() || null,
        precio: Number(campos.precio),
        stockMinimo: Number(campos.stockMinimo),
        categoriaId: Number(campos.categoriaId),
        proveedorId: campos.proveedorId ? Number(campos.proveedorId) : null,
        activo: campos.activo,
      })
    } catch (error) {
      setErrorApi(
        error instanceof Error
          ? error.message
          : "Ocurrió un error inesperado.",
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
        aria-label={modo === "crear" ? "Nuevo producto" : "Editar producto"}
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-[#0b0b16] shadow-[0_0_60px_rgba(0,0,0,0.6)]"
      >
        <header className="sticky top-0 flex items-start justify-between gap-3 border-b border-white/[0.06] bg-[#0b0b16] px-6 py-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-300/80">
              {modo === "crear" ? "Nuevo registro" : "Edición"}
            </p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-white">
              {modo === "crear" ? "Nuevo producto" : "Editar producto"}
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
              placeholder="Ej. Monitor LED 24&quot; Full HD"
              className={claseInput}
            />
          </Campo>

          <div className="grid gap-4 sm:grid-cols-2">
            <Campo etiqueta="Código SKU" requerido error={errores.codigoSKU}>
              <input
                type="text"
                value={campos.codigoSKU}
                onChange={(e) => cambiar("codigoSKU", e.target.value)}
                maxLength={50}
                placeholder="Ej. ELEC-MON-024"
                className={cn(claseInput, "font-mono uppercase")}
              />
            </Campo>

            <Campo etiqueta="Precio (MXN)" requerido error={errores.precio}>
              <input
                type="number"
                value={campos.precio}
                onChange={(e) => cambiar("precio", e.target.value)}
                min={0}
                step="0.01"
                inputMode="decimal"
                placeholder="0.00"
                className={cn(claseInput, "font-mono tabular-nums")}
              />
            </Campo>
          </div>

          <Campo etiqueta="Descripción" error={errores.descripcion}>
            <textarea
              value={campos.descripcion}
              onChange={(e) => cambiar("descripcion", e.target.value)}
              maxLength={500}
              rows={3}
              placeholder="Descripción breve del producto…"
              className={cn(claseInput, "h-auto resize-none py-2.5")}
            />
          </Campo>

          <div className="grid gap-4 sm:grid-cols-2">
            <Campo etiqueta="Categoría" requerido error={errores.categoriaId}>
              <select
                value={campos.categoriaId}
                onChange={(e) => cambiar("categoriaId", e.target.value)}
                className={claseSelect}
              >
                <option value="">Selecciona…</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </Campo>

            <Campo etiqueta="Proveedor" error={errores.proveedorId}>
              <select
                value={campos.proveedorId}
                onChange={(e) => cambiar("proveedorId", e.target.value)}
                className={claseSelect}
              >
                <option value="">Sin proveedor</option>
                {proveedores.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </Campo>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Campo etiqueta="Stock mínimo" requerido error={errores.stockMinimo}>
              <input
                type="number"
                value={campos.stockMinimo}
                onChange={(e) => cambiar("stockMinimo", e.target.value)}
                min={0}
                step={1}
                inputMode="numeric"
                placeholder="0"
                className={cn(claseInput, "font-mono tabular-nums")}
              />
            </Campo>

            {modo === "editar" && (
              <Campo etiqueta="Estado">
                <label className="flex h-10 cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-3">
                  <input
                    type="checkbox"
                    checked={campos.activo}
                    onChange={(e) => cambiar("activo", e.target.checked)}
                    className="size-4 accent-indigo-500"
                  />
                  <span className="text-[13px] text-zinc-300">
                    Producto activo
                  </span>
                </label>
              </Campo>
            )}
          </div>

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
              {modo === "crear" ? "Crear producto" : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
