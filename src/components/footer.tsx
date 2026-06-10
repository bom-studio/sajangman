export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-white py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} 사장만. 사장님의 업무를 더 쉽게.
        </p>
      </div>
    </footer>
  )
}
