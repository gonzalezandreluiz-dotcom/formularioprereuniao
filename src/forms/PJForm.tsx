import { PillSelect } from '@/components/PillSelect'
import { ConditionalTextarea } from '@/components/ConditionalTextarea'
import { SectionCard } from '@/components/SectionCard'
import { FormField } from '@/components/FormField'
import type { PJData } from '@/lib/types'
import {
  PORTE_EMPRESA, FATURAMENTO_ANUAL, REGIME_TRIBUTARIO,
  MARGEM_LIQUIDA, RESERVA_EMPRESA, FLUXO_CAIXA,
  CONTROLE_FINANCEIRO, SIM_NAO, SIM_NAO_SABER,
  OBJETIVO_PJ, PLANEJAMENTO_SUCESSORIO,
} from '@/constants/pj-fields'

interface PJFormProps {
  data: PJData
  onChange: (field: keyof PJData, value: string) => void
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

export function PJForm({ data, onChange }: PJFormProps) {
  const f = (field: keyof PJData) => (value: string) => onChange(field, value)

  return (
    <div>
      {/* 1 · Dados da Empresa */}
      <SectionCard number={1} title="Dados da Empresa">
        <FormField label="Razão social / Nome fantasia">
          <div className="w-full bg-[#eff6ff] border-[1.5px] border-[#93c5fd] rounded-lg px-3 py-2 text-sm text-[#111120]">
            {data.razao_social}
            <span className="ml-2 text-xs text-[#9898aa] italic">(preenchido via link)</span>
          </div>
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="CNPJ">
            <TextInput value={data.cnpj} onChange={f('cnpj')} placeholder="00.000.000/0001-00" />
          </FormField>
          <FormField label="Tempo de operação">
            <TextInput value={data.tempo_operacao} onChange={f('tempo_operacao')} placeholder="Ex: 5 anos" />
          </FormField>
        </div>
        <FormField label="Segmento de atuação">
          <TextInput value={data.segmento} onChange={f('segmento')} placeholder="Ex: Tecnologia, Saúde, Varejo…" />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Porte da empresa">
            <PillSelect options={PORTE_EMPRESA} value={data.porte} onChange={f('porte')} />
          </FormField>
          <FormField label="Número de sócios">
            <TextInput value={data.num_socios} onChange={f('num_socios')} placeholder="Ex: 2" />
          </FormField>
        </div>
      </SectionCard>

      {/* 2 · Situação Financeira */}
      <SectionCard number={2} title="Situação Financeira">
        <FormField label="Faturamento anual">
          <PillSelect options={FATURAMENTO_ANUAL} value={data.faturamento_anual} onChange={f('faturamento_anual')} />
        </FormField>
        <FormField label="Regime tributário">
          <PillSelect options={REGIME_TRIBUTARIO} value={data.regime_tributario} onChange={f('regime_tributario')} />
        </FormField>
        <FormField label="Margem líquida estimada">
          <PillSelect options={MARGEM_LIQUIDA} value={data.margem_liquida} onChange={f('margem_liquida')} />
        </FormField>
        <FormField label="Possui dívidas ou passivos relevantes?">
          <ConditionalTextarea
            value={data.possui_dividas}
            textValue={data.dividas_descricao}
            onYesNoChange={f('possui_dividas')}
            onTextChange={f('dividas_descricao')}
            placeholder="Descreva as dívidas ou passivos (tipo, valor aproximado)…"
          />
        </FormField>
        <FormField label="Reserva financeira da empresa">
          <PillSelect options={RESERVA_EMPRESA} value={data.reserva_financeira} onChange={f('reserva_financeira')} />
        </FormField>
        <FormField label="Fluxo de caixa">
          <PillSelect options={FLUXO_CAIXA} value={data.fluxo_caixa} onChange={f('fluxo_caixa')} />
        </FormField>
      </SectionCard>

      {/* 3 · Gestão Financeira Atual */}
      <SectionCard number={3} title="Gestão Financeira Atual">
        <FormField label="Tem controle financeiro organizado?">
          <PillSelect options={CONTROLE_FINANCEIRO} value={data.controle_financeiro} onChange={f('controle_financeiro')} />
        </FormField>
        <FormField label="Usa escritório contábil?">
          <PillSelect options={SIM_NAO} value={data.escritorio_contabil} onChange={f('escritorio_contabil')} />
        </FormField>
        <FormField label="A empresa possui investimentos? Em quais produtos?">
          <TextArea value={data.investimentos_empresa} onChange={f('investimentos_empresa')} placeholder="Digite aqui…" />
        </FormField>
        <FormField label="Faz distribuição de lucros? Com qual frequência?">
          <TextArea value={data.distribuicao_lucros} onChange={f('distribuicao_lucros')} placeholder="Digite aqui…" />
        </FormField>
      </SectionCard>

      {/* 4 · Objetivos da Empresa */}
      <SectionCard number={4} title="Objetivos da Empresa">
        <FormField label="Objetivo principal">
          <PillSelect options={OBJETIVO_PJ} value={data.objetivo_principal} onChange={f('objetivo_principal')} />
        </FormField>
        <FormField label="Prazo para o objetivo">
          <TextInput value={data.prazo_objetivo} onChange={f('prazo_objetivo')} placeholder="Ex: 3 anos" />
        </FormField>
        <FormField label="Planos de expansão ou investimento nos próximos 2 anos?">
          <PillSelect options={SIM_NAO} value={data.planos_expansao} onChange={f('planos_expansao')} />
        </FormField>
      </SectionCard>

      {/* 5 · Proteção & Previdência */}
      <SectionCard number={5} title="Proteção & Previdência">
        <FormField label="Sócios possuem previdência corporativa?">
          <PillSelect options={SIM_NAO_SABER} value={data.previdencia_corporativa} onChange={f('previdencia_corporativa')} />
        </FormField>
        <FormField label="Empresa possui seguro empresarial?">
          <PillSelect options={SIM_NAO} value={data.seguro_empresarial} onChange={f('seguro_empresarial')} />
        </FormField>
        <FormField label="Há planejamento sucessório dos sócios?">
          <PillSelect options={PLANEJAMENTO_SUCESSORIO} value={data.planejamento_sucessorio} onChange={f('planejamento_sucessorio')} />
        </FormField>
      </SectionCard>

      {/* 6 · Para a Reunião */}
      <SectionCard number={6} title="Para a Reunião">
        <FormField label="O que motivou buscar assessoria agora?">
          <TextArea value={data.motivacao_assessoria} onChange={f('motivacao_assessoria')} placeholder="Digite aqui…" />
        </FormField>
        <FormField label="Algo mais que queira compartilhar?">
          <TextArea value={data.informacoes_adicionais} onChange={f('informacoes_adicionais')} placeholder="Digite aqui…" />
        </FormField>
      </SectionCard>
    </div>
  )
}
