"use client"

import { useState } from "react"
import { Copy, Loader2, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { getAiToolById } from "@/data/ai/tools"
import { generateAiContent } from "@/lib/ai/generate"

interface AiGeneratorProps {
  toolId: string
}

export function AiGenerator({ toolId }: AiGeneratorProps) {
  const tool = getAiToolById(toolId)

  if (!tool) {
    return null
  }
  const [input, setInput] = useState("")
  const [result, setResult] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  async function handleGenerate() {
    setError(null)
    setIsLoading(true)

    try {
      const content = await generateAiContent(toolId, input)
      setResult(content)
    } catch (err) {
      setResult("")
      setError(
        err instanceof Error ? err.message : "생성 중 오류가 발생했습니다."
      )
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCopy() {
    if (!result) return

    try {
      await navigator.clipboard.writeText(result)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setError("복사에 실패했습니다. 직접 선택해 복사해 주세요.")
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card className="border-0 py-0 shadow-sm ring-1 ring-border/80">
        <CardHeader className="border-b border-border/60 px-6 py-5">
          <CardTitle className="text-base font-semibold">입력</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-6 py-6">
          <div className="space-y-2">
            <label
              htmlFor={`${tool.id}-input`}
              className="text-sm font-medium text-foreground"
            >
              {tool.inputLabel}
            </label>
            <Textarea
              id={`${tool.id}-input`}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={tool.inputPlaceholder}
              rows={8}
              disabled={isLoading}
            />
          </div>
          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
          <Button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading || input.trim().length === 0}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" />
                생성 중…
              </>
            ) : (
              <>
                <Sparkles />
                AI로 생성하기
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-0 py-0 shadow-sm ring-1 ring-border/80">
        <CardHeader className="flex flex-row items-center justify-between gap-4 border-b border-border/60 px-6 py-5">
          <CardTitle className="text-base font-semibold">
            {tool.resultLabel}
          </CardTitle>
          {result ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopy}
            >
              <Copy />
              {copied ? "복사됨" : "복사"}
            </Button>
          ) : null}
        </CardHeader>
        <CardContent className="px-6 py-6">
          <div
            className="min-h-[220px] rounded-lg border border-dashed border-border bg-muted/20 px-4 py-4"
            aria-live="polite"
          >
            {result ? (
              <p className="text-sm leading-7 whitespace-pre-wrap text-foreground">
                {result}
              </p>
            ) : (
              <p className="text-sm leading-relaxed text-muted-foreground">
                {tool.emptyResultMessage}
              </p>
            )}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            현재는 더미 결과가 표시됩니다. 향후 OpenAI API와 연동될 예정입니다.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
