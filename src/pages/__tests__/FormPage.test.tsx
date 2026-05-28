import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { FormPage } from '../FormPage'

const mockClient = { id: 'c1', name: 'João Silva', token: 'token-abc', created_at: '2026-05-28T00:00:00Z' }

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn().mockImplementation((table: string) => {
      if (table === 'clients') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: mockClient, error: null }),
        }
      }
      return {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { id: 's1' }, error: null }),
      }
    }),
    functions: {
      invoke: vi.fn().mockResolvedValue({ data: {}, error: null }),
    },
  },
}))

function renderFormPage(token = 'token-abc') {
  return render(
    <MemoryRouter initialEntries={[`/form?token=${token}`]}>
      <Routes>
        <Route path="/form" element={<FormPage />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('FormPage', () => {
  it('mostra loading inicial', () => {
    renderFormPage()
    expect(screen.getByText(/carregando/i)).toBeInTheDocument()
  })

  it('exibe nome do cliente após carregar', async () => {
    renderFormPage()
    await waitFor(() => {
      expect(screen.getByText(/olá, joão silva/i)).toBeInTheDocument()
    })
  })

  it('mostra aba PF ativa por padrão', async () => {
    renderFormPage()
    await waitFor(() => screen.getByText(/olá/i))
    const pfTab = screen.getByRole('button', { name: /pessoa física/i })
    expect(pfTab).toHaveClass('bg-white')
  })

  it('muda para aba PJ ao clicar', async () => {
    renderFormPage()
    await waitFor(() => screen.getByText(/olá/i))
    fireEvent.click(screen.getByRole('button', { name: /pessoa jurídica/i }))
    expect(screen.getByText(/todos os campos desta aba são opcionais/i)).toBeInTheDocument()
  })

  it('exibe erros ao submeter sem campos obrigatórios', async () => {
    renderFormPage()
    await waitFor(() => screen.getByText(/olá/i))
    fireEvent.click(screen.getByRole('button', { name: /enviar respostas/i }))
    await waitFor(() => {
      expect(screen.getAllByText('Campo obrigatório').length).toBeGreaterThan(0)
    })
  })
})
