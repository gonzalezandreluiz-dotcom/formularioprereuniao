import { PillSelect } from './PillSelect'

interface ConditionalTextareaProps {
  value: string
  textValue: string
  onYesNoChange: (value: string) => void
  onTextChange: (value: string) => void
  placeholder?: string
}

export function ConditionalTextarea({
  value,
  textValue,
  onYesNoChange,
  onTextChange,
  placeholder = 'Descreva aqui…',
}: ConditionalTextareaProps) {
  return (
    <div>
      <PillSelect options={['Sim', 'Não']} value={value} onChange={onYesNoChange} />
      {value === 'Sim' && (
        <textarea
          value={textValue}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="mt-2.5 w-full bg-[#F7F7F7] border-[1.5px] border-[#d0d0dc] rounded-lg px-3 py-2 text-sm text-[#111120] placeholder:text-[#888898] placeholder:italic resize-none focus:outline-none focus:border-[#1e3a8a]"
        />
      )}
    </div>
  )
}
