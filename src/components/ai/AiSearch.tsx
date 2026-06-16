"use client"

import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"

interface AiSearchProps {
  value: string
  onChange: (value: string) => void
  resultCount: number
}

export function AiSearch({ value, onChange, resultCount }: AiSearchProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative max-w-md flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="도구명 검색"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="pl-9"
          aria-label="AI 도구명 검색"
        />
      </div>
      <p className="text-sm text-muted-foreground">총 {resultCount}개 도구</p>
    </div>
  )
}
