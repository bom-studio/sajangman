import { getTodayKST } from "@/lib/date-kst"

export const ESTIMATE_DOCUMENT_ID = "estimate-document"

const A4_WIDTH_MM = 210

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

export function getEstimateDocumentElement(): HTMLElement | null {
  const element = document.getElementById(ESTIMATE_DOCUMENT_ID)
  return element instanceof HTMLElement ? element : null
}

function shouldIgnoreElement(element: Element): boolean {
  return (
    element instanceof HTMLElement &&
    element.dataset.html2canvasIgnore === "true"
  )
}

const COLOR_DEBUG_PROPERTIES = [
  "color",
  "backgroundColor",
  "borderColor",
  "borderTopColor",
  "borderRightColor",
  "borderBottomColor",
  "borderLeftColor",
] as const

function hasUnsupportedColorFunction(value: string): boolean {
  return value.includes("oklch") || value.includes("lab")
}

/** 개발 중 PDF 캡처 대상의 oklch/lab 색상 사용 여부를 검사한다. */
export function warnUnsupportedColorsInDocument(element: HTMLElement): void {
  const nodes = [element, ...Array.from(element.querySelectorAll("*"))]

  for (const node of nodes) {
    if (!(node instanceof HTMLElement)) continue
    if (shouldIgnoreElement(node)) continue

    const computed = window.getComputedStyle(node)

    for (const property of COLOR_DEBUG_PROPERTIES) {
      const value = computed[property]
      if (!value || value === "rgba(0, 0, 0, 0)") continue

      if (hasUnsupportedColorFunction(value)) {
        console.warn("PDF 캡처 대상에 지원되지 않는 색상:", {
          element: node,
          tagName: node.tagName,
          className: node.className,
          property,
          value,
        })
      }
    }
  }
}

function applySafeComputedColor(
  target: HTMLElement,
  property: "color" | "backgroundColor" | "borderColor",
  value: string
): void {
  if (!value || hasUnsupportedColorFunction(value)) return
  target.style[property] = value
}

function validateImages(element: HTMLElement): void {
  const images = Array.from(element.querySelectorAll("img"))

  for (const image of images) {
    const source = image.getAttribute("src") ?? ""

    if (!source) continue

    if (!source.startsWith("data:") && !source.startsWith("blob:")) {
      throw new Error(
        "외부 이미지 URL이 포함되어 PDF를 생성할 수 없습니다. 직인 이미지를 다시 업로드해주세요."
      )
    }
  }
}

function waitForImage(image: HTMLImageElement): Promise<void> {
  if (image.complete && image.naturalWidth > 0) {
    return Promise.resolve()
  }

  return new Promise((resolve, reject) => {
    const handleLoad = () => {
      cleanup()
      resolve()
    }
    const handleError = () => {
      cleanup()
      reject(new Error("직인 이미지를 불러오지 못했습니다."))
    }
    const cleanup = () => {
      image.removeEventListener("load", handleLoad)
      image.removeEventListener("error", handleError)
    }

    image.addEventListener("load", handleLoad)
    image.addEventListener("error", handleError)
  })
}

async function waitForImages(element: HTMLElement): Promise<void> {
  const images = Array.from(element.querySelectorAll("img"))
  await Promise.all(images.map(waitForImage))
}

function runCleanups(cleanups: Array<() => void>): void {
  cleanups.reverse().forEach((cleanup) => {
    try {
      cleanup()
    } catch (error) {
      console.warn("PDF cleanup 실패:", error)
    }
  })
}

function shouldPreserveTransform(node: HTMLElement): boolean {
  return (
    node.tagName === "IMG" ||
    node.dataset.sealImage === "true" ||
    node.dataset.sealMark === "true" ||
    node.closest("[data-seal-mark]") !== null
  )
}

