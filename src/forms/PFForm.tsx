import { PillSelect } from '@/components/PillSelect'
import { ConditionalTextarea } from '@/components/ConditionalTextarea'
import { SectionCard } from '@/components/SectionCard'
import { FormField } from '@/components/FormField'
import type { PFData } from '@/lib/types'
import {
  ESTADO_CIVIL, SIM_NAO, SIM_NAO_SABER,
  RENDA_FAIXAS, ALIQUOTA_IR, PERFIL_RISCO,
  HORIZONTE, DECLARACAO_IR, OBJETIVO_PF,
} from '@/constants/pf-fields'

interface PFFormProps {
  data: PFData
  onChange: (field: keyof PFData, value: string) => void
  errors: Set<keyof PFData>
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-[#F7F7F7] border-[1.5px] border-[#d0d0dc] rounded-lg px-3 py-2 text-sm text-[#111120] placeholder:text-[#888898] placeholder:italic focus:outline-none focus:border-[#1e3a8a]"
    />
  )
}

function TextArea({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      className="w-full bg-[#F7F7F7] border-[1.5px] border-[#d0d0dc] rounded-lg px-3 py-2 text-sm text-[#111120] placeholder:text-[#888898] placeholder:italic resize-none focus:outline-none focus:border-[#1e3a8a]"
    />
  )
}

