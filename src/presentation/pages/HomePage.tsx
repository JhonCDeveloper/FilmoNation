export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex w-full border-b border-line pb-10">
        <div className="w-1/2 pt-24">
          <h1 className="font-display font-bold-md text-7xl">
            Toda película es <br />
            un territorio.
            <br />
            <em className="text-brand font-normal">Conquista el tuyo.</em>
          </h1>
          <p className="mt-8 text-md text-ink-muted">
            FilmoNation no te recomienda qué ver: te da papeles para entrar.
            <br />
            Explora el archivo, guarda visas pendientes y sella tu pasaporte cada vez
            <br /> que termines una.
          </p>
        </div>
        <div></div>
      </section>

      <section>
        <h2 className="font-display font-bold text-3xl">Tendencias del momento</h2>
        <div></div>
      </section>
    </div>
  );
}
