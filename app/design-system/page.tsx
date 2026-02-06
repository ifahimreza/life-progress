import Link from "next/link";
import {getSEOTags} from "../../libs/seo";

export const metadata = getSEOTags({
  title: "DotSpan Design System | Swiss Precision",
  description:
    "DotSpan design system reference: geometric clarity, monochrome base, electric blue signal, and tight grid spacing.",
  canonicalUrlRelative: "/design-system"
});

const colorTokens = [
  {name: "Ink 1000", value: "#090b10", usage: "Primary text, strong contrast"},
  {name: "Ink 900", value: "#12151c", usage: "Headings, icon default"},
  {name: "Ink 700", value: "#2a2f3c", usage: "Secondary text"},
  {name: "Ink 500", value: "#6b7280", usage: "Muted labels"},
  {name: "Line 200", value: "#e7e9ee", usage: "Dividers, control borders"},
  {name: "Paper", value: "#ffffff", usage: "Surface background"},
  {name: "Signal Blue", value: "#2754ff", usage: "Action, focus, active states"},
  {name: "Signal Blue Soft", value: "rgba(39,84,255,0.12)", usage: "Subtle accent fills"}
];

const typeScale = [
  {token: "Display", value: "56 / 0.98 / 700", sample: "Swiss Precision"},
  {token: "H1", value: "40 / 1.05 / 700", sample: "Geometric clarity"},
  {token: "H2", value: "28 / 1.15 / 700", sample: "Monochrome base"},
  {token: "Body", value: "16 / 1.5 / 500", sample: "Electric blue signal"},
  {token: "Label", value: "12 / 1.25 / 700", sample: "TIGHT GRID"}
];

const spacingScale = [4, 8, 12, 16, 24, 32, 40, 56, 72];

function Swatch({
  name,
  value,
  usage
}: {
  name: string;
  value: string;
  usage: string;
}) {
  return (
    <article className="grid grid-cols-[40px_1fr] gap-3 border border-[#e7e9ee] bg-white p-3">
      <span
        className="h-10 w-10 border border-[#d6d9e2]"
        style={{backgroundColor: value.startsWith("rgba") ? "#ffffff" : value}}
      >
        {value.startsWith("rgba") ? (
          <span
            className="block h-full w-full"
            style={{backgroundColor: value}}
          />
        ) : null}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#11131a]">{name}</p>
        <p className="mt-0.5 font-mono text-xs text-[#3e4455]">{value}</p>
        <p className="mt-1 text-xs text-[#596074]">{usage}</p>
      </div>
    </article>
  );
}

