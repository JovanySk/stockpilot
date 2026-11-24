import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { obtenerProducto, obtenerStockProducto } from "@/api/productsApi"
import { SkuTag } from "@/components/dashboard/SkuTag"
import { ProductStatusBadge } from "@/components/products/ProductStatusBadge"
import { ProductStockBadge } from "@/components/products/ProductStockBadge"
import { formatearMoneda, formatearNumero } from "@/lib/format"
import type { ProductoList, ProductoStockDetalle } from "@/types/product"

interface ProductDetailDrawerProps {
  productoId: number
  onCerrar: () => void
}

function Dato({ etiqueta, children }: { etiqueta: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-600">
        {etiqueta}
      </p>
      <div className="mt-1 text-sm text-zinc-200">{children}</div>
    </div>
  )
}

export function ProductDetailDrawer({
  productoId,
  onCerrar,
}: ProductDetailDrawerProps) {
  const [producto, setProducto] = useState<ProductoList | null>(null)
  const [stock, setStock] = useState<ProductoStockDetalle | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let activo = true
    Promise.all([obtenerProducto(productoId), obtenerStockProducto(productoId)])
      .then(([prod, stk]) => {
        if (!activo) return
        setProducto(prod)
        setStock(stk)
      })
      .catch(() => {
        if (activo) setError(true)
      })
    return () => {
      activo = false
    }
  }, [productoId])

  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCerrar()
    }
    window.addEventListener("keydown", onEscape)
    return () => window.removeEventListener("keydown", onEscape)
  }, [onCerrar])

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Cerrar detalle"
        onClick={onCerrar}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Detalle del producto"
        className="relative flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#0b0b16] shadow-[0_0_60px_rgba(0,0,0,0.6)]"
      >
        <header className="flex items-start justify-between gap-3 border-b border-white/[0.06] px-6 py-5">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-300/80">
              Detalle del producto
            </p>
            <h2 className="mt-1 truncate text-lg font-semibold tracking-tight text-white">
              {producto?.nombre ?? "Cargando…"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <X className="size-4" aria-hidden />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {error ? (
            <p className="text-sm text-zinc-500">
              No se pudo cargar el detalle del producto.
            </p>
          ) : !producto ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  className="h-12 animate-pulse rounded-lg bg-white/[0.04]"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <SkuTag codigo={producto.codigoSKU} />
                <ProductStatusBadge activo={producto.activo} />
                <ProductStockBadge stockBajo={producto.stockBajo} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3.5">
                  <p className="text-[11px] text-zinc-500">Stock actual</p>
                  <p className="mt-1 font-mono text-xl font-semibold tabular-nums text-white">
                    {formatearNumero(stock?.stockActual ?? producto.stockActual)}
                  </p>
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3.5">
                  <p className="text-[11px] text-zinc-500">Stock mínimo</p>
                  <p className="mt-1 font-mono text-xl font-semibold tabular-nums text-zinc-300">
                    {formatearNumero(producto.stockMinimo)}
                  </p>
                </div>
              </div>

              <Dato etiqueta="Precio">
                <span className="font-mono text-base font-semibold tabular-nums text-white">
                  {formatearMoneda(producto.precio)}
                </span>
              </Dato>

              <Dato etiqueta="Categoría">{producto.categoriaNombre}</Dato>

              <Dato etiqueta="Proveedor">
                {producto.proveedorNombre ?? "Sin proveedor asignado"}
              </Dato>

              <Dato etiqueta="Descripción">
                <p className="leading-relaxed text-zinc-400">
                  {producto.descripcion?.trim() || "Sin descripción."}
                </p>
              </Dato>
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}
