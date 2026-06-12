interface CalculatorHeaderProps {
  title: string
  description: string
}

export function CalculatorHeader({ title, description }: CalculatorHeaderProps) {
  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      </div>
    </div>
  )
}
