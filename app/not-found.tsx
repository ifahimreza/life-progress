import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[640px] items-center px-6 py-12">
      <section className="w-full space-y-4 rounded-2xl border border-surface bg-white p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-subtle">
          DotSpan
        </p>
        <h1 className="text-2xl font-semibold text-main sm:text-3xl">
          Page not found
        </h1>
        <p className="text-sm text-muted">
          The page you requested does not exist.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
        >
          Go home
        </Link>
      </section>
    </main>
  );
}