export default function DesignSystemPage() {
  return (
    <main className="min-h-screen bg-white text-[#11131a]">
      <div className="mx-auto w-full max-w-[1120px] px-4 pb-16 pt-6 sm:px-6">
        <header className="border border-[#e7e9ee] bg-white">
          <div className="grid gap-6 border-b border-[#e7e9ee] px-4 py-4 sm:grid-cols-[1fr_auto] sm:items-end sm:px-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#6b7280]">
                DotSpan Design System
              </p>
              <h1 className="mt-3 text-[38px] font-bold leading-[1.02] tracking-[-0.03em] sm:text-[56px]">
                Swiss Precision
              </h1>
              <p className="mt-3 max-w-[64ch] text-base text-[#2a2f3c]">
                Geometric clarity with a monochrome base, one electric blue signal, and a strict
                spacing grid. Built for readability, discipline, and fast decision-making.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/"
                className="inline-flex h-10 items-center border border-[#e7e9ee] px-4 text-xs font-bold uppercase tracking-[0.18em] text-[#11131a] transition hover:bg-[#f7f8fb]"
              >
                Home
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex h-10 items-center border border-[#2754ff] bg-[#2754ff] px-4 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#1f45d4]"
              >
                Dashboard
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 border-b border-[#e7e9ee] sm:grid-cols-4">
            <div className="border-r border-[#e7e9ee] px-4 py-3 sm:px-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6b7280]">Grid</p>
              <p className="mt-1 text-sm font-semibold">8px rhythm</p>
            </div>
            <div className="border-r border-[#e7e9ee] px-4 py-3 sm:px-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6b7280]">Signal</p>
              <p className="mt-1 text-sm font-semibold">#2754FF</p>
            </div>
            <div className="border-r border-[#e7e9ee] px-4 py-3 sm:px-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6b7280]">Radius</p>
              <p className="mt-1 text-sm font-semibold">0 / 8 / 16</p>
            </div>
            <div className="px-4 py-3 sm:px-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6b7280]">Shadow</p>
              <p className="mt-1 text-sm font-semibold">None</p>
            </div>
          </div>
        </header>

        <section className="mt-8 border border-[#e7e9ee] bg-white">
          <div className="border-b border-[#e7e9ee] px-4 py-3 sm:px-6">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6b7280]">Color Tokens</h2>
          </div>
          <div className="grid gap-0 sm:grid-cols-2">
            {colorTokens.map((token) => (
              <Swatch key={token.name} name={token.name} value={token.value} usage={token.usage} />
            ))}
          </div>
        </section>

        <section className="mt-8 border border-[#e7e9ee] bg-white">
          <div className="border-b border-[#e7e9ee] px-4 py-3 sm:px-6">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6b7280]">Typography</h2>
          </div>
          <div className="divide-y divide-[#e7e9ee]">
            {typeScale.map((item) => (
              <div key={item.token} className="grid gap-2 px-4 py-4 sm:grid-cols-[180px_180px_1fr] sm:items-center sm:px-6">
                <p className="text-sm font-semibold">{item.token}</p>
                <p className="font-mono text-xs text-[#556079]">{item.value}</p>
                <p
                  className={`${
                    item.token === "Display"
                      ? "text-[40px] font-bold leading-[1] tracking-[-0.03em] sm:text-[56px]"
                      : item.token === "H1"
                      ? "text-[34px] font-bold leading-[1.04] tracking-[-0.02em] sm:text-[40px]"
                      : item.token === "H2"
                      ? "text-[24px] font-bold leading-[1.12] tracking-[-0.01em] sm:text-[28px]"
                      : item.token === "Body"
                      ? "text-base font-medium leading-[1.5]"
                      : "text-xs font-bold uppercase tracking-[0.2em]"
                  }`}
                >
                  {item.sample}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 border border-[#e7e9ee] bg-white">
          <div className="border-b border-[#e7e9ee] px-4 py-3 sm:px-6">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6b7280]">Spacing Scale</h2>
          </div>
          <div className="grid gap-0 sm:grid-cols-3">
            {spacingScale.map((size) => (
              <div key={size} className="flex items-center gap-3 border-b border-[#e7e9ee] px-4 py-3 sm:px-6">
                <span className="w-10 font-mono text-xs text-[#556079]">{size}px</span>
                <span className="h-4 bg-[#2754ff]" style={{width: `${size * 2}px`}} />
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 border border-[#e7e9ee] bg-white">
          <div className="border-b border-[#e7e9ee] px-4 py-3 sm:px-6">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6b7280]">Component Specimens</h2>
          </div>
          <div className="grid gap-0 sm:grid-cols-2">
            <div className="border-b border-[#e7e9ee] p-4 sm:border-r sm:p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6b7280]">Actions</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="h-10 border border-[#2754ff] bg-[#2754ff] px-4 text-xs font-bold uppercase tracking-[0.16em] text-white"
                >
                  Primary
                </button>
                <button
                  type="button"
                  className="h-10 border border-[#e7e9ee] bg-white px-4 text-xs font-bold uppercase tracking-[0.16em] text-[#11131a]"
                >
                  Secondary
                </button>
                <button
                  type="button"
                  className="h-10 w-10 rounded-full border border-[#e7e9ee] bg-white text-[#11131a]"
                  aria-label="Icon button specimen"
                >
                  +
                </button>
              </div>
            </div>

            <div className="border-b border-[#e7e9ee] p-4 sm:p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6b7280]">Inputs</p>
              <div className="mt-4 grid gap-2">
                <input
                  type="text"
                  value="you@dotspan.io"
                  readOnly
                  className="h-11 border border-[#e7e9ee] px-3 text-sm font-medium text-[#11131a]"
                />
                <div className="flex h-11 items-center justify-between border border-[#e7e9ee] px-3 text-sm">
                  <span className="text-[#11131a]">Theme</span>
                  <span className="font-mono text-xs text-[#556079]">Classic</span>
                </div>
              </div>
            </div>

            <div className="border-b border-[#e7e9ee] p-4 sm:border-r sm:p-6 sm:border-b-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6b7280]">Cards</p>
              <article className="mt-4 border border-[#e7e9ee] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6b7280]">Your Life in Weeks</p>
                <p className="mt-2 text-lg font-bold leading-tight">A strict visual system keeps focus high.</p>
                <p className="mt-2 text-sm text-[#2a2f3c]">
                  No decoration-first UI. Clear hierarchy, measurable spacing, and one signal color.
                </p>
              </article>
            </div>

            <div className="p-4 sm:p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6b7280]">Status</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex h-8 items-center border border-[#e7e9ee] px-3 text-xs font-bold uppercase tracking-[0.16em]">
                  Neutral
                </span>
                <span className="inline-flex h-8 items-center border border-[#2754ff] bg-[#2754ff] px-3 text-xs font-bold uppercase tracking-[0.16em] text-white">
                  Active
                </span>
                <span className="inline-flex h-8 items-center border border-[#2754ff] bg-[rgba(39,84,255,0.12)] px-3 text-xs font-bold uppercase tracking-[0.16em] text-[#1f45d4]">
                  Signal
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
