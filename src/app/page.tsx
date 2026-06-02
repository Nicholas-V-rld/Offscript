import Link from "next/link";
import { button } from "@/components/ui/Button";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg-base px-5 py-16">
      <div className="mx-auto flex w-full max-w-md flex-col">
        <section className="animate-fade-in-up">
          <p className="text-xs font-medium uppercase tracking-widest text-gold">
            Offscript&nbsp;&middot;&nbsp;Communication Coach for Creators
          </p>

          <h1 className="mt-6 font-display text-4xl leading-tight text-text-primary md:text-5xl">
            Sound like yourself.
            <br />
            On purpose.
          </h1>

          <p className="mt-5 text-base text-text-secondary">
            A rehearsal studio for the way you actually talk. Pick an intent,
            pick a voice, record a take, and get feedback that strengthens
            what&apos;s already yours.
          </p>

          <div className="mt-10">
            <Link
              href="/start"
              className={button({ variant: "primary", size: "lg" }) + " w-full md:w-auto"}
            >
              Start a free analysis
            </Link>
            <p className="mt-3 text-sm text-text-muted">
              No account needed to start. One free analysis included.
            </p>
          </div>
        </section>

        <section className="mt-20 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-gold">
              Confidence
            </p>
            <p className="mt-3 text-base text-text-secondary">
              Find your voice without forcing it into someone else&apos;s shape.
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-gold">
              Clarity
            </p>
            <p className="mt-3 text-base text-text-secondary">
              Discover what&apos;s working before you change what isn&apos;t.
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-gold">
              Connection
            </p>
            <p className="mt-3 text-base text-text-secondary">
              Communication that reaches people, not algorithms.
            </p>
          </div>
        </section>

        <footer className="mt-24 text-center text-sm text-text-muted">
          Offscript &middot; A rehearsal studio for creators
        </footer>
      </div>
    </main>
  );
}
