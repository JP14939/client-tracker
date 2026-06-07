import { jsPDF } from 'jspdf'
import { getItem } from '../utils/storage'
import { formatDate } from '../utils/formatters'

function formatNoteDate(iso) {
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

const CODE_MODEL_PATTERNS = /code|starcoder|deepseek-coder|codegemma/i

async function listOllamaModels() {
  try {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 3000)
    const res = await fetch('/ollama/api/tags', { signal: ctrl.signal })
    clearTimeout(timer)
    if (!res.ok) return []
    const { models } = await res.json()
    if (!models?.length) return []
    // non-code models first, then code models as fallback
    const nonCode = models.filter(m => !CODE_MODEL_PATTERNS.test(m.name))
    const code = models.filter(m => CODE_MODEL_PATTERNS.test(m.name))
    return [...nonCode, ...code].map(m => m.name)
  } catch {
    return []
  }
}

async function getAISummary(model, client, projects, entries, notes) {
  const timeline = entries
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(e => {
      const proj = projects.find(p => p.id === e.projectId)
      return `[${e.date}] ${proj?.name ?? 'Unknown project'}: ${e.hours}h — ${e.description || 'no description'}`
    })
    .join('\n')

  const noteLines = [...notes]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(n => `[${formatNoteDate(n.date)}] ${n.text}`)
    .join('\n')

  const prompt =
    `You are a professional account manager writing a client report summary.\n` +
    `Client: ${client.name}${client.company ? ` (${client.company})` : ''}\n\n` +
    `Work timeline:\n${timeline || 'No time entries logged.'}\n\n` +
    `Client notes:\n${noteLines || 'No notes recorded.'}\n\n` +
    `Write a concise 3–5 sentence professional summary of what was accomplished, ` +
    `key themes from the notes, and the overall engagement. Be specific and factual.`

  try {
    const res = await fetch('/ollama/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt, stream: false }),
    })
    if (!res.ok) return null
    const data = await res.json()
    if (data.error) return null   // e.g. model requires more memory than available
    return data.response?.trim() ?? null
  } catch {
    return null
  }
}

function pageBreak(doc, y, needed = 18) {
  const pageH = doc.internal.pageSize.getHeight()
  if (y + needed > pageH - 20) {
    doc.addPage()
    return 22
  }
  return y
}

