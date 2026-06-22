"use client"

import { Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import type { DocumentSearchField } from "@/types/documents"

const SEARCH_FIELD_OPTIONS: {
  value: DocumentSearchField
  label: string
  placeholder: string
}[] = [
  {
    value: "all",
    label: "전체",
    placeholder: "제목, 고객명, 공급자명으로 검색",
  },
  {
    value: "title",
    label: "제목",
    placeholder: "제목으로 검색",
  },
  {
    value: "customer_name",
    label: "고객명",
    placeholder: "고객명으로 검색",
  },
  {
    value: "supplier_name",
    label: "공급자명",
    placeholder: "공급자명으로 검색",
  },
]

interface DocumentListSearchProps {
  value: string
  searchField: DocumentSearchField
  onChange: (value: string) => void
  onSearchFieldChange: (field: DocumentSearchField) => void
  onSearch: () => void
  onReset: () => void
  isSearching?: boolean
  className?: string
}

export function DocumentListSearch({
  value,
  searchField,
  onChange,
  onSearchFieldChange,
  onSearch,
  onReset,
  isSearching = false,
  className,
}: DocumentListSearchProps) {
  const placeholder =
    SEARCH_FIELD_OPTIONS.find((option) => option.value === searchField)
      ?.placeholder ?? SEARCH_FIELD_OPTIONS[0].placeholder

  const canReset =
    value.length > 0 || searchField !== "all" || isSearching

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSearch()
  }

  return (
    <div className={cn("space-y-3", className)}>
      <RadioGroup
        value={searchField}
        onValueChange={(nextValue) =>
          onSearchFieldChange(nextValue as DocumentSearchField)
        }
        className="flex flex-wrap gap-x-4 gap-y-2"
        aria-label="검색 조건"
      >
        {SEARCH_FIELD_OPTIONS.map((option) => (
          <div key={option.value} className="flex items-center gap-2">
            <RadioGroupItem
              value={option.value}
              id={`document-search-${option.value}`}
            />
            <label
              htmlFor={`document-search-${option.value}`}
              className="cursor-pointer text-sm font-medium text-foreground"
            >
              {option.label}
            </label>
          </div>
        ))}
      </RadioGroup>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 sm:flex-row sm:items-center"
      >
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className="h-10 pr-3 pl-9"
            aria-label="문서 검색어"
          />
        </div>
        <div className="flex shrink-0 gap-2">
          <Button type="submit" className="h-10 flex-1 sm:flex-none">
            검색
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onReset}
            disabled={!canReset}
            className="h-10 flex-1 sm:flex-none"
          >
            <X className="size-4" />
            초기화
          </Button>
        </div>
      </form>
    </div>
  )
}
