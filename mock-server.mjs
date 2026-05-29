// Mock Supabase REST server para testes locais
import http from 'http'

const CLIENT = {
  id: 'c1-demo',
  name: 'João Silva (Demo)',
  token: 'demo-token',
  created_at: new Date().toISOString(),
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  res.setHeader('Access-Control-Allow-Methods', '*')
  res.setHeader('Content-Type', 'application/json')

  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return
  }

  const url = req.url || ''

  // GET /rest/v1/clients?... → retorna cliente mock
  if (req.method === 'GET' && url.includes('/rest/v1/clients')) {
    res.writeHead(200, { 'Content-Range': '0-0/1' })
    res.end(JSON.stringify(CLIENT))
    return
  }

  // POST /rest/v1/submissions → retorna submission criada
  if (req.method === 'POST' && url.includes('/rest/v1/submissions')) {
    res.writeHead(201, { 'Content-Range': '0-0/1' })
    res.end(JSON.stringify({ id: 's1-demo', client_id: CLIENT.id, submitted_at: new Date().toISOString() }))
    return
  }

  // POST /functions/v1/notify-submission → simula envio de email
  if (req.method === 'POST' && url.includes('/functions/v1/notify-submission')) {
    console.log('📧 Email de notificação simulado!')
    res.writeHead(200)
    res.end(JSON.stringify({ ok: true }))
    return
  }

  res.writeHead(404)
  res.end(JSON.stringify({ error: 'not found' }))
})

server.listen(9999, () => console.log('Mock Supabase rodando em http://localhost:9999'))
