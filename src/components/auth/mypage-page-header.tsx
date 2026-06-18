interface MypagePageHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export function MypagePageHeader({
  title,
  description,
  action,
}: MypagePageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="text-xl font-bold text-foreground sm:text-2xl">{title}</h2>
        {description ? (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
