import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { FormPage } from './pages/FormPage'
import { AdminPage } from './pages/AdminPage'
import { NotFoundPage } from './pages/NotFoundPage'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/form" element={<FormPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
