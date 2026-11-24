import { useState } from "react"
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  CircleAlert,
  Loader2,
} from "lucide-react"
import { registrarEntrada, registrarSalida } from "@/api/inventoryApi"
import { mensajeDeError } from "@/api/productsApi"
import { Panel, PanelHeader } from "@/components/dashboard/Panel"
import type { ProductoList } from "@/types/product"
import { cn } from "@/lib/utils"

type TipoOperacion = "entrada" | "salida"

interface MovementFormProps {
  producto: ProductoList | null
  stockActual: number | null
  onRegistrado: (mensaje: string) => void
}

interface CamposMovimiento {
  cantidad: string
  motivo: string
  observaciones: string
}

const CAMPOS_INICIALES: CamposMovimiento = {
  cantidad: "",
  motivo: "",
  observaciones: "",
}

const claseInput =
  "h-10 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 text-[13px] text-zinc-200 outline-none transition-colors placeholder:text-zinc-600 hover:border-white/20 focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/20"

export function MovementForm({
  producto,
  stockActual,
  onRegistrado,
}: MovementFormProps) {
  const [tipo, setTipo] = useState<TipoOperacion>("entrada")
  const [campos, setCampos] = useState<CamposMovimiento>(CAMPOS_INICIALES)
  const [errores, setErrores] = useState<Partial<CamposMovimiento>>({})
  const [errorApi, setErrorApi] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  const cambiarTipo = (nuevo: TipoOperacion) => {
    setTipo(nuevo)
    setErrores({})
    setErrorApi(null)
  }

  const validar = (): Partial<CamposMovimiento> => {
    const errs: Partial<CamposMovimiento> = {}

    const cantidad = Number(campos.cantidad)
    if (
      campos.cantidad.trim() === "" ||
      !Number.isInteger(cantidad) ||
      cantidad <= 0
    ) {
      errs.cantidad = "La cantidad debe ser un entero mayor que 0."
    } else if (
      tipo === "salida" &&
      stockActual !== null &&
      cantidad > stockActual
    ) {
      errs.cantidad = `La salida excede el stock disponible (${stockActual}).`
    }

    if (!campos.motivo.trim()) {
      errs.motivo = "El motivo es obligatorio."
    }

    return errs
  }

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorApi(null)

    if (producto === null) {
      setErrorApi("Selecciona un producto antes de registrar el movimiento.")
      return
    }

    const errs = validar()
    setErrores(errs)
    if (Object.keys(errs).length > 0) return

    setEnviando(true)
    try {
      const payload = {
        productoId: producto.id,
        cantidad: Number(campos.cantidad),
        motivo: campos.motivo.trim(),
        observaciones: campos.observaciones.trim() || null,
      }
      const respuesta =
        tipo === "entrada"
          ? await registrarEntrada(payload)
          : await registrarSalida(payload)

      setCampos(CAMPOS_INICIALES)
      onRegistrado(respuesta.message)
    } catch (error) {
      setErrorApi(mensajeDeError(error))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <Panel className="flex h-full flex-col">
      <PanelHeader
        titulo="Registrar movimiento"
        descripcion="Las existencias se actualizan a partir del movimiento"
      />

      <div className="flex-1 px-6 pb-6 pt-4">
        <div
          role="tablist"
          aria-label="Tipo de movimiento"
          className="grid grid-cols-2 gap-1 rounded-xl border border-white/[0.08] bg-white/[0.03] p-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tipo === "entrada"}
            onClick={() => cambiarTipo("entrada")}
            className={cn(
              "inline-flex h-9 items-center justify-center gap-2 rounded-lg text-[13px] font-medium outline-none transition-all focus-visible:ring-2 focus-visible:ring-indigo-400",
              tipo === "entrada"
                ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-400/25"
                : "text-zinc-500 hover:text-zinc-300",
            )}
          >
            <ArrowDownToLine className="size-3.5" aria-hidden />
            Entrada
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tipo === "salida"}
            onClick={() => cambiarTipo("salida")}
            className={cn(
              "inline-flex h-9 items-center justify-center gap-2 rounded-lg text-[13px] font-medium outline-none transition-all focus-visible:ring-2 focus-visible:ring-indigo-400",
              tipo === "salida"
                ? "bg-rose-500/15 text-rose-300 ring-1 ring-inset ring-rose-400/25"
                : "text-zinc-500 hover:text-zinc-300",
            )}
          >
            <ArrowUpFromLine className="size-3.5" aria-hidden />
            Salida
          </button>
        </div>

        <form onSubmit={enviar} noValidate className="mt-5 space-y-4">
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
              Cantidad <span className="text-indigo-300">*</span>
            </label>
            <input
              type="number"
              value={campos.cantidad}
              onChange={(e) =>
                setCampos((prev) => ({ ...prev, cantidad: e.target.value }))
              }
              min={1}
              step={1}
              inputMode="numeric"
              placeholder="0"
              disabled={producto === null}
              className={cn(claseInput, "font-mono tabular-nums")}
            />
            {errores.cantidad && (
              <p className="mt-1.5 text-[12px] text-rose-300">
                {errores.cantidad}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-zinc-400">
              Motivo <span className="text-indigo-300">*</span>
            </label>
            <input
              type="text"
              value={campos.motivo}
              onChange={(e) =>
                setCampos((prev) => ({ ...prev, motivo: e.target.value }))
              }
              maxLength={250}
              placeholder={
                tipo === "entrada"
                  ? "Ej. Reabastecimiento de proveedor"
                  : "Ej. Pedido de cliente"
              }
              disabled={producto === null}
              className={claseInput}
            />
            {errores.motivo && (
              <p className="mt-1.5 text-[12px] text-rose-300">
                {errores.motivo}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-[12px] font-medium text-zinc-400">
              Observaciones
            </label>
            <textarea
              value={campos.observaciones}
              onChange={(e) =>
                setCampos((prev) => ({
                  ...prev,
                  observaciones: e.target.value,
                }))
              }
              maxLength={500}
              rows={2}
              placeholder="Notas adicionales del movimiento…"
              disabled={producto === null}
              className={cn(claseInput, "h-auto resize-none py-2.5")}
            />
          </div>

          <button
            type="submit"
            disabled={enviando || producto === null}
            className={cn(
              "inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg text-[13px] font-medium text-white outline-none transition-colors focus-visible:ring-2 focus-visible:ring-indigo-300 disabled:pointer-events-none disabled:opacity-60",
              tipo === "entrada"
                ? "bg-emerald-600 shadow-[0_0_20px_rgba(5,150,105,0.3)] hover:bg-emerald-500"
                : "bg-rose-600 shadow-[0_0_20px_rgba(225,29,72,0.3)] hover:bg-rose-500",
            )}
          >
            {enviando && (
              <Loader2 className="size-3.5 animate-spin" aria-hidden />
            )}
            {tipo === "entrada" ? "Registrar entrada" : "Registrar salida"}
          </button>
        </form>
      </div>
    </Panel>
  )
}
