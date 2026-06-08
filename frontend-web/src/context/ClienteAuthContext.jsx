import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const ClienteAuthContext = createContext()

export function ClienteAuthProvider({ children }) {
  const [cliente, setCliente] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('cliente_token')
    const data = localStorage.getItem('cliente_data')
    if (token && data) {
      setCliente(JSON.parse(data))
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
    setCargando(false)
  }, [])

  async function login(email, password) {
    const { data } = await api.post('/clientes/login', { email, password })
    localStorage.setItem('cliente_token', data.token)
    localStorage.setItem('cliente_data', JSON.stringify(data.cliente))
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    setCliente(data.cliente)
    return data
  }

  async function register(nombre, email, telefono, password, direccion) {
    const { data } = await api.post('/clientes/register', { nombre, email, telefono, password, direccion })
    localStorage.setItem('cliente_token', data.token)
    localStorage.setItem('cliente_data', JSON.stringify(data.cliente))
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    setCliente(data.cliente)
    return data
  }

  function logout() {
    localStorage.removeItem('cliente_token')
    localStorage.removeItem('cliente_data')
    delete api.defaults.headers.common['Authorization']
    setCliente(null)
  }

  return (
    <ClienteAuthContext.Provider value={{ cliente, login, register, logout, cargando }}>
      {children}
    </ClienteAuthContext.Provider>
  )
}

export function useClienteAuth() {
  return useContext(ClienteAuthContext)
}
