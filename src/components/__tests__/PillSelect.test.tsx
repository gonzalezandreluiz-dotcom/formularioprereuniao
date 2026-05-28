import { render, screen, fireEvent } from '@testing-library/react'
import { PillSelect } from '../PillSelect'

describe('PillSelect', () => {
  it('renderiza todas as opções', () => {
    render(<PillSelect options={['A', 'B', 'C']} value="" onChange={() => {}} />)
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
    expect(screen.getByText('C')).toBeInTheDocument()
  })

  it('aplica estilo selecionado na opção ativa', () => {
    render(<PillSelect options={['Sim', 'Não']} value="Sim" onChange={() => {}} />)
    const simBtn = screen.getByText('Sim')
    expect(simBtn).toHaveClass('border-[#1e3a8a]')
    expect(screen.getByText('Não')).not.toHaveClass('border-[#1e3a8a]')
  })

  it('chama onChange ao clicar em opção', () => {
    const onChange = vi.fn()
    render(<PillSelect options={['Sim', 'Não']} value="Não" onChange={onChange} />)
    fireEvent.click(screen.getByText('Sim'))
    expect(onChange).toHaveBeenCalledWith('Sim')
  })

  it('chama onChange mesmo ao clicar na opção já selecionada', () => {
    const onChange = vi.fn()
    render(<PillSelect options={['Sim', 'Não']} value="Sim" onChange={onChange} />)
    fireEvent.click(screen.getByText('Sim'))
    expect(onChange).toHaveBeenCalledWith('Sim')
  })
})
