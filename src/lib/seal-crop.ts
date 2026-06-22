import type { Area } from "react-easy-crop"

import { loadImage, removeBrightBackground } from "@/lib/seal-image"

export const SEAL_OUTPUT_SIZE = 512

export async function tryRemoveBackground(
  source: string,
  threshold = 235
): Promise<string> {
  try {
    const image = await loadImage(source)
    const processed = removeBrightBackground(image, threshold)

    const testImage = await loadImage(processed)
    const canvas = document.createElement("canvas")
    canvas.width = Math.min(testImage.width, 64)
    canvas.height = Math.min(testImage.height, 64)
    const context = canvas.getContext("2d")
    if (!context) return source

    context.drawImage(
      testImage,
      0,
      0,
      testImage.width,
      testImage.height,
      0,
      0,
      canvas.width,
      canvas.height
    )

    const { data } = context.getImageData(0, 0, canvas.width, canvas.height)
    let transparentPixels = 0

    for (let index = 3; index < data.length; index += 4) {
      if (data[index] < 255) transparentPixels += 1
    }

    if (transparentPixels < 8) {
      return source
    }

    return processed
  } catch {
    return source
  }
}

export async function getCroppedImageDataUrl(
  imageSrc: string,
  pixelCrop: Area
): Promise<string> {
  const image = await loadImage(imageSrc)
  const canvas = document.createElement("canvas")
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  const context = canvas.getContext("2d")
  if (!context) {
    throw new Error("캔버스를 생성할 수 없습니다.")
  }

  context.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )

  return canvas.toDataURL("image/png")
}

export async function resizeSealToPngDataUrl(source: string): Promise<string> {
  const image = await loadImage(source)
  const canvas = document.createElement("canvas")
  canvas.width = SEAL_OUTPUT_SIZE
  canvas.height = SEAL_OUTPUT_SIZE

  const context = canvas.getContext("2d")
  if (!context) {
    throw new Error("캔버스를 생성할 수 없습니다.")
  }

  context.clearRect(0, 0, SEAL_OUTPUT_SIZE, SEAL_OUTPUT_SIZE)
  context.drawImage(image, 0, 0, SEAL_OUTPUT_SIZE, SEAL_OUTPUT_SIZE)
  return canvas.toDataURL("image/png")
}

export async function buildSealPngFile(source: string): Promise<File> {
  const resized = await resizeSealToPngDataUrl(source)

  const response = await fetch(resized)
  const blob = await response.blob()

  return new File([blob], "seal.png", { type: "image/png" })
}

export async function buildSealPreviewFromCrop(
  imageSrc: string,
  pixelCrop: Area
): Promise<string> {
  const cropped = await getCroppedImageDataUrl(imageSrc, pixelCrop)
  return resizeSealToPngDataUrl(cropped)
}
