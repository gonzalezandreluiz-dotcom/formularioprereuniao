import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Client, Submission } from '@/lib/types'

type View = 'checking' | 'login' | 'dashboard' | 'responses'

const PF_LABELS: Record<string, string> = {
  data_nascimento: 'Data de nascimento', idade: 'Idade', estado_civil: 'Estado civil',
  profissao: 'Profissão', num_dependentes: 'Nº dependentes', possui_pets: 'Possui pets',
  renda_mensal_bruta: 'Renda mensal bruta', aliquota_ir: 'Alíquota de IR',
  possui_dividas: 'Possui dívidas', dividas_descricao: 'Dívidas',
  perfil_risco: 'Perfil de risco', ja_investe: 'Já investe', ja_investe_descricao: 'Investimentos', horizonte_investimento: 'Horizonte',
  declaracao_ir: 'Declaração IR', objetivo_principal: 'Objetivo principal',
  prazo_objetivo: 'Prazo', valor_renda_objetivo: 'Valor/renda objetivo',
  objetivos_secundarios: 'Obj. secundários', valor_renda_secundarios: 'Valor/renda secundários',
  seguro_vida: 'Seguro de vida', plano_saude: 'Plano de saúde',
  previdencia_privada: 'Previdência privada', motivacao_assessoria: 'Motivação',
  teve_assessor: 'Teve assessor', informacoes_adicionais: 'Informações adicionais',
  conta_xp: 'Conta na XP',
  // PJ
  razao_social: 'Razão social', cnpj: 'CNPJ', segmento: 'Segmento', porte: 'Porte',
  num_socios: 'Nº sócios', tempo_operacao: 'Tempo de operação',
  faturamento_anual: 'Faturamento anual', regime_tributario: 'Regime tributário',
  margem_liquida: 'Margem líquida', reserva_financeira: 'Reserva financeira',
  fluxo_caixa: 'Fluxo de caixa', controle_financeiro: 'Controle financeiro',
  escritorio_contabil: 'Escritório contábil', investimentos_empresa: 'Investimentos empresa',
  distribuicao_lucros: 'Distribuição de lucros', planos_expansao: 'Planos de expansão',
  previdencia_corporativa: 'Previdência corporativa', seguro_empresarial: 'Seguro empresarial',
  planejamento_sucessorio: 'Planejamento sucessório',
}

