interface PillSelectProps {
  options: string[]
  value: string
  onChange: (value: string) => void
}

export function PillSelect({ options, value, onChange }: PillSelectProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium border-[1.5px] transition-colors cursor-pointer
            ${value === option
              ? 'border-[#1e3a8a] bg-[#eff6ff] text-[#1e3a8a] font-semibold'
              : 'border-[#d0d0dc] bg-[#F7F7F7] text-[#52526a]'
            }`}
        >
          {option}
        </button>
      ))}
    </div>
  )
}
