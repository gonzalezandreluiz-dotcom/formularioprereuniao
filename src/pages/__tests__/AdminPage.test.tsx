import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AdminPage } from '../AdminPage'

const mockClients = [
  { id: 'c1', name: 'João Silva', token: 'token-1', created_at: '2026-05-28T10:00:00Z' },
  { id: 'c2', name: 'Maria Costa', token: 'token-2', created_at: '2026-05-27T09:00:00Z' },
]

const mockSubmissions = [
  {
    id: 's1', client_id: 'c1',
    pf_data: { nome: 'João Silva', objetivo_principal: 'Aposentadoria' },
    pj_data: null,
    submitted_at: '2026-05-28T11:00:00Z',
  },
]

vi.mock('@/lib/supabase', () => {
  const mockFrom = vi.fn().mockImplementation((table: string) => {
    if (table === 'clients') {
      return {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockClients, error: null }),
        insert: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { id: 'c3', name: 'Novo Cliente', token: 'token-3', created_at: new Date().toISOString() },
          error: null,
        }),
      }
    }
    return {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: mockSubmissions, error: null }),
    }
  })
  return { supabase: { from: mockFrom } }
})

describe('AdminPage', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_ADMIN_PASSWORD', 'senha123')
  })
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('mostra formulário de login inicialmente', () => {
    render(<AdminPage />)
    expect(screen.getByPlaceholderText(/senha/i)).toBeInTheDocument()
  })

  it('rejeita senha incorreta', () => {
    render(<AdminPage />)
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: 'errada' } })
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }))
    expect(screen.getByText(/senha incorreta/i)).toBeInTheDocument()
  })

  it('aceita senha correta e exibe dashboard', async () => {
    render(<AdminPage />)
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: 'senha123' } })
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }))
    await waitFor(() => {
      expect(screen.getByText('João Silva')).toBeInTheDocument()
      expect(screen.getByText('Maria Costa')).toBeInTheDocument()
    })
  })

  it('gera novo link ao preencher nome e clicar em gerar', async () => {
    render(<AdminPage />)
    fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: 'senha123' } })
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }))
    await waitFor(() => screen.getByText('João Silva'))

    fireEvent.change(screen.getByPlaceholderText(/nome do cliente/i), { target: { value: 'Novo Cliente' } })
    fireEvent.click(screen.getByRole('button', { name: /gerar link/i }))
    await waitFor(() => {
      expect(screen.getByDisplayValue(/token-3/i)).toBeInTheDocument()
    })
  })
})
