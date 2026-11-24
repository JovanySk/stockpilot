import { cn } from "@/lib/utils"

interface PanelProps {
  children: React.ReactNode
  className?: string
}

export function Panel({ children, className }: PanelProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-white/[0.06] bg-white/[0.03] shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-sm",
        className,
      )}
    >
      {children}
    </section>
  )
}

interface PanelHeaderProps {
  titulo: string
  descripcion?: string
  accion?: React.ReactNode
}

export function PanelHeader({ titulo, descripcion, accion }: PanelHeaderProps) {
  return (
    <header className="flex items-start justify-between gap-3 px-6 pt-5">
      <div>
        <h3 className="text-[15px] font-semibold tracking-tight text-white">
          {titulo}
        </h3>
        {descripcion && (
          <p className="mt-0.5 text-xs text-zinc-500">{descripcion}</p>
        )}
      </div>
      {accion}
    </header>
  )
}
