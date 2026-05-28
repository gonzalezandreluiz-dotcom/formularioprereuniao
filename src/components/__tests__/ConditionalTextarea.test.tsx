import { render, screen, fireEvent } from '@testing-library/react'
import { ConditionalTextarea } from '../ConditionalTextarea'

describe('ConditionalTextarea', () => {
  it('não mostra textarea quando valor é Não', () => {
    render(
      <ConditionalTextarea
        value="Não"
        textValue=""
        onYesNoChange={() => {}}
        onTextChange={() => {}}
      />
    )
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('mostra textarea quando valor é Sim', () => {
    render(
      <ConditionalTextarea
        value="Sim"
        textValue=""
        onYesNoChange={() => {}}
        onTextChange={() => {}}
        placeholder="Descreva aqui…"
      />
    )
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Descreva aqui…')).toBeInTheDocument()
  })

  it('chama onYesNoChange ao clicar em Sim', () => {
    const onYesNoChange = vi.fn()
    render(
      <ConditionalTextarea
        value="Não"
        textValue=""
        onYesNoChange={onYesNoChange}
        onTextChange={() => {}}
      />
    )
    fireEvent.click(screen.getByText('Sim'))
    expect(onYesNoChange).toHaveBeenCalledWith('Sim')
  })

  it('chama onTextChange ao digitar na textarea', () => {
    const onTextChange = vi.fn()
    render(
      <ConditionalTextarea
        value="Sim"
        textValue=""
        onYesNoChange={() => {}}
        onTextChange={onTextChange}
      />
    )
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'dívida FGTS' } })
    expect(onTextChange).toHaveBeenCalledWith('dívida FGTS')
  })
})
