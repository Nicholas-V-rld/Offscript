import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design tokens · Offscript",
};

type Swatch = { name: string; hex: string; className: string };

const backgroundSwatches: Swatch[] = [
  { name: "--color-bg-base", hex: "#0E0B08", className: "bg-bg-base" },
  { name: "--color-bg-surface", hex: "#161210", className: "bg-bg-surface" },
  { name: "--color-bg-elevated", hex: "#1E1813", className: "bg-bg-elevated" },
  { name: "--color-bg-input", hex: "#221C17", className: "bg-bg-input" },
];

const borderSwatches: Swatch[] = [
  { name: "--color-border-subtle", hex: "#2A2320", className: "bg-border-subtle" },
  { name: "--color-border-default", hex: "#3A312B", className: "bg-border-default" },
  { name: "--color-border-strong", hex: "#5B4D40", className: "bg-border-strong" },
];

const textSwatches: Swatch[] = [
  { name: "--color-text-primary", hex: "#F5EBD8", className: "bg-text-primary" },
  { name: "--color-text-secondary", hex: "#B8A992", className: "bg-text-secondary" },
  { name: "--color-text-muted", hex: "#7A6E5F", className: "bg-text-muted" },
];

const goldSwatches: Swatch[] = [
  { name: "--color-gold", hex: "#C9A55E", className: "bg-gold" },
  { name: "--color-gold-hover", hex: "#D4B373", className: "bg-gold-hover" },
  { name: "--color-gold-muted", hex: "#8E7440", className: "bg-gold-muted" },
];

const ratingSwatches: Swatch[] = [
  { name: "--color-rating-blocked", hex: "#8C4A3F", className: "bg-rating-blocked" },
  { name: "--color-rating-emerging", hex: "#B8895C", className: "bg-rating-emerging" },
  { name: "--color-rating-present", hex: "#8E826F", className: "bg-rating-present" },
  { name: "--color-rating-strong", hex: "#6B8E5F", className: "bg-rating-strong" },
  { name: "--color-rating-signature", hex: "#C9A55E", className: "bg-rating-signature" },
];

const stateSwatches: Swatch[] = [
  { name: "--color-error", hex: "#C16E5F", className: "bg-error" },
  { name: "--color-success", hex: "#7BA56E", className: "bg-success" },
];

type TypeSpec = {
  className: string;
  token: string;
  size: string;
  lineHeight: string;
};

const typeScale: TypeSpec[] = [
  { className: "text-xs", token: "--text-xs", size: "0.75rem", lineHeight: "1rem" },
  { className: "text-sm", token: "--text-sm", size: "0.875rem", lineHeight: "1.25rem" },
  { className: "text-base", token: "--text-base", size: "1rem", lineHeight: "1.5rem" },
  { className: "text-lg", token: "--text-lg", size: "1.125rem", lineHeight: "1.625rem" },
  { className: "text-xl", token: "--text-xl", size: "1.25rem", lineHeight: "1.75rem" },
  { className: "text-2xl", token: "--text-2xl", size: "1.5rem", lineHeight: "2rem" },
  { className: "text-3xl", token: "--text-3xl", size: "1.875rem", lineHeight: "2.25rem" },
  { className: "text-4xl", token: "--text-4xl", size: "2.25rem", lineHeight: "2.5rem" },
];

type RadiusSpec = { className: string; token: string; value: string };

const radii: RadiusSpec[] = [
  { className: "rounded-sm", token: "--radius-sm", value: "4px" },
  { className: "rounded-md", token: "--radius-md", value: "8px" },
  { className: "rounded-lg", token: "--radius-lg", value: "12px" },
  { className: "rounded-xl", token: "--radius-xl", value: "16px" },
  { className: "rounded-2xl", token: "--radius-2xl", value: "24px" },
  { className: "rounded-full", token: "--radius-full", value: "9999px" },
];

const spacingSteps = [1, 2, 3, 4, 6, 8, 12, 16, 24];

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-2xl text-text-primary mb-1">{children}</h2>
  );
}