function SubmissionSection({ title, data }: { title: string; data: Record<string, string> }) {
  const SKIP = new Set(['nome', 'razao_social'])
  const entries = Object.entries(data).filter(([k, v]) => !SKIP.has(k) && v && v !== 'Não')
  if (entries.length === 0) return null
  return (
    <div className="mb-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#1e3a8a] mb-3">{title}</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {entries.map(([key, value]) => (
          <div key={key}>
            <p className="text-[11px] text-[#6b6b80]">{PF_LABELS[key] ?? key}</p>
            <p className="text-sm text-[#111120]">{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function ClientRow({ client, formUrl, onViewResponses, onDelete, onDownloadPDF }: {
  client: Client
  formUrl: string
  onViewResponses: () => void
  onDelete: () => void
  onDownloadPDF: () => void
}) {
  const [copied, setCopied] = useState(false)
  const [confirming, setConfirming] = useState(false)

  function copyLink() {
    navigator.clipboard.writeText(formUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="px-5 py-3.5 border-b border-[#f0f0f5] last:border-0">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#0d0d1a]">{client.name}</p>
          <p className="text-xs text-[#52526a]">{new Date(client.created_at).toLocaleDateString('pt-BR')}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={copyLink}
            title={formUrl}
            className="text-xs text-[#52526a] font-medium px-3 py-1.5 border border-[#d0d0dc] rounded-lg hover:border-[#1e3a8a] hover:text-[#1e3a8a] transition-colors"
          >
            {copied ? 'Copiado!' : 'Copiar link'}
          </button>
          <button
            onClick={onDownloadPDF}
            className="text-xs text-[#52526a] font-medium px-3 py-1.5 border border-[#d0d0dc] rounded-lg hover:border-[#1e3a8a] hover:text-[#1e3a8a] transition-colors"
          >
            Baixar PDF
          </button>
          <button
            onClick={onViewResponses}
            className="text-xs text-[#1e3a8a] font-semibold px-3 py-1.5 border border-[#1e3a8a] rounded-lg"
          >
            Ver respostas
          </button>
          {confirming ? (
            <div className="flex items-center gap-1">
              <span className="text-xs text-[#52526a]">Confirmar?</span>
              <button
                onClick={() => { setConfirming(false); onDelete() }}
                className="text-xs text-white font-semibold px-2 py-1.5 bg-red-500 rounded-lg"
              >
                Sim
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="text-xs text-[#52526a] font-medium px-2 py-1.5 border border-[#d0d0dc] rounded-lg"
              >
                Não
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              className="text-xs text-red-400 font-medium px-3 py-1.5 border border-red-200 rounded-lg hover:border-red-400 hover:text-red-500 transition-colors"
            >
              Excluir
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export function AdminPage() {
  const [view, setView] = useState<View>('checking')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [clients, setClients] = useState<Client[]>([])
  const [newClientName, setNewClientName] = useState('')
  const [generatedToken, setGeneratedToken] = useState('')
  const [generating, setGenerating] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loadingSubmissions, setLoadingSubmissions] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) { setView('dashboard'); loadClients() }
      else setView('login')
    })
  }, [])

  async function loadClients() {
    const { data } = await supabase.from('clients').select('*').order('created_at', { ascending: false })
    setClients(data ?? [])
  }

  async function handleLogin() {
    setLoginError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setLoginError('Email ou senha incorretos.'); return }
    setView('dashboard')
    loadClients()
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    setView('login')
    setEmail('')
    setPassword('')
  }

  function slugify(name: string): string {
    return name
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  async function handleGenerateLink() {
    if (!newClientName.trim()) return
    setGenerating(true)
    setGeneratedToken('')

    const slug = `${slugify(newClientName.trim())}-${crypto.randomUUID().replace(/-/g, '').slice(0, 8)}`

    const { data } = await supabase
      .from('clients')
      .insert({ name: newClientName.trim(), token: slug })
      .select()
      .single()
    if (data) {
      setGeneratedToken(data.token)
      setNewClientName('')
      loadClients()
    }
    setGenerating(false)
  }

  async function handleDownloadPDF(client: Client) {
    const { data } = await supabase
      .from('submissions')
      .select('*')
      .eq('client_id', client.id)
      .order('submitted_at', { ascending: false })

    const submissions = data ?? []
    const date = new Date().toLocaleDateString('pt-BR')

    function esc(s: string | undefined) {
      return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    }
    function row(label: string, value: string | undefined) {
      if (!value || value === 'Não') return ''
      return `<div style="margin-bottom:10px"><div style="font-size:11px;color:#6b6b80">${esc(label)}</div><div style="font-size:13px;color:#111120">${esc(value)}</div></div>`
    }
    function section(title: string, rows: string) {
      if (!rows.trim()) return ''
      return `<div style="margin-bottom:20px"><div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#1e3a8a;margin-bottom:10px">${title}</div>${rows}</div>`
    }

    const body = submissions.length === 0
      ? '<p style="color:#6b6b80;font-size:13px">Nenhuma resposta registrada.</p>'
      : submissions.map(sub => {
          const d = new Date(sub.submitted_at).toLocaleString('pt-BR')
          const pf = sub.pf_data as Record<string,string> | null
          const pj = sub.pj_data as Record<string,string> | null
          const pfHtml = pf ? section('Pessoa Física', [
            row('Data de nascimento', pf.data_nascimento), row('Idade', pf.idade),
            row('Estado civil', pf.estado_civil), row('Profissão', pf.profissao),
            row('Nº dependentes', pf.num_dependentes), row('Possui pets', pf.possui_pets),
            row('Renda mensal bruta', pf.renda_mensal_bruta), row('Alíquota de IR', pf.aliquota_ir),
            row('Dívidas', pf.possui_dividas === 'Sim' ? (pf.dividas_descricao || 'Sim') : ''),
            row('Perfil de risco', pf.perfil_risco), row('Já investe', pf.ja_investe),
            row('Investimentos', pf.ja_investe_descricao), row('Horizonte', pf.horizonte_investimento),
            row('Declaração IR', pf.declaracao_ir), row('Objetivo principal', pf.objetivo_principal),
            row('Prazo do objetivo', pf.prazo_objetivo), row('Valor/renda objetivo', pf.valor_renda_objetivo),
            row('Objetivos secundários', pf.objetivos_secundarios), row('Valor/renda secundários', pf.valor_renda_secundarios),
            row('Seguro de vida', pf.seguro_vida), row('Plano de saúde', pf.plano_saude),
            row('Previdência privada', pf.previdencia_privada), row('Motivação assessoria', pf.motivacao_assessoria),
            row('Teve assessor antes', pf.teve_assessor), row('Informações adicionais', pf.informacoes_adicionais),
            row('Conta na XP', pf.conta_xp),
          ].join('')) : ''
          const pjHtml = pj ? section('Pessoa Jurídica', [
            row('CNPJ', pj.cnpj), row('Segmento', pj.segmento), row('Porte', pj.porte),
            row('Nº sócios', pj.num_socios), row('Tempo de operação', pj.tempo_operacao),
            row('Faturamento anual', pj.faturamento_anual), row('Regime tributário', pj.regime_tributario),
            row('Margem líquida', pj.margem_liquida),
            row('Dívidas/passivos', pj.possui_dividas === 'Sim' ? (pj.dividas_descricao || 'Sim') : ''),
            row('Reserva financeira', pj.reserva_financeira), row('Fluxo de caixa', pj.fluxo_caixa),
            row('Controle financeiro', pj.controle_financeiro), row('Escritório contábil', pj.escritorio_contabil),
            row('Investimentos empresa', pj.investimentos_empresa), row('Distribuição de lucros', pj.distribuicao_lucros),
            row('Objetivo principal', pj.objetivo_principal), row('Prazo objetivo', pj.prazo_objetivo),
            row('Planos de expansão', pj.planos_expansao), row('Previdência corporativa', pj.previdencia_corporativa),
            row('Seguro empresarial', pj.seguro_empresarial), row('Planejamento sucessório', pj.planejamento_sucessorio),
            row('Motivação assessoria', pj.motivacao_assessoria), row('Informações adicionais', pj.informacoes_adicionais),
          ].join('')) : ''
          return `<div style="border:1px solid #e5e7eb;border-radius:8px;padding:20px;margin-bottom:24px;page-break-inside:avoid">
            <div style="font-size:11px;color:#6b6b80;margin-bottom:16px">${d}</div>
            ${pfHtml}${pjHtml}
          </div>`
        }).join('')

    const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
      <title>${esc(client.name)} — Respostas</title>
      <style>@media print{body{margin:0}}</style>
    </head><body style="font-family:Arial,sans-serif;max-width:700px;margin:32px auto;padding:0 24px;color:#111120">
      <div style="margin-bottom:24px;padding-bottom:16px;border-bottom:2px solid #1e3a8a">
        <div style="font-size:20px;font-weight:700">${esc(client.name)}</div>
        <div style="font-size:12px;color:#6b6b80;margin-top:4px">Formulário de Pré-Reunião · Gerado em ${date}</div>
      </div>
      ${body}
    </body></html>`

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const win = window.open(url, '_blank')
    if (win) win.addEventListener('load', () => { win.print(); setTimeout(() => URL.revokeObjectURL(url), 60000) })
  }

  async function handleDeleteClient(client: Client) {
    await supabase.from('clients').delete().eq('id', client.id)
    loadClients()
  }

  async function handleViewResponses(client: Client) {
    setSelectedClient(client)
    setView('responses')
    setLoadingSubmissions(true)
    const { data } = await supabase
      .from('submissions')
      .select('*')
      .eq('client_id', client.id)
      .order('submitted_at', { ascending: false })
    setSubmissions(data ?? [])
    setLoadingSubmissions(false)
  }

  const formUrl = (token: string) => `${window.location.origin}/form?token=${token}`

  if (view === 'checking') {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
        <p className="text-[#52526a] text-sm">Carregando…</p>
      </div>
    )
  }

  if (view === 'login') {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
        <div className="bg-white border border-[#dcdce6] rounded-2xl p-8 w-full max-w-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-[#1e3a8a] rounded-lg flex items-center justify-center text-white font-bold">N</div>
            <div>
              <p className="text-sm font-bold text-[#0d0d1a]">Norsen Assessoria</p>
              <p className="text-xs text-[#52526a]">Área do assessor</p>
            </div>
          </div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setLoginError('') }}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full bg-[#F7F7F7] border-[1.5px] border-[#d0d0dc] rounded-lg px-3 py-2.5 text-sm mb-2 focus:outline-none focus:border-[#1e3a8a]"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setLoginError('') }}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full bg-[#F7F7F7] border-[1.5px] border-[#d0d0dc] rounded-lg px-3 py-2.5 text-sm mb-3 focus:outline-none focus:border-[#1e3a8a]"
          />
          {loginError && <p className="text-xs text-red-500 mb-3">{loginError}</p>}
          <button
            onClick={handleLogin}
            className="w-full bg-[#1e3a8a] text-white font-semibold py-2.5 rounded-xl text-sm"
          >
            Entrar
          </button>
        </div>
      </div>
    )
  }

  if (view === 'responses' && selectedClient) {
    return (
      <div className="min-h-screen bg-[#F7F7F7]">
        <header className="bg-white border-b border-[#dcdce6] px-6 py-4 flex items-center gap-3">
          <button onClick={() => setView('dashboard')} className="text-sm text-[#1e3a8a] font-medium">
            ← Voltar
          </button>
          <span className="text-[#dcdce6]">|</span>
          <div>
            <p className="text-sm font-bold text-[#0d0d1a]">{selectedClient.name}</p>
            <p className="text-xs text-[#52526a]">Histórico de respostas</p>
          </div>
        </header>
        <div className="max-w-[700px] mx-auto px-5 py-8">
          {loadingSubmissions && <p className="text-sm text-[#52526a]">Carregando…</p>}
          {!loadingSubmissions && submissions.length === 0 && (
            <p className="text-sm text-[#52526a]">Nenhuma resposta recebida ainda.</p>
          )}
          {submissions.map((sub) => (
            <div key={sub.id} className="bg-white border border-[#dcdce6] rounded-xl p-5 mb-4">
              <p className="text-xs text-[#52526a] mb-4">
                {new Date(sub.submitted_at).toLocaleString('pt-BR')}
              </p>
              {sub.pf_data && <SubmissionSection title="Pessoa Física" data={sub.pf_data as unknown as Record<string, string>} />}
              {sub.pj_data && <SubmissionSection title="Pessoa Jurídica" data={sub.pj_data as unknown as Record<string, string>} />}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <header className="bg-white border-b border-[#dcdce6] px-6 py-4 flex items-center gap-3.5">
        <div className="w-9 h-9 bg-[#1e3a8a] rounded-lg flex items-center justify-center text-white font-bold">N</div>
        <div className="flex-1">
          <p className="text-sm font-bold text-[#0d0d1a]">Norsen Assessoria</p>
          <p className="text-xs text-[#52526a]">Área do assessor</p>
        </div>
        <button onClick={handleSignOut} className="text-xs text-[#52526a] hover:text-[#0d0d1a]">Sair</button>
      </header>

      <div className="max-w-[700px] mx-auto px-5 py-8">
        {/* Gerar link */}
        <div className="bg-white border border-[#dcdce6] rounded-xl p-5 mb-6">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#1e3a8a] mb-4">Gerar novo link</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Nome do cliente"
              value={newClientName}
              onChange={(e) => setNewClientName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerateLink()}
              className="flex-1 bg-[#F7F7F7] border-[1.5px] border-[#d0d0dc] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a8a]"
            />
            <button
              onClick={handleGenerateLink}
              disabled={generating || !newClientName.trim()}
              className="bg-[#1e3a8a] text-white font-semibold px-4 py-2 rounded-lg text-sm disabled:opacity-60"
            >
              Gerar link
            </button>
          </div>
          {generatedToken && (
            <div className="mt-3 flex items-center gap-2">
              <input
                readOnly
                value={formUrl(generatedToken)}
                className="flex-1 bg-[#F7F7F7] border border-[#d0d0dc] rounded-lg px-3 py-2 text-xs text-[#52526a]"
              />
              <button
                onClick={() => navigator.clipboard.writeText(formUrl(generatedToken))}
                className="text-xs text-[#1e3a8a] font-semibold px-3 py-2 border border-[#1e3a8a] rounded-lg"
              >
                Copiar
              </button>
            </div>
          )}
        </div>

        {/* Lista de clientes */}
        <div className="bg-white border border-[#dcdce6] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#dcdce6]">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#1e3a8a]">Clientes</h2>
          </div>
          {clients.length === 0 && (
            <p className="px-5 py-4 text-sm text-[#52526a]">Nenhum cliente cadastrado ainda.</p>
          )}
          {clients.map((client) => (
            <ClientRow
              key={client.id}
              client={client}
              formUrl={formUrl(client.token)}
              onViewResponses={() => handleViewResponses(client)}
              onDelete={() => handleDeleteClient(client)}
              onDownloadPDF={() => handleDownloadPDF(client)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
