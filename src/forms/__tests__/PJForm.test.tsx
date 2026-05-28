import { render, screen, fireEvent } from '@testing-library/react'
import { PJForm } from '../PJForm'
import type { PJData } from '@/lib/types'

const emptyPJ: PJData = {
  razao_social: 'Empresa ABC', cnpj: '', segmento: '', porte: '',
  num_socios: '', tempo_operacao: '', faturamento_anual: '',
  regime_tributario: '', margem_liquida: '', possui_dividas: 'Não',
  dividas_descricao: '', reserva_financeira: '', fluxo_caixa: '',
  controle_financeiro: '', escritorio_contabil: '', investimentos_empresa: '',
  distribuicao_lucros: '', objetivo_principal: '', prazo_objetivo: '',
  planos_expansao: '', previdencia_corporativa: '', seguro_empresarial: '',
  planejamento_sucessorio: '', motivacao_assessoria: '', informacoes_adicionais: '',
}

describe('PJForm', () => {
  it('exibe razão social pré-preenchida', () => {
    render(<PJForm data={emptyPJ} onChange={() => {}} />)
    expect(screen.getByText('Empresa ABC')).toBeInTheDocument()
  })

  it('nenhum campo é obrigatório (sem erros ao renderizar)', () => {
    render(<PJForm data={emptyPJ} onChange={() => {}} />)
    expect(screen.queryByText('Campo obrigatório')).not.toBeInTheDocument()
  })

  it('chama onChange ao selecionar porte', () => {
    const onChange = vi.fn()
    render(<PJForm data={emptyPJ} onChange={onChange} />)
    fireEvent.click(screen.getByText('MEI'))
    expect(onChange).toHaveBeenCalledWith('porte', 'MEI')
  })

  it('exibe textarea de dívidas ao selecionar Sim', () => {
    const data = { ...emptyPJ, possui_dividas: 'Sim' }
    render(<PJForm data={data} onChange={() => {}} />)
    expect(screen.getByPlaceholderText(/descreva as dívidas/i)).toBeInTheDocument()
  })
})
