export function NotFoundPage({ message }: { message?: string }) {
  return (
    <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-[#0d0d1a] mb-3">Link inválido</h1>
        <p className="text-[#4a4a62]">
          {message ?? 'Solicite um novo link ao seu assessor.'}
        </p>
      </div>
    </div>
  )
}
