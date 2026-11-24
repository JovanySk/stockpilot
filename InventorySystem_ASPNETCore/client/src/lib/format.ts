const monedaMXN = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
})

const numero = new Intl.NumberFormat("es-MX")

const fechaHora = new Intl.DateTimeFormat("es-MX", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
})

const fechaLarga = new Intl.DateTimeFormat("es-MX", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
})

export function formatearMoneda(valor: number): string {
  return monedaMXN.format(valor)
}

export function formatearNumero(valor: number): string {
  return numero.format(valor)
}

export function formatearFecha(iso: string): string {
  const fecha = new Date(iso)
  if (Number.isNaN(fecha.getTime())) return iso
  return fechaHora.format(fecha)
}

export function fechaActualLarga(): string {
  const texto = fechaLarga.format(new Date())
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}