export function PFForm({ data, onChange, errors }: PFFormProps) {
  const f = (field: keyof PFData) => (value: string) => onChange(field, value)

  return (
    <div>
      {/* 1 · Dados Pessoais */}
      <SectionCard number={1} title="Dados Pessoais">
        <FormField label="Nome" required>
          <div className="w-full bg-[#eff6ff] border-[1.5px] border-[#93c5fd] rounded-lg px-3 py-2 text-sm text-[#111120]">
            {data.nome}
            <span className="ml-2 text-xs text-[#9898aa] italic">(preenchido via link)</span>
          </div>
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Data de nascimento" required error={errors.has('data_nascimento')}>
            <TextInput value={data.data_nascimento} onChange={f('data_nascimento')} placeholder="DD/MM/AAAA" />
          </FormField>
          <FormField label="Idade" required error={errors.has('idade')}>
            <TextInput value={data.idade} onChange={f('idade')} placeholder="Ex: 35" />
          </FormField>
        </div>
        <FormField label="Estado civil" required error={errors.has('estado_civil')}>
          <PillSelect options={ESTADO_CIVIL} value={data.estado_civil} onChange={f('estado_civil')} />
        </FormField>
        <FormField label="Profissão / ocupação" required error={errors.has('profissao')}>
          <TextInput value={data.profissao} onChange={f('profissao')} placeholder="Ex: Engenheiro, Médico, Empresário…" />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Número de dependentes" required error={errors.has('num_dependentes')}>
            <TextInput value={data.num_dependentes} onChange={f('num_dependentes')} placeholder="Ex: 2" />
          </FormField>
          <FormField label="Possui pets?">
            <PillSelect options={SIM_NAO} value={data.possui_pets} onChange={f('possui_pets')} />
          </FormField>
        </div>
      </SectionCard>

      {/* 2 · Situação Financeira Atual */}
      <SectionCard number={2} title="Situação Financeira Atual">
        <FormField label="Renda mensal bruta" required error={errors.has('renda_mensal_bruta')}>
          <PillSelect options={RENDA_FAIXAS} value={data.renda_mensal_bruta} onChange={f('renda_mensal_bruta')} />
        </FormField>
        <FormField label="Alíquota de IR">
          <PillSelect options={ALIQUOTA_IR} value={data.aliquota_ir} onChange={f('aliquota_ir')} />
        </FormField>
        <FormField label="Possui dívidas?">
          <ConditionalTextarea
            value={data.possui_dividas}
            textValue={data.dividas_descricao}
            onYesNoChange={f('possui_dividas')}
            onTextChange={f('dividas_descricao')}
            placeholder="Descreva as dívidas (tipo, valor aproximado)…"
          />
        </FormField>
      </SectionCard>

      {/* 3 · Perfil de Investidor */}
      <SectionCard number={3} title="Perfil de Investidor">
        <FormField label="Perfil de risco" required error={errors.has('perfil_risco')}>
          <PillSelect options={PERFIL_RISCO} value={data.perfil_risco} onChange={f('perfil_risco')} />
        </FormField>
        <FormField label="Já investe atualmente?">
          <PillSelect options={SIM_NAO} value={data.ja_investe} onChange={f('ja_investe')} />
        </FormField>
        {data.ja_investe === 'Sim' && (
          <FormField label="Quais são os seus investimentos nacionais e internacionais?">
            <TextArea value={data.ja_investe_descricao} onChange={f('ja_investe_descricao')} placeholder="Digite aqui os investimentos nacionais e internacionais…" />
          </FormField>
        )}
        <FormField label="Horizonte de investimento">
          <PillSelect options={HORIZONTE} value={data.horizonte_investimento} onChange={f('horizonte_investimento')} />
        </FormField>
        <FormField label="Declaração de imposto de renda">
          <PillSelect options={DECLARACAO_IR} value={data.declaracao_ir} onChange={f('declaracao_ir')} />
        </FormField>
      </SectionCard>

      {/* 4 · Objetivos Financeiros */}
      <SectionCard number={4} title="Objetivos Financeiros">
        <FormField label="Objetivo principal" required error={errors.has('objetivo_principal')}>
          <PillSelect options={OBJETIVO_PF} value={data.objetivo_principal} onChange={f('objetivo_principal')} />
        </FormField>
        <FormField label="Prazo para o objetivo principal">
          <TextInput value={data.prazo_objetivo} onChange={f('prazo_objetivo')} placeholder="Ex: 15 anos" />
        </FormField>
        <FormField label="Valor ou renda necessários para o objetivo principal">
          <TextInput value={data.valor_renda_objetivo} onChange={f('valor_renda_objetivo')} placeholder="Ex: R$3.000.000 ou renda de R$15.000/mês" />
        </FormField>
        <FormField label="Outros objetivos secundários">
          <TextArea value={data.objetivos_secundarios} onChange={f('objetivos_secundarios')} placeholder="Digite aqui…" />
        </FormField>
        <FormField label="Valor ou renda para os objetivos secundários">
          <TextArea value={data.valor_renda_secundarios} onChange={f('valor_renda_secundarios')} placeholder="Digite aqui…" />
        </FormField>
      </SectionCard>

      {/* 5 · Proteção & Seguros */}
      <SectionCard number={5} title="Proteção & Seguros">
        <FormField label="Possui seguro de vida?">
          <PillSelect options={SIM_NAO} value={data.seguro_vida} onChange={f('seguro_vida')} />
        </FormField>
        <FormField label="Possui plano de saúde?">
          <PillSelect options={SIM_NAO} value={data.plano_saude} onChange={f('plano_saude')} />
        </FormField>
        <FormField label="Possui previdência privada?">
          <PillSelect options={SIM_NAO_SABER} value={data.previdencia_privada} onChange={f('previdencia_privada')} />
        </FormField>
      </SectionCard>

      {/* 6 · Para a Reunião */}
      <SectionCard number={6} title="Para a Reunião">
        <FormField label="O que te motivou a buscar assessoria agora?">
          <TextArea value={data.motivacao_assessoria} onChange={f('motivacao_assessoria')} placeholder="Digite aqui…" />
        </FormField>
        <FormField label="Já teve assessor financeiro antes?">
          <PillSelect options={SIM_NAO} value={data.teve_assessor} onChange={f('teve_assessor')} />
        </FormField>
        <FormField label="Algo mais que queira compartilhar?">
          <TextArea value={data.informacoes_adicionais} onChange={f('informacoes_adicionais')} placeholder="Digite aqui…" />
        </FormField>
        <FormField label="Já tem conta na XP?" required error={errors.has('conta_xp')}>
          <PillSelect options={SIM_NAO} value={data.conta_xp} onChange={f('conta_xp')} />
          {data.conta_xp === 'Não' && (
            <p className="mt-2 text-sm text-[#52526a]">
              Abra sua conta agora:{' '}
              <a
                href="https://cadastro.xpi.com.br/passo/assessor/step1?assessor=A40777"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1e3a8a] font-medium underline underline-offset-2"
              >
                cadastro.xpi.com.br
              </a>
            </p>
          )}
        </FormField>
      </SectionCard>
    </div>
  )
}