function prepareElementForCapture(element: HTMLElement): () => void {
  const cleanups: Array<() => void> = []

  const elementsToAdjust = [
    element,
    ...Array.from(element.querySelectorAll<HTMLElement>("*")),
  ]

  for (const node of elementsToAdjust) {
    if (!(node instanceof HTMLElement)) continue

    const computed = window.getComputedStyle(node)

    if (
      computed.overflow !== "visible" ||
      computed.overflowX !== "visible" ||
      computed.overflowY !== "visible"
    ) {
      const previousOverflow = node.style.overflow
      const previousOverflowX = node.style.overflowX
      const previousOverflowY = node.style.overflowY

      node.style.overflow = "visible"
      node.style.overflowX = "visible"
      node.style.overflowY = "visible"

      cleanups.push(() => {
        if (node.isConnected) {
          node.style.overflow = previousOverflow
          node.style.overflowX = previousOverflowX
          node.style.overflowY = previousOverflowY
        }
      })
    }

    if (computed.transform !== "none" && !shouldPreserveTransform(node)) {
      const previousTransform = node.style.transform
      node.style.transform = "none"
      cleanups.push(() => {
        if (node.isConnected) {
          node.style.transform = previousTransform
        }
      })
    }
  }

  let parent = element.parentElement
  while (parent) {
    const parentElement = parent instanceof HTMLElement ? parent : null
    const nextParent = parent.parentElement

    if (parentElement) {
      const computed = window.getComputedStyle(parentElement)

      if (computed.position === "sticky" || computed.position === "fixed") {
        const previousPosition = parentElement.style.position
        parentElement.style.position = "static"

        cleanups.push(() => {
          if (parentElement.isConnected) {
            parentElement.style.position = previousPosition
          }
        })
      }
    }

    parent = nextParent
  }

  return () => runCleanups(cleanups)
}

export async function downloadDocumentPdf(
  element: HTMLElement,
  filename: string,
  documentId: string = ESTIMATE_DOCUMENT_ID
): Promise<void> {
  if (typeof window === "undefined") {
    throw new Error("PDF 생성은 브라우저에서만 가능합니다.")
  }

  if (!(element instanceof HTMLElement)) {
    throw new Error(`PDF 캡처 대상 ${documentId}를 찾을 수 없습니다.`)
  }

  validateImages(element)
  await waitForImages(element)

  const [html2canvas, jsPDF] = await Promise.all([
    loadHtml2Canvas(),
    loadJsPDF(),
  ])

  const restoreStyles = prepareElementForCapture(element)

  warnUnsupportedColorsInDocument(element)

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      ignoreElements: shouldIgnoreElement,
      onclone: (clonedDocument) => {
        const liveElement = document.getElementById(documentId)
        const clonedElement = clonedDocument.getElementById(documentId)

        if (!(liveElement instanceof HTMLElement)) return
        if (!(clonedElement instanceof HTMLElement)) return

        const liveNodes = [
          liveElement,
          ...Array.from(liveElement.querySelectorAll<HTMLElement>("*")),
        ]
        const clonedNodes = [
          clonedElement,
          ...Array.from(clonedElement.querySelectorAll<HTMLElement>("*")),
        ]

        liveNodes.forEach((liveNode, index) => {
          const clonedNode = clonedNodes[index]
          if (!(clonedNode instanceof HTMLElement)) return
          if (shouldIgnoreElement(clonedNode)) return

          const computed = window.getComputedStyle(liveNode)

          if (!shouldPreserveTransform(clonedNode)) {
            clonedNode.style.transform = "none"
          }
          clonedNode.style.overflow = "visible"
          clonedNode.style.overflowX = "visible"
          clonedNode.style.overflowY = "visible"
          applySafeComputedColor(clonedNode, "color", computed.color)
          applySafeComputedColor(
            clonedNode,
            "backgroundColor",
            computed.backgroundColor
          )
          applySafeComputedColor(clonedNode, "borderColor", computed.borderColor)
        })
      },
    })

    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    const pageHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = A4_WIDTH_MM
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    let offsetY = 0
    let pageIndex = 0

    while (offsetY < imgHeight) {
      if (pageIndex > 0) {
        pdf.addPage()
      }

      pdf.addImage(imgData, "PNG", 0, -offsetY, imgWidth, imgHeight)
      offsetY += pageHeight
      pageIndex += 1
    }

    pdf.save(filename)
  } finally {
    try {
      restoreStyles()
    } catch (error) {
      console.warn("PDF cleanup 실패:", error)
    }
  }
}

export async function downloadEstimatePdf(
  element: HTMLElement,
  filename: string
): Promise<void> {
  return downloadDocumentPdf(element, filename, ESTIMATE_DOCUMENT_ID)
}
