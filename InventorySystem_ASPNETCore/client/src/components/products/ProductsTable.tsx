import { useState } from "react"
import { Check, Eye, PackageX, Pencil, Trash2, X } from "lucide-react"
import { Panel } from "@/components/dashboard/Panel"
import { SkuTag } from "@/components/dashboard/SkuTag"
import { ProductStatusBadge } from "@/components/products/ProductStatusBadge"
import { ProductStockBadge } from "@/components/products/ProductStockBadge"
import { formatearMoneda, formatearNumero } from "@/lib/format"
import type { ProductoList } from "@/types/product"

interface ProductsTableProps {
  productos: ProductoList[]
  filtroActivo: boolean
  onVerDetalle: (producto: ProductoList) => void
  onEditar: (producto: ProductoList) => void
  onEliminar: (producto: ProductoList) => Promise<void>
}

function AccionesFila({
  producto,
  onVerDetalle,
  onEditar,
  onEliminar,
}: {
  producto: ProductoList
  onVerDetalle: (producto: ProductoList) => void
  onEditar: (producto: ProductoList) => void
  onEliminar: (producto: ProductoList) => Promise<void>
}) {
  const [confirmando, setConfirmando] = useState(false)
  const [eliminando, setEliminando] = useState(false)

  if (confirmando) {
    return (
      <div className="flex items-center justify-end gap-1.5">
        <span className="mr-1 text-[11px] text-zinc-500">¿Desactivar?</span>
        <button
          type="button"
          disabled={eliminando}
          onClick={async () => {
            setEliminando(true)
            try {
              await onEliminar(producto)
            } finally {
              setEliminando(false)
              setConfirmando(false)
            }
          }}
          aria-label={`Confirmar desactivación de ${producto.nombre}`}
          className="flex size-7 items-center justify-center rounded-md bg-rose-500/15 text-rose-300 ring-1 ring-inset ring-rose-400/30 transition-colors hover:bg-rose-500/25 disabled:opacity-50"
        >
          <Check className="size-3.5" aria-hidden />
        </button>
        <button
          type="button"
          disabled={eliminando}
          onClick={() => setConfirmando(false)}
          aria-label="Cancelar"
          className="flex size-7 items-center justify-center rounded-md text-zinc-400 ring-1 ring-inset ring-white/10 transition-colors hover:bg-white/5 hover:text-white"
        >
          <X className="size-3.5" aria-hidden />
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-end gap-1.5">
      <button
        type="button"
        onClick={() => onVerDetalle(producto)}
        aria-label={`Ver detalle de ${producto.nombre}`}
        title="Ver detalle"
        className="flex size-7 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-indigo-500/15 hover:text-indigo-300"
      >
        <Eye className="size-3.5" aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => onEditar(producto)}
        aria-label={`Editar ${producto.nombre}`}
        title="Editar producto"
        className="flex size-7 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
      >
        <Pencil className="size-3.5" aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => setConfirmando(true)}
        aria-label={`Desactivar ${producto.nombre}`}
        title="Desactivar producto"
        className="flex size-7 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-rose-500/15 hover:text-rose-300"
      >
        <Trash2 className="size-3.5" aria-hidden />
      </button>
    </div>
  )
}

export function ProductsTable({
  productos,
  filtroActivo,
  onVerDetalle,
  onEditar,
  onEliminar,
}: ProductsTableProps) {
  if (productos.length === 0) {
    return (
      <Panel>
        <div className="flex flex-col items-center gap-4 px-6 py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
            <PackageX className="size-7 text-zinc-500" aria-hidden />
          </div>
          <div>
            <p className="font-semibold tracking-tight text-white">
              {filtroActivo
                ? "Sin resultados"
                : "No hay productos registrados"}
            </p>
            <p className="mx-auto mt-1 max-w-64 text-sm text-zinc-500">
              {filtroActivo
                ? "Ningún producto coincide con los filtros aplicados."
                : "Los productos del catálogo aparecerán aquí."}
            </p>
          </div>
        </div>
      </Panel>
    )
  }

  return (
    <Panel>
      <div className="overflow-x-auto pb-2 pt-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] text-left text-[11px] font-medium uppercase tracking-wider text-zinc-600">
              <th className="px-6 py-3 font-medium">Producto</th>
              <th className="px-3 py-3 font-medium">SKU</th>
              <th className="hidden px-3 py-3 font-medium lg:table-cell">
                Categoría
              </th>
              <th className="hidden px-3 py-3 font-medium xl:table-cell">
                Proveedor
              </th>
              <th className="px-3 py-3 text-right font-medium">Precio</th>
              <th className="px-3 py-3 text-right font-medium">Stock</th>
              <th className="hidden px-3 py-3 text-right font-medium md:table-cell">
                Mínimo
              </th>
              <th className="px-3 py-3 font-medium">Estado</th>
              <th className="px-6 py-3 text-right font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {productos.map((prod) => (
              <tr
                key={prod.id}
                className="transition-colors hover:bg-white/[0.03]"
              >
                <td className="px-6 py-3.5">
                  <span
                    className="block max-w-52 truncate font-medium text-zinc-200"
                    title={prod.nombre}
                  >
                    {prod.nombre}
                  </span>
                </td>
                <td className="px-3 py-3.5">
                  <SkuTag codigo={prod.codigoSKU} />
                </td>
                <td className="hidden px-3 py-3.5 text-[13px] text-zinc-400 lg:table-cell">
                  {prod.categoriaNombre}
                </td>
                <td className="hidden px-3 py-3.5 text-[13px] text-zinc-400 xl:table-cell">
                  {prod.proveedorNombre ?? "—"}
                </td>
                <td className="whitespace-nowrap px-3 py-3.5 text-right font-mono text-[13px] font-medium tabular-nums text-white">
                  {formatearMoneda(prod.precio)}
                </td>
                <td className="px-3 py-3.5 text-right font-mono text-[13px] font-medium tabular-nums text-white">
                  {formatearNumero(prod.stockActual)}
                </td>
                <td className="hidden px-3 py-3.5 text-right font-mono text-[13px] tabular-nums text-zinc-500 md:table-cell">
                  {formatearNumero(prod.stockMinimo)}
                </td>
                <td className="px-3 py-3.5">
                  <div className="flex flex-wrap gap-1.5">
                    <ProductStatusBadge activo={prod.activo} />
                    <ProductStockBadge stockBajo={prod.stockBajo} />
                  </div>
                </td>
                <td className="px-6 py-3.5">
                  <AccionesFila
                    producto={prod}
                    onVerDetalle={onVerDetalle}
                    onEditar={onEditar}
                    onEliminar={onEliminar}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}
