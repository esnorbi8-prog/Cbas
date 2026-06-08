import { createContext, useContext, useState } from 'react'

const CarritoContext = createContext()

export function CarritoProvider({ children }) {
  const [items, setItems] = useState([])

  function agregar(producto, cantidad = 1) {
    setItems(prev => {
      const existe = prev.find(i => i.id === producto.id)
      if (existe) return prev.map(i => i.id === producto.id ? { ...i, cantidad: i.cantidad + cantidad } : i)
      return [...prev, { ...producto, cantidad }]
    })
  }

  function quitar(id) {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  function cambiarCantidad(id, cantidad) {
    if (cantidad <= 0) return quitar(id)
    setItems(prev => prev.map(i => i.id === id ? { ...i, cantidad } : i))
  }

  function vaciar() {
    setItems([])
  }

  const total = items.reduce((s, i) => s + parseFloat(i.precio_venta) * i.cantidad, 0)
  const totalItems = items.reduce((s, i) => s + i.cantidad, 0)

  return (
    <CarritoContext.Provider value={{ items, agregar, quitar, cambiarCantidad, vaciar, total, totalItems }}>
      {children}
    </CarritoContext.Provider>
  )
}

export function useCarrito() {
  return useContext(CarritoContext)
}
