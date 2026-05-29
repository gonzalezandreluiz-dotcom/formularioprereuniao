export interface Client {
  id: string
  name: string
  token: string
  created_at: string
}

export interface Submission {
  id: string
  client_id: string
  pf_data: PFData | null
  pj_data: PJData | null
  submitted_at: string
}

export interface PFData {
  // Seção 1
  nome: string
  data_nascimento: string
  idade: string
  estado_civil: string
  profissao: string
  num_dependentes: string
  possui_pets: string
  // Seção 2
  renda_mensal_bruta: string
  aliquota_ir: string
  possui_dividas: string
  dividas_descricao: string
  // Seção 3
  perfil_risco: string
  ja_investe: string
  ja_investe_descricao: string
  horizonte_investimento: string
  declaracao_ir: string
  // Seção 4
  objetivo_principal: string
  prazo_objetivo: string
  valor_renda_objetivo: string
  objetivos_secundarios: string
  valor_renda_secundarios: string
  // Seção 5
  seguro_vida: string
  plano_saude: string
  previdencia_privada: string
  // Seção 6
  motivacao_assessoria: string
  teve_assessor: string
  informacoes_adicionais: string
  conta_xp: string
}

export interface PJData {
  // Seção 1
  razao_social: string
  cnpj: string
  segmento: string
  porte: string
  num_socios: string
  tempo_operacao: string
  // Seção 2
  faturamento_anual: string
  regime_tributario: string
  margem_liquida: string
  possui_dividas: string
  dividas_descricao: string
  reserva_financeira: string
  fluxo_caixa: string
  // Seção 3
  controle_financeiro: string
  escritorio_contabil: string
  investimentos_empresa: string
  distribuicao_lucros: string
  // Seção 4
  objetivo_principal: string
  prazo_objetivo: string
  planos_expansao: string
  // Seção 5
  previdencia_corporativa: string
  seguro_empresarial: string
  planejamento_sucessorio: string
  // Seção 6
  motivacao_assessoria: string
  informacoes_adicionais: string
}

// `nome` is excluded — it is always auto-populated from the client token and never empty
export const PF_REQUIRED_FIELDS: (keyof PFData)[] = [
  'data_nascimento',
  'idade',
  'estado_civil',
  'profissao',
  'num_dependentes',
  'renda_mensal_bruta',
  'perfil_risco',
  'objetivo_principal',
  'conta_xp',
]
