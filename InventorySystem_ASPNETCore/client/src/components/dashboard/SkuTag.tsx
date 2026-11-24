export function SkuTag({ codigo }: { codigo: string }) {
  return (
    <code className="inline-block whitespace-nowrap rounded-md border border-white/10 bg-white/[0.05] px-2 py-0.5 font-mono text-[11px] font-medium tracking-wide text-zinc-400">
      {codigo}
    </code>
  )
}
