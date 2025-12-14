import Link from 'next/link';
import { BarChart3, Link2, Scissors, Shield } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="bg-charcoal relative min-h-screen">
      {/* Subtle background blobs */}
      <div className="bg-electric-yellow/10 pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full blur-3xl" />
      <div className="bg-salmon/10 pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4">
        {/* Top nav */}
        <header className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-electric-yellow shadow-neo-sm flex h-10 w-10 items-center justify-center rounded-lg border-2 border-zinc-700">
              <Scissors className="text-charcoal h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white uppercase">
              TrimBento
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="shadow-neo-md hover:shadow-neo-sm-hover inline-flex items-center justify-center rounded-xl border-2 border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm font-bold tracking-wide text-white uppercase transition-all duration-100 hover:bg-zinc-800"
            >
              Sign in
            </Link>
            <Link
              href="/sign-in"
              className="bg-electric-yellow text-charcoal shadow-neo-md hover:shadow-neo-sm-hover inline-flex items-center justify-center rounded-xl border-2 border-zinc-700 px-4 py-2.5 text-sm font-bold tracking-wide uppercase transition-all duration-100"
            >
              Get started
            </Link>
          </div>
        </header>

        {/* Hero */}
        <main className="flex flex-1 flex-col justify-center py-10">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <div>
              <h1 className="text-4xl leading-tight font-bold tracking-tight text-white sm:text-5xl">
                Shorten links.
                <span className="text-electric-yellow"> Track clicks.</span>
              </h1>
              <p className="mt-4 max-w-xl text-base text-zinc-300 sm:text-lg">
                TrimBento is a neo-brutalist link shortener with a clean
                dashboard, analytics, and QR codes.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/sign-in"
                  className="bg-electric-yellow text-charcoal shadow-neo-md hover:shadow-neo-sm-hover inline-flex items-center justify-center rounded-xl border-2 border-zinc-700 px-6 py-3 font-bold tracking-wide uppercase transition-all duration-100"
                >
                  Sign in to continue
                </Link>
                <Link
                  href="/dashboard"
                  className="shadow-neo-md hover:shadow-neo-sm-hover inline-flex items-center justify-center rounded-xl border-2 border-zinc-700 bg-zinc-900 px-6 py-3 font-bold tracking-wide text-white uppercase transition-all duration-100 hover:bg-zinc-800"
                >
                  Open dashboard
                </Link>
              </div>

              <p className="mt-4 text-xs text-zinc-500">
                Tip: Email/password sign-in is a simple local stub for now.
              </p>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="shadow-neo-md rounded-2xl border-2 border-zinc-700 bg-zinc-900 p-5">
                <div className="text-electric-yellow flex h-10 w-10 items-center justify-center rounded-xl border-2 border-zinc-700 bg-zinc-800">
                  <Link2 className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-lg font-bold text-white">
                  Fast links
                </h2>
                <p className="mt-2 text-sm text-zinc-400">
                  Create clean short URLs for sharing anywhere.
                </p>
              </div>

              <div className="shadow-neo-md rounded-2xl border-2 border-zinc-700 bg-zinc-900 p-5">
                <div className="text-electric-yellow flex h-10 w-10 items-center justify-center rounded-xl border-2 border-zinc-700 bg-zinc-800">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-lg font-bold text-white">Analytics</h2>
                <p className="mt-2 text-sm text-zinc-400">
                  See clicks, referrers, devices, and locations.
                </p>
              </div>

              <div className="shadow-neo-md rounded-2xl border-2 border-zinc-700 bg-zinc-900 p-5">
                <div className="text-electric-yellow flex h-10 w-10 items-center justify-center rounded-xl border-2 border-zinc-700 bg-zinc-800">
                  <Shield className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-lg font-bold text-white">Controls</h2>
                <p className="mt-2 text-sm text-zinc-400">
                  Manage links, API keys, and preferences from one place.
                </p>
              </div>

              <div className="shadow-neo-md rounded-2xl border-2 border-zinc-700 bg-zinc-900 p-5">
                <div className="text-electric-yellow flex h-10 w-10 items-center justify-center rounded-xl border-2 border-zinc-700 bg-zinc-800">
                  <Scissors className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-lg font-bold text-white">Neo UI</h2>
                <p className="mt-2 text-sm text-zinc-400">
                  Brutalist, dark-first design with snappy interactions.
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="flex items-center justify-between border-t-2 border-zinc-700 py-6 text-xs text-zinc-500">
          <span>© {new Date().getFullYear()} TrimBento</span>
          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="hover:text-white">
              Sign in
            </Link>
            <Link href="/dashboard" className="hover:text-white">
              Dashboard
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
