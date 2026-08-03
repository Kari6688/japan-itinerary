export function SiteFooter() {
  return (
    <footer className="mt-12 px-4 py-4 text-center">
      <p className="text-[12px] text-[var(--ink-muted)]">
        Built for Karima · {new Date().getFullYear()}
      </p>
    </footer>
  );
}
