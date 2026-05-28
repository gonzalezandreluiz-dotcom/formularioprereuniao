import { render, screen, fireEvent } from '@testing-library/react'
import { PFForm } from '../PFForm'
import type { PFData } from '@/lib/types'

const emptyPF: PFData = {
  nome: 'João Silva', data_nascimento: '', idade: '', estado_civil: '',
  profissao: '', num_dependentes: '', possui_pets: '',
  renda_mensal_bruta: '', aliquota_ir: '', possui_dividas: 'Não', dividas_descricao: '',
  perfil_risco: '', ja_investe: '', horizonte_investimento: '', declaracao_ir: '',
  objetivo_principal: '', prazo_objetivo: '', valor_renda_objetivo: '',
  objetivos_secundarios: '', valor_renda_secundarios: '',
  seguro_vida: '', plano_saude: '', previdencia_privada: '',
  motivacao_assessoria: '', teve_assessor: '', informacoes_adicionais: '',
}

describe('PFForm', () => {
  it('exibe o nome pré-preenchido como somente leitura', () => {
    render(<PFForm data={emptyPF} onChange={() => {}} errors={new Set()} />)
    expect(screen.getByText('João Silva')).toBeInTheDocument()
  })

  it('renderiza campos obrigatórios com asterisco', () => {
    render(<PFForm data={emptyPF} onChange={() => {}} errors={new Set()} />)
    expect(screen.getByText('Estado civil')).toBeInTheDocument()
  })

  it('mostra erro inline nos campos inválidos', () => {
    const errors = new Set<keyof PFData>(['estado_civil', 'perfil_risco'])
    render(<PFForm data={emptyPF} onChange={() => {}} errors={errors} />)
    const errorMsgs = screen.getAllByText('Campo obrigatório')
    expect(errorMsgs.length).toBeGreaterThanOrEqual(2)
  })

  it('chama onChange ao selecionar estado civil', () => {
    const onChange = vi.fn()
    render(<PFForm data={emptyPF} onChange={onChange} errors={new Set()} />)
    fireEvent.click(screen.getByText('Casado'))
    expect(onChange).toHaveBeenCalledWith('estado_civil', 'Casado')
  })

  it('exibe textarea de dívidas ao selecionar Sim em possui_dividas', () => {
    const data = { ...emptyPF, possui_dividas: 'Sim' }
    render(<PFForm data={data} onChange={() => {}} errors={new Set()} />)
    expect(screen.getByPlaceholderText(/descreva as dívidas/i)).toBeInTheDocument()
  })
})
