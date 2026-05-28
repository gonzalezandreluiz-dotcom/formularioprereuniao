interface SectionCardProps {
  number: number
  title: string
  children: React.ReactNode
}

export function SectionCard({ number, title, children }: SectionCardProps) {
  return (
    <div className="bg-white border border-[#dcdce6] rounded-xl p-5 mb-3.5">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#1e3a8a] mb-4">
        {number} · {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
  )
}
