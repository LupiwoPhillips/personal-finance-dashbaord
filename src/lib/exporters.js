import { formatCurrency } from './currency'

export function exportToCSV(filename, rows) {
  if (!rows || rows.length === 0) {
    rows = [{ message: 'No data available for the selected period' }]
  }
  const headers = Object.keys(rows[0])
  const escape = (val) => {
    const str = String(val ?? '')
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }
  const lines = [
    headers.join(','),
    ...rows.map((row) => headers.map((h) => escape(row[h])).join(','))
  ]
  const csvContent = lines.join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  downloadBlob(blob, `${filename}.csv`)
}

export async function exportToPDF({ title, subtitle, columns, rows, summary }) {
  const { jsPDF } = await import('jspdf')
  const autoTableModule = await import('jspdf-autotable')
  const autoTable = autoTableModule.default

  const doc = new jsPDF()
  doc.setFontSize(18)
  doc.setTextColor(22, 101, 52) // primary-800
  doc.text(title, 14, 20)

  if (subtitle) {
    doc.setFontSize(11)
    doc.setTextColor(100)
    doc.text(subtitle, 14, 28)
  }

  let startY = subtitle ? 34 : 28

  if (summary && summary.length) {
    doc.setFontSize(10)
    doc.setTextColor(40)
    summary.forEach((line, i) => {
      doc.text(line, 14, startY + i * 6)
    })
    startY += summary.length * 6 + 6
  }

  autoTable(doc, {
    startY,
    head: [columns.map((c) => c.header)],
    body: rows.map((row) => columns.map((c) => row[c.key])),
    theme: 'striped',
    headStyles: { fillColor: [22, 163, 74] },
    styles: { fontSize: 9 }
  })

  doc.save(`${title.replace(/\s+/g, '_')}.pdf`)
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function buildTransactionRowsForExport(transactions, currency) {
  return transactions.map((t) => ({
    Date: t.occurred_on,
    Type: t.type,
    Category: t.categories?.name || 'Uncategorized',
    Description: t.description || '',
    Amount: formatCurrency(t.amount, t.currency || currency),
    Recurring: t.is_recurring ? 'Yes' : 'No'
  }))
}