export async function exportClientToPDF(clientId, onProgress) {
  const clients = getItem('ct_clients') ?? []
  const projects = getItem('ct_projects') ?? []
  const timeEntries = getItem('ct_time_entries') ?? []

  const client = clients.find(c => c.id === clientId)
  if (!client) return

  const clientProjects = projects.filter(p => p.clientId === clientId)
  const clientEntries = timeEntries.filter(e =>
    clientProjects.some(p => p.id === e.projectId)
  )
  const notes = Array.isArray(client.notes) ? client.notes : []
  const totalHours = clientEntries.reduce((sum, e) => sum + (e.hours || 0), 0)

  // Ollama — try models in order until one fits in memory
  onProgress?.('Detecting Ollama models…')
  const models = await listOllamaModels()

  let aiSummary = null
  for (const model of models) {
    onProgress?.(`Generating summary with ${model}…`)
    aiSummary = await getAISummary(model, client, clientProjects, clientEntries, notes)
    if (aiSummary) break
  }

  onProgress?.('Building PDF…')

  const doc = new jsPDF()
  const pageW = doc.internal.pageSize.getWidth()
  const marginL = 20
  const marginR = pageW - 20
  const contentW = marginR - marginL

  // ── Header ──────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.setTextColor(24, 24, 36)
  doc.text('ClientFlow — Client Report', marginL, 24)

  doc.setDrawColor(124, 92, 252)
  doc.setLineWidth(0.8)
  doc.line(marginL, 28, marginR, 28)

  // Client info block
  let y = 37
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(24, 24, 36)
  doc.text(client.name, marginL, y)
  y += 7

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(80, 80, 100)
  if (client.email) { doc.text(`Email: ${client.email}`, marginL, y); y += 6 }
  if (client.company) { doc.text(`Company: ${client.company}`, marginL, y); y += 6 }
  doc.text(`Status: ${client.status ?? 'active'}`, marginL, y); y += 6

  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  doc.text(`Report generated: ${today}`, marginL, y); y += 10

  // ── AI Summary ───────────────────────────────────────────────
  if (aiSummary) {
    doc.setDrawColor(200, 200, 215)
    doc.setLineWidth(0.2)
    doc.line(marginL, y, marginR, y)
    y += 6

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(124, 92, 252)
    doc.text(`AI Summary  (${models.find(Boolean) ?? 'ollama'})`, marginL, y)
    y += 6

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(45, 45, 60)
    const summaryLines = doc.splitTextToSize(aiSummary, contentW)
    summaryLines.forEach(line => {
      y = pageBreak(doc, y)
      doc.text(line, marginL, y)
      y += 5.5
    })
    y += 4
  } else {
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(9)
    doc.setTextColor(160, 160, 175)
    doc.text('AI summary unavailable — Ollama not running or no model installed.', marginL, y)
    y += 10
  }

  // ── Projects & Time Summary ───────────────────────────────────
  y = pageBreak(doc, y, 30)
  doc.setDrawColor(200, 200, 215)
  doc.setLineWidth(0.2)
  doc.line(marginL, y, marginR, y)
  y += 6

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(24, 24, 36)
  doc.text('Projects & Time Summary', marginL, y)
  y += 7

  if (clientProjects.length === 0) {
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(9)
    doc.setTextColor(140, 140, 155)
    doc.text('No projects on record.', marginL, y)
    y += 8
  } else {
    // Table header
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(80, 80, 100)
    doc.text('Project', marginL, y)
    doc.text('Status', marginL + 90, y)
    doc.text('Hours', marginR, y, { align: 'right' })
    y += 3
    doc.setDrawColor(200, 200, 215)
    doc.setLineWidth(0.2)
    doc.line(marginL, y, marginR, y)
    y += 5

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)

    clientProjects.forEach((proj, i) => {
      y = pageBreak(doc, y)
      const projHours = clientEntries
        .filter(e => e.projectId === proj.id)
        .reduce((s, e) => s + (e.hours || 0), 0)

      if (i % 2 === 0) {
        doc.setFillColor(246, 246, 252)
        doc.rect(marginL - 2, y - 4.5, contentW + 4, 7, 'F')
      }
      doc.setTextColor(50, 50, 65)
      doc.text(proj.name, marginL, y)
      doc.text(proj.status ?? '', marginL + 90, y)
      doc.text(`${projHours.toFixed(1)}h`, marginR, y, { align: 'right' })
      y += 7
    })

    // Total row
    doc.setDrawColor(160, 160, 180)
    doc.setLineWidth(0.3)
    doc.line(marginL, y, marginR, y)
    y += 5
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(24, 24, 36)
    doc.text('Total', marginL, y)
    doc.text(`${totalHours.toFixed(1)}h`, marginR, y, { align: 'right' })
    y += 10
  }

  // ── Time Entries ──────────────────────────────────────────────
  if (clientEntries.length > 0) {
    y = pageBreak(doc, y, 30)
    doc.setDrawColor(200, 200, 215)
    doc.setLineWidth(0.2)
    doc.line(marginL, y, marginR, y)
    y += 6

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(24, 24, 36)
    doc.text('Time Entries', marginL, y)
    y += 7

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(80, 80, 100)
    doc.text('Date', marginL, y)
    doc.text('Project', marginL + 32, y)
    doc.text('Description', marginL + 88, y)
    doc.text('Hrs', marginR, y, { align: 'right' })
    y += 3
    doc.setDrawColor(200, 200, 215)
    doc.setLineWidth(0.2)
    doc.line(marginL, y, marginR, y)
    y += 5

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)

    const sortedEntries = [...clientEntries].sort((a, b) => new Date(a.date) - new Date(b.date))
    sortedEntries.forEach((entry, i) => {
      y = pageBreak(doc, y)
      const proj = clientProjects.find(p => p.id === entry.projectId)

      if (i % 2 === 0) {
        doc.setFillColor(246, 246, 252)
        doc.rect(marginL - 2, y - 4.5, contentW + 4, 7, 'F')
      }
      doc.setTextColor(50, 50, 65)
      doc.text(formatDate(entry.date), marginL, y)
      doc.text((proj?.name ?? '').slice(0, 20), marginL + 32, y)
      const desc = (entry.description ?? '').slice(0, 35)
      doc.text(desc, marginL + 88, y)
      doc.text(`${Number(entry.hours).toFixed(1)}`, marginR, y, { align: 'right' })
      y += 7
    })
    y += 4
  }

  // ── Client Notes ──────────────────────────────────────────────
  if (notes.length > 0) {
    y = pageBreak(doc, y, 30)
    doc.setDrawColor(200, 200, 215)
    doc.setLineWidth(0.2)
    doc.line(marginL, y, marginR, y)
    y += 6

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(24, 24, 36)
    doc.text('Client Notes', marginL, y)
    y += 8

    const sortedNotes = [...notes].sort((a, b) => new Date(a.date) - new Date(b.date))
    sortedNotes.forEach(note => {
      y = pageBreak(doc, y, 16)

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8.5)
      doc.setTextColor(124, 92, 252)
      doc.text(formatNoteDate(note.date), marginL, y)
      y += 5

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9.5)
      doc.setTextColor(45, 45, 60)
      const noteLines = doc.splitTextToSize(note.text, contentW)
      noteLines.forEach(line => {
        y = pageBreak(doc, y)
        doc.text(line, marginL, y)
        y += 5.5
      })
      y += 5
    })
  }

  // ── Footer on every page ──────────────────────────────────────
  const totalPages = doc.internal.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(160, 160, 175)
    doc.text('Generated by ClientFlow', marginL, doc.internal.pageSize.getHeight() - 8)
    doc.text(`Page ${i} of ${totalPages}`, marginR, doc.internal.pageSize.getHeight() - 8, { align: 'right' })
  }

  const safe = s => (s || '').replace(/[^a-zA-Z0-9]/g, '')
  doc.save(`${safe(client.name)}-ClientReport.pdf`)
}
