export default function Footer() {
  return (
    <footer className="w-full border-t border-line-2 py-6 text-center">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center justify-center gap-2 text-xs text-ink-muted sm:flex-row">
          <span>© 2026 FilmoNation.</span>
          <span className="flex items-center gap-1.5">
            Powered by
            <img src="/tmdb-logo.svg" alt="TMDB Logo" className="h-3 inline-block" />
          </span>
        </div>
        <p className="mt-2 text-[10px] text-ink-muted/70 max-w-md mx-auto">
          Este producto utiliza la API de TMDB pero no está avalado ni certificado por TMDB.
        </p>
      </div>
    </footer>
  );
}
