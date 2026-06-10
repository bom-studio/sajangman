export interface SealProcessOptions {
  crop1x1: boolean
  removeBackground: boolean
  brightnessThreshold?: number
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error("이미지를 불러올 수 없습니다."))
    image.src = src
  })
}

export function cropCenterSquare(image: HTMLImageElement): string {
  const size = Math.min(image.width, image.height)
  const sx = (image.width - size) / 2
  const sy = (image.height - size) / 2

  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size

  const context = canvas.getContext("2d")
  if (!context) throw new Error("캔버스를 생성할 수 없습니다.")

  context.drawImage(image, sx, sy, size, size, 0, 0, size, size)
  return canvas.toDataURL("image/png")
}

export function removeBrightBackground(
  image: HTMLImageElement,
  threshold = 240
): string {
  const canvas = document.createElement("canvas")
  canvas.width = image.width
  canvas.height = image.height

  const context = canvas.getContext("2d")
  if (!context) throw new Error("캔버스를 생성할 수 없습니다.")

  context.drawImage(image, 0, 0)
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
  const { data } = imageData

  for (let index = 0; index < data.length; index += 4) {
    const red = data[index]
    const green = data[index + 1]
    const blue = data[index + 2]

    if (red >= threshold && green >= threshold && blue >= threshold) {
      data[index + 3] = 0
    }
  }

  context.putImageData(imageData, 0, 0)
  return canvas.toDataURL("image/png")
}

export async function processSealImage(
  source: string,
  options: SealProcessOptions
): Promise<string> {
  let current = source
  const threshold = options.brightnessThreshold ?? 240

  if (options.crop1x1) {
    const image = await loadImage(current)
    current = cropCenterSquare(image)
  }

  if (options.removeBackground) {
    const image = await loadImage(current)
    current = removeBrightBackground(image, threshold)
  }

  return current
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result)
      } else {
        reject(new Error("파일을 읽을 수 없습니다."))
      }
    }
    reader.onerror = () => reject(new Error("파일을 읽을 수 없습니다."))
    reader.readAsDataURL(file)
  })
}
