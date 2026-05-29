import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import type { Client, PFData, PJData } from '@/lib/types'
import { PF_REQUIRED_FIELDS } from '@/lib/types'
import { PFForm } from '@/forms/PFForm'
import { PJForm } from '@/forms/PJForm'
import { NotFoundPage } from './NotFoundPage'

function emptyPF(name: string): PFData {
  return {
    nome: name, data_nascimento: '', idade: '', estado_civil: '',
    profissao: '', num_dependentes: '', possui_pets: '',
    renda_mensal_bruta: '', aliquota_ir: '', possui_dividas: 'Não', dividas_descricao: '',
    perfil_risco: '', ja_investe: 'Não', ja_investe_descricao: '', horizonte_investimento: '', declaracao_ir: '',
    objetivo_principal: '', prazo_objetivo: '', valor_renda_objetivo: '',
    objetivos_secundarios: '', valor_renda_secundarios: '',
    seguro_vida: '', plano_saude: '', previdencia_privada: '',
    motivacao_assessoria: '', teve_assessor: '', informacoes_adicionais: '',
  }
}

function emptyPJ(name: string): PJData {
  return {
    razao_social: name, cnpj: '', segmento: '', porte: '', num_socios: '', tempo_operacao: '',
    faturamento_anual: '', regime_tributario: '', margem_liquida: '', possui_dividas: 'Não',
    dividas_descricao: '', reserva_financeira: '', fluxo_caixa: '', controle_financeiro: '',
    escritorio_contabil: '', investimentos_empresa: '', distribuicao_lucros: '',
    objetivo_principal: '', prazo_objetivo: '', planos_expansao: '', previdencia_corporativa: '',
    seguro_empresarial: '', planejamento_sucessorio: '', motivacao_assessoria: '',
    informacoes_adicionais: '',
  }
}

type Status = 'loading' | 'ready' | 'not_found' | 'submitting' | 'success' | 'error'

export function FormPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const [status, setStatus] = useState<Status>('loading')
  const [client, setClient] = useState<Client | null>(null)
  const [activeTab, setActiveTab] = useState<'pf' | 'pj'>('pf')
  const [pfData, setPFData] = useState<PFData>(emptyPF(''))
  const [pjData, setPJData] = useState<PJData>(emptyPJ(''))
  const [pfErrors, setPFErrors] = useState<Set<keyof PFData>>(new Set())
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    if (!token) { setStatus('not_found'); return }
    ;(async () => {
      try {
        const { data, error } = await supabase.from('clients').select('*').eq('token', token).single()
        if (error || !data) { setStatus('not_found'); return }
        setClient(data)
        setPFData(emptyPF(data.name))
        setPJData(emptyPJ(data.name))
        setStatus('ready')
      } catch {
        setStatus('not_found')
      }
    })()
  }, [token])

  function handlePFChange(field: keyof PFData, value: string) {
    setPFData(prev => ({ ...prev, [field]: value }))
    if (pfErrors.has(field)) {
      setPFErrors(prev => { const s = new Set(prev); s.delete(field); return s })
    }
  }

  function validate(): boolean {
    const errors = new Set<keyof PFData>()
    PF_REQUIRED_FIELDS.forEach(field => {
      if (!pfData[field]) errors.add(field)
    })
    setPFErrors(errors)
    if (errors.size > 0) {
      setActiveTab('pf')
      setTimeout(() => {
        document.querySelector('[data-error="true"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 50)
    }
    return errors.size === 0
  }

  async function handleSubmit() {
    if (!validate() || !client) return
    setStatus('submitting')
    setSubmitError('')

    const { data: submission, error: insertError } = await supabase
      .from('submissions')
      .insert({ client_id: client.id, pf_data: pfData, pj_data: pjData })
      .select()
      .single()

    if (insertError || !submission) {
      setStatus('ready')
      setSubmitError('Erro ao enviar. Tente novamente.')
      return
    }

    const { error: notifyError } = await supabase.functions.invoke('notify-submission', { body: { submissionId: submission.id } })
    if (notifyError) {
      setStatus('ready')
      setSubmitError('Erro ao enviar notificação. Tente novamente.')
      return
    }
    setStatus('success')
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
        <p className="text-[#52526a]">Carregando…</p>
      </div>
    )
  }

  if (status === 'not_found') return <NotFoundPage />

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl border border-[#dcdce6] max-w-md">
          <div className="text-4xl mb-4">✅</div>
          <h1 className="text-xl font-bold text-[#0d0d1a] mb-2">Respostas enviadas com sucesso!</h1>
          <p className="text-sm text-[#4a4a62]">Obrigado. Nos vemos em breve.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      {/* Header */}
      <header className="bg-white border-b border-[#dcdce6] px-6 py-4 flex items-center gap-3.5">
        <div className="w-9 h-9 bg-[#1e3a8a] rounded-lg flex items-center justify-center text-white font-bold text-base flex-shrink-0">N</div>
        <div>
          <h1 className="text-[15px] font-bold text-[#0d0d1a]">Norsen Assessoria</h1>
          <p className="text-xs text-[#52526a]">Formulário de Pré-Reunião</p>
        </div>
      </header>

      <div className="max-w-[700px] mx-auto px-5 py-8 pb-20">
        {/* Welcome */}
        <div className="mb-6">
          <h2 className="text-[22px] font-bold text-[#0d0d1a] mb-2">
            Olá, {client!.name}
          </h2>
          <p className="text-sm text-[#4a4a62] leading-relaxed">
            Antes da nossa reunião, gostaríamos de conhecer um pouco mais sobre você.<br />
            Preencha o formulário abaixo para que possamos aproveitar melhor o nosso tempo juntos.
          </p>
          {activeTab === 'pf' && (
            <p className="mt-2.5 text-xs text-[#52526a]">
              <span className="text-red-500">*</span> Campos obrigatórios
            </p>
          )}
          {activeTab === 'pj' && (
            <p className="mt-2.5 text-xs text-[#52526a] bg-[#f0f4ff] border border-[#c7d7f8] rounded-md px-3 py-1.5 inline-flex items-center gap-1.5">
              ℹ️ Todos os campos desta aba são opcionais
            </p>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#e6e6ec] rounded-xl p-1 mb-6">
          {(['pf', 'pj'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 px-4 rounded-[7px] text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-white text-[#0d0d1a] shadow-sm font-semibold'
                  : 'text-[#52526a]'
              }`}
            >
              {tab === 'pf' ? 'Pessoa Física' : 'Pessoa Jurídica'}
            </button>
          ))}
        </div>

        {/* Forms */}
        {activeTab === 'pf'
          ? <PFForm data={pfData} onChange={handlePFChange} errors={pfErrors} />
          : <PJForm data={pjData} onChange={(f, v) => setPJData(prev => ({ ...prev, [f]: v }))} />
        }

        {/* Error toast */}
        {submitError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center justify-between gap-3">
            <span>{submitError}</span>
            <button
              type="button"
              onClick={() => setSubmitError('')}
              className="text-red-700 font-semibold underline whitespace-nowrap"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={status === 'submitting'}
          className="mt-6 w-full bg-[#1e3a8a] text-white font-semibold py-3.5 rounded-xl text-sm disabled:opacity-60"
        >
          {status === 'submitting' ? 'Enviando…' : 'Enviar respostas'}
        </button>
      </div>
    </div>
  )
}