function SwatchGroup({ title, swatches }: { title: string; swatches: Swatch[] }) {
  return (
    <div className="mb-6">
      <h3 className="text-sm uppercase tracking-wide text-text-muted mb-3">
        {title}
      </h3>
      <div className="flex flex-col gap-2">
        {swatches.map((s) => (
          <div
            key={s.name}
            className="flex items-center gap-3 rounded-lg border border-border-subtle bg-bg-surface p-3"
          >
            <div
              className={`h-12 w-12 shrink-0 rounded-md border border-border-subtle ${s.className}`}
            />
            <div className="min-w-0">
              <p className="text-sm text-text-primary truncate">{s.name}</p>
              <p className="text-xs text-text-muted uppercase">{s.hex}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DesignPage() {
  return (
    <main className="min-h-screen bg-bg-base px-5 py-10">
      <div className="mx-auto w-full max-w-md">
        <header className="mb-10">
          <p className="text-xs uppercase tracking-widest text-gold mb-2">
            Internal · Design review
          </p>
          <h1 className="font-display text-4xl text-text-primary mb-2">
            Offscript tokens
          </h1>
          <p className="text-base text-text-secondary">
            Warm near-black and antique gold. The rehearsal studio aesthetic —
            calm, premium, focused.
          </p>
        </header>

        {/* 1. Palette */}
        <section className="mb-12">
          <SectionHeading>Palette</SectionHeading>
          <p className="text-sm text-text-muted mb-6">
            Every color token, grouped by role.
          </p>
          <SwatchGroup title="Background" swatches={backgroundSwatches} />
          <SwatchGroup title="Border" swatches={borderSwatches} />
          <SwatchGroup title="Text" swatches={textSwatches} />
          <SwatchGroup title="Gold" swatches={goldSwatches} />
          <SwatchGroup title="Rating" swatches={ratingSwatches} />
          <SwatchGroup title="State" swatches={stateSwatches} />
        </section>

        {/* 2. Type Scale */}
        <section className="mb-12">
          <SectionHeading>Type Scale</SectionHeading>
          <p className="text-sm text-text-muted mb-6">
            Mobile-first, set on a 16px base.
          </p>

          <h3 className="text-sm uppercase tracking-wide text-text-muted mb-3">
            Inter (body / UI)
          </h3>
          <div className="flex flex-col gap-5 mb-8">
            {typeScale.map((t) => (
              <div
                key={`inter-${t.className}`}
                className="border-b border-border-subtle pb-4"
              >
                <p className={`${t.className} text-text-primary`}>
                  The quick brown fox
                </p>
                <p className="text-xs text-text-muted mt-1">
                  {t.token} · {t.size} / {t.lineHeight}
                </p>
              </div>
            ))}
          </div>

          <h3 className="text-sm uppercase tracking-wide text-text-muted mb-3">
            Fraunces (display serif)
          </h3>
          <div className="flex flex-col gap-5">
            {typeScale.map((t) => (
              <div
                key={`display-${t.className}`}
                className="border-b border-border-subtle pb-4"
              >
                <p className={`font-display ${t.className} text-text-primary`}>
                  Speak with intent
                </p>
                <p className="text-xs text-text-muted mt-1">
                  {t.token} · {t.size} / {t.lineHeight}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Radii */}
        <section className="mb-12">
          <SectionHeading>Radii</SectionHeading>
          <p className="text-sm text-text-muted mb-6">Corner radius scale.</p>
          <div className="flex flex-col gap-3">
            {radii.map((r) => (
              <div key={r.token} className="flex items-center gap-3">
                <div
                  className={`h-16 w-16 shrink-0 border border-border-strong bg-bg-elevated ${r.className}`}
                />
                <div>
                  <p className="text-sm text-text-primary">{r.className}</p>
                  <p className="text-xs text-text-muted">
                    {r.token} · {r.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Spacing */}
        <section className="mb-12">
          <SectionHeading>Spacing</SectionHeading>
          <p className="text-sm text-text-muted mb-6">
            Tailwind default scale (0.25rem step).
          </p>
          <div className="flex flex-col gap-3">
            {spacingSteps.map((step) => (
              <div key={step} className="flex items-center gap-3">
                <span className="w-10 shrink-0 text-xs text-text-muted">
                  {step}
                </span>
                <div
                  className="h-4 rounded-sm bg-gold"
                  style={{ width: `${step * 0.25}rem` }}
                />
                <span className="text-xs text-text-muted">
                  {step * 0.25}rem
                </span>
              </div>
            ))}
          </div>
        </section>

        <footer className="border-t border-border-subtle pt-6">
          <p className="text-xs text-text-muted">
            Offscript design tokens · locked visual identity
          </p>
        </footer>
      </div>
    </main>
  );
}
