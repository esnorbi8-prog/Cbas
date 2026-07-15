const ExcelJS = require('exceljs')
const prisma = require('../lib/prisma')

// Estilos reutilizables
const HEADER_FILL = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F3864' } }
const HEADER_FONT = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11, name: 'Arial' }
const YELLOW_FILL  = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5C100' } }
const YELLOW_FONT  = { bold: true, color: { argb: 'FF0A0A0A' }, size: 11, name: 'Arial' }
const BORDER = {
  top:    { style: 'thin', color: { argb: 'FFCCCCCC' } },
  left:   { style: 'thin', color: { argb: 'FFCCCCCC' } },
  bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
  right:  { style: 'thin', color: { argb: 'FFCCCCCC' } },
}

function applyHeaderRow(row, fill = HEADER_FILL, font = HEADER_FONT) {
  row.eachCell(cell => {
    cell.fill   = fill
    cell.font   = font
    cell.border = BORDER
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
  })
  row.height = 32
}

function applyDataRow(row, isEven) {
  row.eachCell(cell => {
    cell.border = BORDER
    cell.alignment = { vertical: 'middle', wrapText: true }
    cell.fill = isEven
      ? { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F8FC' } }
      : { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }
  })
  row.height = 20
}

function addTitleBlock(sheet, titulo, subtitulo) {
  // Fila 1: título principal
  const r1 = sheet.addRow([titulo])
  r1.height = 36
  r1.getCell(1).font  = { bold: true, size: 16, color: { argb: 'FF1F3864' }, name: 'Arial' }
  r1.getCell(1).fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCE6F1' } }
  r1.getCell(1).alignment = { vertical: 'middle' }

  // Fila 2: subtítulo / fecha
  const r2 = sheet.addRow([subtitulo])
  r2.height = 20
  r2.getCell(1).font  = { italic: true, size: 10, color: { argb: 'FF666666' }, name: 'Arial' }
  r2.getCell(1).fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCE6F1' } }

  // Fila vacía separadora
  sheet.addRow([])
}

// ─────────────────────────────────────────────────────────────────────────
// REPORTE 1: VENTAS
// ─────────────────────────────────────────────────────────────────────────
async function reporteVentas(req, res) {
  try {
    const { desde, hasta, estado, canal } = req.query

    const where = {}
    if (estado) where.estado = estado
    if (canal)  where.canal  = canal
    if (desde || hasta) {
      where.creado_en = {}
      if (desde) where.creado_en.gte = new Date(desde)
      if (hasta) {
        const h = new Date(hasta)
        h.setHours(23, 59, 59, 999)
        where.creado_en.lte = h
      }
    }

    const ventas = await prisma.ventas.findMany({
      where,
      include: { clientes: true, venta_items: true },
      orderBy: { creado_en: 'desc' }
    })

    const wb = new ExcelJS.Workbook()
    wb.creator = 'Ferretería Nasca'
    wb.created = new Date()

    // ── Hoja 1: Resumen de Ventas ──────────────────────────────────────
    const sh1 = wb.addWorksheet('Resumen de Ventas', { views: [{ showGridLines: false }] })
    sh1.columns = [
      { key: 'numero',   width: 10 },
      { key: 'fecha',    width: 20 },
      { key: 'cliente',  width: 28 },
      { key: 'canal',    width: 14 },
      { key: 'metodo',   width: 16 },
      { key: 'estado',   width: 14 },
      { key: 'subtotal', width: 14 },
      { key: 'descuento',width: 13 },
      { key: 'total',    width: 14 },
    ]
    sh1.mergeCells('A1:I1')
    sh1.mergeCells('A2:I2')
    addTitleBlock(sh1,
      'FERRETERÍA NASCA — Reporte de Ventas',
      `Generado el ${new Date().toLocaleDateString('es-PE', { day:'2-digit', month:'long', year:'numeric' })}` +
      (desde || hasta ? `  |  Período: ${desde || '—'} al ${hasta || '—'}` : '  |  Todas las fechas')
    )

    const hdr = sh1.addRow(['N° Venta','Fecha','Cliente','Canal','Método Pago','Estado','Subtotal S/','Descuento S/','Total S/'])
    applyHeaderRow(hdr)

    let totalGeneral = 0, totalDescuentos = 0
    ventas.forEach((v, i) => {
      const row = sh1.addRow([
        v.numero,
        new Date(v.creado_en).toLocaleDateString('es-PE', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' }),
        v.clientes ? `${v.clientes.nombre} (${v.clientes.telefono || v.clientes.email || ''})` : 'Venta presencial',
        v.canal,
        v.metodo_pago || '—',
        v.estado,
        parseFloat(v.subtotal),
        parseFloat(v.descuento || 0),
        parseFloat(v.total),
      ])
      applyDataRow(row, i % 2 === 0)
      // Color por estado
      const estadoCell = row.getCell(6)
      const colorMap = { pendiente: 'FFFFF3CD', pagado: 'FFD4EDDA', despachado: 'FFD1ECF1', cancelado: 'FFF8D7DA' }
      if (colorMap[v.estado]) estadoCell.fill = { type:'pattern', pattern:'solid', fgColor:{ argb: colorMap[v.estado] } }
      // Formato moneda
      ;[7,8,9].forEach(c => { row.getCell(c).numFmt = '"S/"#,##0.00' })
      totalGeneral += parseFloat(v.total)
      totalDescuentos += parseFloat(v.descuento || 0)
    })

    // Fila totales
    sh1.addRow([])
    const totRow = sh1.addRow(['','','','','','TOTAL GENERAL','',totalDescuentos, totalGeneral])
    totRow.height = 28
    applyHeaderRow(totRow, YELLOW_FILL, YELLOW_FONT)
    ;[8,9].forEach(c => { totRow.getCell(c).numFmt = '"S/"#,##0.00' })

    // ── Hoja 2: Detalle de Items ───────────────────────────────────────
    const sh2 = wb.addWorksheet('Detalle de Items', { views: [{ showGridLines: false }] })
    sh2.columns = [
      { key: 'venta',    width: 10 },
      { key: 'fecha',    width: 18 },
      { key: 'producto', width: 32 },
      { key: 'cant',     width: 10 },
      { key: 'precio',   width: 14 },
      { key: 'subtotal', width: 14 },
    ]
    sh2.mergeCells('A1:F1'); sh2.mergeCells('A2:F2')
    addTitleBlock(sh2, 'FERRETERÍA NASCA — Detalle de Items por Venta', '')

    const hdr2 = sh2.addRow(['N° Venta','Fecha','Producto','Cantidad','Precio Unit. S/','Subtotal S/'])
    applyHeaderRow(hdr2)
    let rowIdx2 = 0
    ventas.forEach(v => {
      v.venta_items.forEach(item => {
        const row = sh2.addRow([
          v.numero,
          new Date(v.creado_en).toLocaleDateString('es-PE'),
          item.nombre_producto,
          item.cantidad,
          parseFloat(item.precio_unitario),
          parseFloat(item.subtotal),
        ])
        applyDataRow(row, rowIdx2 % 2 === 0)
        ;[5,6].forEach(c => { row.getCell(c).numFmt = '"S/"#,##0.00' })
        rowIdx2++
      })
    })

    // ── Hoja 3: Estadísticas ──────────────────────────────────────────
    const sh3 = wb.addWorksheet('Estadísticas', { views: [{ showGridLines: false }] })
    sh3.columns = [{ key: 'k', width: 30 }, { key: 'v', width: 20 }]
    sh3.mergeCells('A1:B1'); sh3.mergeCells('A2:B2')
    addTitleBlock(sh3, 'FERRETERÍA NASCA — Estadísticas de Ventas', '')

    const hdr3 = sh3.addRow(['Indicador','Valor'])
    applyHeaderRow(hdr3)

    const ventasActivas = ventas.filter(v => v.estado !== 'cancelado')
    const porCanal = {}
    const porEstado = {}
    ventas.forEach(v => {
      porCanal[v.canal] = (porCanal[v.canal] || 0) + 1
      porEstado[v.estado] = (porEstado[v.estado] || 0) + 1
    })

    const stats = [
      ['Total de ventas registradas', ventas.length],
      ['Ventas activas (sin canceladas)', ventasActivas.length],
      ['Ingresos totales (S/)', totalGeneral],
      ['Ticket promedio (S/)', ventasActivas.length > 0 ? (totalGeneral / ventasActivas.length) : 0],
      ['',''],
      ['Ventas por canal',''],
      ...Object.entries(porCanal).map(([k,v]) => [`  — ${k}`, v]),
      ['',''],
      ['Ventas por estado',''],
      ...Object.entries(porEstado).map(([k,v]) => [`  — ${k}`, v]),
    ]
    stats.forEach(([ k, v], i) => {
      const row = sh3.addRow([k, v === '' ? '' : v])
      applyDataRow(row, i % 2 === 0)
      if (typeof v === 'number' && k.includes('S/')) row.getCell(2).numFmt = '"S/"#,##0.00'
      if (k === 'Ventas por canal' || k === 'Ventas por estado') {
        row.getCell(1).font = { bold: true, color: { argb: 'FF1F3864' }, name: 'Arial' }
      }
    })

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename="Reporte_Ventas_${new Date().toISOString().slice(0,10)}.xlsx"`)
    await wb.xlsx.write(res)
    res.end()
  } catch (err) {
    console.error('Error reporte ventas:', err)
    res.status(500).json({ error: 'Error generando reporte', detalle: err.message })
  }
}

// ─────────────────────────────────────────────────────────────────────────
// REPORTE 2: INVENTARIO
// ─────────────────────────────────────────────────────────────────────────
async function reporteInventario(req, res) {
  try {
    const productos = await prisma.productos.findMany({
      where: { activo: true },
      include: { categorias: true, proveedores: true },
      orderBy: [{ categorias: { nombre: 'asc' } }, { nombre: 'asc' }]
    })

    const movimientos = await prisma.inventario_movimientos.findMany({
      orderBy: { creado_en: 'desc' },
      take: 200,
      include: { productos: true }
    })

    const wb = new ExcelJS.Workbook()
    wb.creator = 'Ferretería Nasca'

    // ── Hoja 1: Stock Actual ──────────────────────────────────────────
    const sh1 = wb.addWorksheet('Stock Actual', { views: [{ showGridLines: false }] })
    sh1.columns = [
      { key: 'codigo',    width: 13 },
      { key: 'nombre',    width: 34 },
      { key: 'categoria', width: 20 },
      { key: 'proveedor', width: 20 },
      { key: 'unidad',    width: 10 },
      { key: 'stock',     width: 12 },
      { key: 'minimo',    width: 12 },
      { key: 'estado',    width: 14 },
      { key: 'compra',    width: 14 },
      { key: 'venta',     width: 14 },
      { key: 'valor',     width: 16 },
    ]
    sh1.mergeCells('A1:K1'); sh1.mergeCells('A2:K2')
    addTitleBlock(sh1,
      'FERRETERÍA NASCA — Reporte de Inventario',
      `Generado el ${new Date().toLocaleDateString('es-PE', { day:'2-digit', month:'long', year:'numeric' })}`
    )

    const hdr = sh1.addRow(['Código','Nombre','Categoría','Proveedor','Unidad','Stock Actual','Stock Mínimo','Estado','P. Compra S/','P. Venta S/','Valor Stock S/'])
    applyHeaderRow(hdr)

    let valorTotal = 0
    productos.forEach((p, i) => {
      const stockBajo = p.stock_actual <= (p.stock_minimo || 5)
      const sinStock  = p.stock_actual === 0
      const estado    = sinStock ? 'SIN STOCK' : stockBajo ? 'STOCK BAJO' : 'OK'
      const valorStock = parseFloat(p.precio_compra) * p.stock_actual

      const row = sh1.addRow([
        p.codigo,
        p.nombre,
        p.categorias?.nombre || '—',
        p.proveedores?.nombre || '—',
        p.unidad,
        p.stock_actual,
        p.stock_minimo || 5,
        estado,
        parseFloat(p.precio_compra),
        parseFloat(p.precio_venta),
        valorStock,
      ])
      applyDataRow(row, i % 2 === 0)
      ;[9,10,11].forEach(c => { row.getCell(c).numFmt = '"S/"#,##0.00' })

      // Color por estado de stock
      const estadoCell = row.getCell(8)
      if (sinStock) {
        estadoCell.fill = { type:'pattern', pattern:'solid', fgColor:{ argb:'FFF8D7DA' } }
        estadoCell.font = { bold: true, color: { argb: 'FFC0392B' }, name: 'Arial' }
      } else if (stockBajo) {
        estadoCell.fill = { type:'pattern', pattern:'solid', fgColor:{ argb:'FFFFF3CD' } }
        estadoCell.font = { bold: true, color: { argb: 'FF856404' }, name: 'Arial' }
      } else {
        estadoCell.fill = { type:'pattern', pattern:'solid', fgColor:{ argb:'FFD4EDDA' } }
        estadoCell.font = { bold: true, color: { argb: 'FF155724' }, name: 'Arial' }
      }
      valorTotal += valorStock
    })

    sh1.addRow([])
    const totRow = sh1.addRow(['','','','','','','','VALOR TOTAL INVENTARIO','','', valorTotal])
    totRow.height = 28
    applyHeaderRow(totRow, YELLOW_FILL, YELLOW_FONT)
    totRow.getCell(11).numFmt = '"S/"#,##0.00'

    // ── Hoja 2: Alertas de Stock ──────────────────────────────────────
    const sh2 = wb.addWorksheet('Alertas de Stock', { views: [{ showGridLines: false }] })
    sh2.columns = [
      { key: 'codigo',  width: 13 },
      { key: 'nombre',  width: 34 },
      { key: 'cat',     width: 20 },
      { key: 'actual',  width: 13 },
      { key: 'minimo',  width: 13 },
      { key: 'faltante',width: 13 },
      { key: 'estado',  width: 14 },
    ]
    sh2.mergeCells('A1:G1'); sh2.mergeCells('A2:G2')
    addTitleBlock(sh2, 'FERRETERÍA NASCA — Alertas de Stock', 'Productos con stock bajo o agotado')

    const hdr2 = sh2.addRow(['Código','Nombre','Categoría','Stock Actual','Stock Mínimo','Unidades Faltantes','Estado'])
    applyHeaderRow(hdr2)

    const alertas = productos.filter(p => p.stock_actual <= (p.stock_minimo || 5))
    alertas.forEach((p, i) => {
      const faltante = Math.max(0, (p.stock_minimo || 5) - p.stock_actual)
      const estado = p.stock_actual === 0 ? 'SIN STOCK' : 'STOCK BAJO'
      const row = sh2.addRow([p.codigo, p.nombre, p.categorias?.nombre || '—', p.stock_actual, p.stock_minimo || 5, faltante, estado])
      applyDataRow(row, i % 2 === 0)
      const ec = row.getCell(7)
      if (p.stock_actual === 0) {
        ec.fill = { type:'pattern', pattern:'solid', fgColor:{ argb:'FFF8D7DA' } }
        ec.font = { bold: true, color: { argb: 'FFC0392B' }, name: 'Arial' }
      } else {
        ec.fill = { type:'pattern', pattern:'solid', fgColor:{ argb:'FFFFF3CD' } }
        ec.font = { bold: true, color: { argb: 'FF856404' }, name: 'Arial' }
      }
    })

    // ── Hoja 3: Historial de Movimientos ─────────────────────────────
    const sh3 = wb.addWorksheet('Historial Movimientos', { views: [{ showGridLines: false }] })
    sh3.columns = [
      { key: 'fecha',    width: 20 },
      { key: 'producto', width: 30 },
      { key: 'tipo',     width: 12 },
      { key: 'cant',     width: 12 },
      { key: 'anterior', width: 14 },
      { key: 'nuevo',    width: 14 },
      { key: 'ref',      width: 24 },
    ]
    sh3.mergeCells('A1:G1'); sh3.mergeCells('A2:G2')
    addTitleBlock(sh3, 'FERRETERÍA NASCA — Historial de Movimientos de Inventario', 'Últimos 200 movimientos')

    const hdr3 = sh3.addRow(['Fecha','Producto','Tipo','Cantidad','Stock Anterior','Stock Nuevo','Referencia'])
    applyHeaderRow(hdr3)
    movimientos.forEach((m, i) => {
      const row = sh3.addRow([
        new Date(m.creado_en).toLocaleDateString('es-PE', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' }),
        m.productos?.nombre || '—',
        m.tipo,
        m.cantidad,
        m.stock_anterior,
        m.stock_nuevo,
        m.referencia || m.notas || '—',
      ])
      applyDataRow(row, i % 2 === 0)
      const tipoCell = row.getCell(3)
      if (m.tipo === 'entrada') {
        tipoCell.fill = { type:'pattern', pattern:'solid', fgColor:{ argb:'FFD4EDDA' } }
        tipoCell.font = { bold: true, color: { argb: 'FF155724' }, name: 'Arial' }
      } else if (m.tipo === 'salida') {
        tipoCell.fill = { type:'pattern', pattern:'solid', fgColor:{ argb:'FFF8D7DA' } }
        tipoCell.font = { bold: true, color: { argb: 'FFC0392B' }, name: 'Arial' }
      } else {
        tipoCell.fill = { type:'pattern', pattern:'solid', fgColor:{ argb:'FFFFF3CD' } }
        tipoCell.font = { bold: true, color: { argb: 'FF856404' }, name: 'Arial' }
      }
    })

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename="Reporte_Inventario_${new Date().toISOString().slice(0,10)}.xlsx"`)
    await wb.xlsx.write(res)
    res.end()
  } catch (err) {
    console.error('Error reporte inventario:', err)
    res.status(500).json({ error: 'Error generando reporte', detalle: err.message })
  }
}

// ─────────────────────────────────────────────────────────────────────────
// REPORTE 3: PRODUCTOS
// ─────────────────────────────────────────────────────────────────────────
async function reporteProductos(req, res) {
  try {
    const productos = await prisma.productos.findMany({
      include: { categorias: true, proveedores: true },
      orderBy: [{ categorias: { nombre: 'asc' } }, { nombre: 'asc' }]
    })

    const wb = new ExcelJS.Workbook()
    wb.creator = 'Ferretería Nasca'

    // ── Hoja 1: Catálogo Completo ─────────────────────────────────────
    const sh1 = wb.addWorksheet('Catálogo Completo', { views: [{ showGridLines: false }] })
    sh1.columns = [
      { key: 'codigo',    width: 13 },
      { key: 'nombre',    width: 34 },
      { key: 'descripcion',width: 30 },
      { key: 'categoria', width: 20 },
      { key: 'proveedor', width: 20 },
      { key: 'unidad',    width: 10 },
      { key: 'compra',    width: 13 },
      { key: 'venta',     width: 13 },
      { key: 'margen',    width: 12 },
      { key: 'stock',     width: 10 },
      { key: 'web',       width: 10 },
      { key: 'activo',    width: 10 },
    ]
    sh1.mergeCells('A1:L1'); sh1.mergeCells('A2:L2')
    addTitleBlock(sh1,
      'FERRETERÍA NASCA — Catálogo de Productos',
      `Generado el ${new Date().toLocaleDateString('es-PE', { day:'2-digit', month:'long', year:'numeric' })}  |  Total: ${productos.length} productos`
    )

    const hdr = sh1.addRow(['Código','Nombre','Descripción','Categoría','Proveedor','Unidad','P. Compra S/','P. Venta S/','Margen %','Stock','Visible Web','Activo'])
    applyHeaderRow(hdr)

    productos.forEach((p, i) => {
      const margen = parseFloat(p.precio_compra) > 0
        ? ((parseFloat(p.precio_venta) - parseFloat(p.precio_compra)) / parseFloat(p.precio_compra) * 100).toFixed(1)
        : '—'

      const row = sh1.addRow([
        p.codigo,
        p.nombre,
        p.descripcion || '—',
        p.categorias?.nombre || '—',
        p.proveedores?.nombre || '—',
        p.unidad,
        parseFloat(p.precio_compra),
        parseFloat(p.precio_venta),
        margen !== '—' ? parseFloat(margen) : '—',
        p.stock_actual,
        p.visible_web ? 'Sí' : 'No',
        p.activo ? 'Sí' : 'No',
      ])
      applyDataRow(row, i % 2 === 0)
      ;[7,8].forEach(c => { row.getCell(c).numFmt = '"S/"#,##0.00' })
      if (margen !== '—') row.getCell(9).numFmt = '0.0"%"'
      if (!p.activo) {
        row.eachCell(cell => { cell.font = { color: { argb: 'FF999999' }, italic: true, name: 'Arial' } })
      }
    })

    // ── Hoja 2: Por Categoría ─────────────────────────────────────────
    const sh2 = wb.addWorksheet('Por Categoría', { views: [{ showGridLines: false }] })
    sh2.columns = [
      { key: 'categoria', width: 26 },
      { key: 'cantidad',  width: 14 },
      { key: 'stock',     width: 14 },
      { key: 'valorC',    width: 18 },
      { key: 'valorV',    width: 18 },
    ]
    sh2.mergeCells('A1:E1'); sh2.mergeCells('A2:E2')
    addTitleBlock(sh2, 'FERRETERÍA NASCA — Productos por Categoría', '')

    const hdr2 = sh2.addRow(['Categoría','N° Productos','Stock Total','Valor en Compra S/','Valor en Venta S/'])
    applyHeaderRow(hdr2)

    const porCat = {}
    productos.filter(p => p.activo).forEach(p => {
      const cat = p.categorias?.nombre || 'Sin categoría'
      if (!porCat[cat]) porCat[cat] = { cantidad: 0, stock: 0, valorC: 0, valorV: 0 }
      porCat[cat].cantidad++
      porCat[cat].stock   += p.stock_actual
      porCat[cat].valorC  += parseFloat(p.precio_compra) * p.stock_actual
      porCat[cat].valorV  += parseFloat(p.precio_venta)  * p.stock_actual
    })

    Object.entries(porCat).sort().forEach(([cat, data], i) => {
      const row = sh2.addRow([cat, data.cantidad, data.stock, data.valorC, data.valorV])
      applyDataRow(row, i % 2 === 0)
      ;[4,5].forEach(c => { row.getCell(c).numFmt = '"S/"#,##0.00' })
    })

    sh2.addRow([])
    const totRow = sh2.addRow([
      'TOTAL',
      Object.values(porCat).reduce((s,d) => s+d.cantidad, 0),
      Object.values(porCat).reduce((s,d) => s+d.stock, 0),
      Object.values(porCat).reduce((s,d) => s+d.valorC, 0),
      Object.values(porCat).reduce((s,d) => s+d.valorV, 0),
    ])
    totRow.height = 26
    applyHeaderRow(totRow, YELLOW_FILL, YELLOW_FONT)
    ;[4,5].forEach(c => { totRow.getCell(c).numFmt = '"S/"#,##0.00' })

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename="Reporte_Productos_${new Date().toISOString().slice(0,10)}.xlsx"`)
    await wb.xlsx.write(res)
    res.end()
  } catch (err) {
    console.error('Error reporte productos:', err)
    res.status(500).json({ error: 'Error generando reporte', detalle: err.message })
  }
}

module.exports = { reporteVentas, reporteInventario, reporteProductos }
