import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"

import { getTodayKST } from "@/lib/date-kst"

export function getEstimatePdfFilename(
  estimateNumber: string,
  issueDate: string
): string {
  const safeDate = issueDate || getTodayKST()
  const safeNumber = estimateNumber
    .trim()
    .replace(/[/\\?%*:|"<>]/g, "-")

  if (safeNumber) {
    return `견적서_${safeNumber}_${safeDate}.pdf`
  }
  return `견적서_${safeDate}.pdf`
}

export async function downloadEstimatePdf(
  element: HTMLElement,
  filename: string
): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
    ignoreElements: (node) =>
      node instanceof HTMLElement &&
      (node.hasAttribute("data-html2canvas-ignore") ||
        (node.tagName === "INPUT" && node.getAttribute("type") === "file")),
  })

  const imgData = canvas.toDataURL("image/png")
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const imgWidth = pageWidth
  const imgHeight = (canvas.height * imgWidth) / canvas.width

  let heightLeft = imgHeight
  let position = 0

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
  heightLeft -= pageHeight

  while (heightLeft > 0) {
    position = heightLeft - imgHeight
    pdf.addPage()
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
  }

  pdf.save(filename)
}
