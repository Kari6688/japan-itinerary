export function SiteFooter() {
  return (
    <footer className="mt-12 px-4 py-4 text-center">
      <p className="font-mono text-[12px] text-[var(--keshizumi)]">
        Built for Karima · {new Date().getFullYear()} · Map layout from{" "}
        <a
          href="https://github.com/willlenzen/japan-field-guide"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--sunezumi)] no-underline transition-colors hover:text-[var(--shironeri)]"
        >
          japan-field-guide
        </a>
      </p>
    </footer>
  );
}
