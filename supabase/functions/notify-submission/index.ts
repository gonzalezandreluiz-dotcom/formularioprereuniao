import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const ADVISOR_EMAIL = Deno.env.get('ADVISOR_EMAIL')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  const { submissionId } = await req.json()
  const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  const { data: submission } = await sb
    .from('submissions')
    .select('*, clients(name)')
    .eq('id', submissionId)
    .single()

  if (!submission) {
    return new Response(JSON.stringify({ error: 'Submission not found' }), { status: 404 })
  }

  const clientName = (submission as any).clients?.name ?? 'Cliente'
  const date = new Date(submission.submitted_at)
  const dateStr = date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  const html = buildEmailHtml(clientName, dateStr, submission.pf_data, submission.pj_data)

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'formulario@norsen.com.br',
      to: ADVISOR_EMAIL,
      subject: `[Formulário respondido] ${clientName} — ${dateStr}`,
      html,
    }),
  })

  return new Response(JSON.stringify({ ok: true }), { status: 200 })
})

function buildEmailHtml(
  clientName: string,
  dateStr: string,
  pfData: Record<string, string> | null,
  pjData: Record<string, string> | null
): string {
  const style = `font-family:sans-serif;color:#111120;`
  const sectionStyle = `margin-bottom:24px;`
  const titleStyle = `font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#1e3a8a;margin-bottom:12px;`
  const rowStyle = `margin-bottom:8px;`
  const labelStyle = `font-size:11px;color:#6b6b80;margin-bottom:2px;`
  const valueStyle = `font-size:14px;color:#111120;`

  function row(label: string, value: string | undefined) {
    if (!value || value === 'Não') return ''
    return `<div style="${rowStyle}">
      <div style="${labelStyle}">${label}</div>
      <div style="${valueStyle}">${value}</div>
    </div>`
  }

  const pfHtml = pfData ? `
    <div style="${sectionStyle}">
      <div style="${titleStyle}">Pessoa Física</div>
      ${row('Data de nascimento', pfData.data_nascimento)}
      ${row('Idade', pfData.idade)}
      ${row('Estado civil', pfData.estado_civil)}
      ${row('Profissão', pfData.profissao)}
      ${row('Nº dependentes', pfData.num_dependentes)}
      ${row('Possui pets', pfData.possui_pets)}
      ${row('Renda mensal bruta', pfData.renda_mensal_bruta)}
      ${row('Alíquota de IR', pfData.aliquota_ir)}
      ${row('Dívidas', pfData.possui_dividas === 'Sim' ? (pfData.dividas_descricao || 'Sim') : '')}
      ${row('Perfil de risco', pfData.perfil_risco)}
      ${row('Já investe', pfData.ja_investe)}
      ${row('Horizonte', pfData.horizonte_investimento)}
      ${row('Declaração IR', pfData.declaracao_ir)}
      ${row('Objetivo principal', pfData.objetivo_principal)}
      ${row('Prazo do objetivo', pfData.prazo_objetivo)}
      ${row('Valor/renda objetivo', pfData.valor_renda_objetivo)}
      ${row('Objetivos secundários', pfData.objetivos_secundarios)}
      ${row('Valor/renda secundários', pfData.valor_renda_secundarios)}
      ${row('Seguro de vida', pfData.seguro_vida)}
      ${row('Plano de saúde', pfData.plano_saude)}
      ${row('Previdência privada', pfData.previdencia_privada)}
      ${row('Motivação assessoria', pfData.motivacao_assessoria)}
      ${row('Teve assessor antes', pfData.teve_assessor)}
      ${row('Informações adicionais', pfData.informacoes_adicionais)}
    </div>
  ` : ''

  const pjHtml = pjData ? `
    <div style="${sectionStyle}">
      <div style="${titleStyle}">Pessoa Jurídica</div>
      ${row('CNPJ', pjData.cnpj)}
      ${row('Segmento', pjData.segmento)}
      ${row('Porte', pjData.porte)}
      ${row('Nº sócios', pjData.num_socios)}
      ${row('Tempo de operação', pjData.tempo_operacao)}
      ${row('Faturamento anual', pjData.faturamento_anual)}
      ${row('Regime tributário', pjData.regime_tributario)}
      ${row('Margem líquida', pjData.margem_liquida)}
      ${row('Dívidas/passivos', pjData.possui_dividas === 'Sim' ? (pjData.dividas_descricao || 'Sim') : '')}
      ${row('Reserva financeira', pjData.reserva_financeira)}
      ${row('Fluxo de caixa', pjData.fluxo_caixa)}
      ${row('Controle financeiro', pjData.controle_financeiro)}
      ${row('Escritório contábil', pjData.escritorio_contabil)}
      ${row('Investimentos empresa', pjData.investimentos_empresa)}
      ${row('Distribuição de lucros', pjData.distribuicao_lucros)}
      ${row('Objetivo principal', pjData.objetivo_principal)}
      ${row('Prazo objetivo', pjData.prazo_objetivo)}
      ${row('Planos de expansão', pjData.planos_expansao)}
      ${row('Previdência corporativa', pjData.previdencia_corporativa)}
      ${row('Seguro empresarial', pjData.seguro_empresarial)}
      ${row('Planejamento sucessório', pjData.planejamento_sucessorio)}
      ${row('Motivação assessoria', pjData.motivacao_assessoria)}
      ${row('Informações adicionais', pjData.informacoes_adicionais)}
    </div>
  ` : ''

  return `
    <div style="${style}max-width:600px;margin:0 auto;padding:32px 24px;">
      <h1 style="font-size:20px;font-weight:700;margin-bottom:4px;">${clientName}</h1>
      <p style="font-size:13px;color:#6b6b80;margin-bottom:32px;">Formulário respondido em ${dateStr}</p>
      ${pfHtml}
      ${pjHtml}
    </div>
  `
}
