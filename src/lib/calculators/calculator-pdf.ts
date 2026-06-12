export interface CalculatorPdfRow {
  label: string
  value: string
}

export interface CalculatorPdfInput {
  title: string
  subtitle?: string
  rows: CalculatorPdfRow[]
  filename: string
}

type Html2CanvasFn = typeof import("html2canvas")["default"]
type JsPDFConstructor = typeof import("jspdf")["jsPDF"]

let html2canvasLoader: Promise<Html2CanvasFn> | null = null
let jsPDFLoader: Promise<JsPDFConstructor> | null = null

async function loadHtml2Canvas(): Promise<Html2CanvasFn> {
  if (!html2canvasLoader) {
    html2canvasLoader = import("html2canvas").then((module) => module.default)
  }
  return html2canvasLoader
}

async function loadJsPDF(): Promise<JsPDFConstructor> {
  if (!jsPDFLoader) {
    jsPDFLoader = import("jspdf").then((module) => module.jsPDF)
  }
  return jsPDFLoader
}

function buildPdfElement({
  title,
  subtitle,
  rows,
}: Omit<CalculatorPdfInput, "filename">): HTMLDivElement {
  const container = document.createElement("div")
  container.id = "calculator-pdf-export"
  container.style.cssText =
    "position:fixed;left:-9999px;top:0;width:640px;padding:32px;background:#ffffff;color:#0f172a;font-family:Arial,sans-serif;"

  const rowsHtml = rows
    .map(
      (row) => `
      <div style="display:flex;justify-content:space-between;gap:16px;padding:10px 0;border-bottom:1px solid #e2e8f0;">
        <span style="color:#64748b;font-size:14px;">${row.label}</span>
        <span style="color:#0f172a;font-size:14px;font-weight:700;">${row.value}</span>
      </div>`
    )
    .join("")

  container.innerHTML = `
    <div style="border:1px solid #e2e8f0;border-radius:16px;padding:24px;background:#ffffff;">
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0f172a;">${title}</h1>
      ${subtitle ? `<p style="margin:0 0 16px;font-size:13px;color:#64748b;">${subtitle}</p>` : ""}
      <div style="border-top:1px solid #e2e8f0;padding-top:8px;">${rowsHtml}</div>
      <p style="margin:16px 0 0;font-size:11px;color:#94a3b8;">사장만 계산기 · 참고용 결과입니다.</p>
    </div>
  `

  return container
}

export async function exportCalculatorPdf({
  title,
  subtitle,
  rows,
  filename,
}: CalculatorPdfInput): Promise<void> {
  if (typeof window === "undefined") return

  const element = buildPdfElement({ title, subtitle, rows })
  document.body.appendChild(element)

  try {
    const [html2canvas, jsPDF] = await Promise.all([
      loadHtml2Canvas(),
      loadJsPDF(),
    ])

    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: "#ffffff",
      logging: false,
    })

    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = pageWidth - 20
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, Math.min(imgHeight, pageHeight - 20))
    pdf.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`)
  } finally {
    document.body.removeChild(element)
  }
}
