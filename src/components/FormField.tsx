interface FormFieldProps {
  label: string
  required?: boolean
  error?: boolean
  children: React.ReactNode
}

export function FormField({ label, required, error, children }: FormFieldProps) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#1e1e32] mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-red-500">Campo obrigatório</p>
      )}
    </div>
  )
}
