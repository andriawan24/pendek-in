import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Scissors } from 'lucide-react';

export const metadata: Metadata = {
  title: 'CLI Documentation - Pendek In',
  description:
    'Shorten URLs, manage links, and view analytics from your terminal with the Pendek In CLI.',
};

function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border-2 border-zinc-700 bg-zinc-800 p-4">
      <div className="mb-3 flex items-center gap-1.5">
        <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
        <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
        <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
      </div>
      <pre className="overflow-x-auto font-mono text-sm text-zinc-300">
        {children}
      </pre>
    </div>
  );
}

function CommandSection({
  name,
  description,
  usage,
  example,
  output,
  flags,
}: {
  name: string;
  description: string;
  usage: string;
  example: string;
  output: string;
  flags?: { flag: string; desc: string }[];
}) {
  return (
    <div className="rounded-xl border-2 border-zinc-700 bg-zinc-900 p-6">
      <h3 className="font-mono text-lg font-bold text-white">pendek {name}</h3>
      <p className="mt-1 text-sm text-zinc-400">{description}</p>
      <div className="mt-2 text-xs text-zinc-500">
        Usage: <code className="text-zinc-400">{usage}</code>
      </div>
      {flags && flags.length > 0 && (
        <div className="mt-3 space-y-1">
          {flags.map((f) => (
            <div key={f.flag} className="text-xs">
              <code className="text-electric-yellow">{f.flag}</code>
              <span className="ml-2 text-zinc-500">{f.desc}</span>
            </div>
          ))}
        </div>
      )}
      <div className="mt-4 rounded-lg border border-zinc-700 bg-zinc-800 p-3">
        <div className="font-mono text-sm">
          <div>
            <span className="text-electric-yellow">$ </span>
            <span className="text-zinc-300">{example}</span>
          </div>
          <div className="mt-1 text-zinc-500">{output}</div>
        </div>
      </div>
    </div>
  );
}

export default function CLIDocsPage() {
  return (
    <div className="bg-charcoal relative min-h-screen overflow-hidden">
      <div className="grain-overlay" />

      <div className="pointer-events-none absolute inset-0">
        <div className="bg-electric-yellow/5 absolute -top-40 -right-40 h-80 w-80 rounded-full blur-3xl" />
        <div className="bg-cyan/5 absolute top-1/3 -left-40 h-80 w-80 rounded-full blur-3xl" />
      </div>

      <div className="grid-pattern pointer-events-none absolute inset-0 opacity-30" />

      <div className="relative mx-auto max-w-4xl px-4">
        {/* Header */}
        <header className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-electric-yellow flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700">
              <Scissors className="text-charcoal h-4 w-4" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white uppercase">
              Pendek In
            </span>
          </Link>
          <Link
            href="/"
            className="link-underline inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </header>

        {/* Hero */}
        <section className="py-16 text-center md:py-24">
          <div className="bg-electric-yellow/10 border-electric-yellow/30 mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm">
            <span className="text-electric-yellow font-medium">
              Built with Go
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Pendek <span className="text-electric-yellow">CLI</span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-zinc-400">
            Shorten URLs, manage links, and view analytics directly from your
            terminal. Fast, scriptable, and developer-friendly.
          </p>
        </section>

        {/* Installation */}
        <section className="py-8">
          <h2 className="mb-6 text-2xl font-bold text-white">Installation</h2>
          <CodeBlock>
            <span className="text-electric-yellow">$ </span>
            go install github.com/andriawan24/pendek-in-cli/cmd/pendek@latest
          </CodeBlock>
          <p className="mt-4 text-sm text-zinc-500">
            Requires Go 1.25 or later. The binary will be installed to your{' '}
            <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-400">
              $GOPATH/bin
            </code>{' '}
            directory.
          </p>
        </section>

        {/* Authentication */}
        <section className="py-8">
          <h2 className="mb-6 text-2xl font-bold text-white">Authentication</h2>
          <p className="mb-4 text-zinc-400">
            Log in with your Pendek In account to start managing links.
          </p>
          <CodeBlock>
            <span className="text-electric-yellow">$ </span>pendek login{'\n'}
            <span className="text-zinc-500">? Email: user@example.com</span>
            {'\n'}
            <span className="text-zinc-500">? Password: ••••••••</span>
            {'\n'}
            <span className="text-green-400">
              ✓ Logged in as John Doe (user@example.com)
            </span>
          </CodeBlock>
          <p className="mt-4 text-sm text-zinc-500">
            Credentials are saved securely in{' '}
            <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-400">
              ~/.config/pendek-in/
            </code>
            .
          </p>
        </section>

        {/* Commands Reference */}
        <section className="py-8">
          <h2 className="mb-6 text-2xl font-bold text-white">Commands</h2>
          <div className="grid gap-4">
            <CommandSection
              name="shorten"
              description="Create a shortened URL"
              usage="pendek shorten <url> [flags]"
              example="pendek shorten https://example.com/very-long-path -c my-link"
              output="✓ URL shortened successfully!&#10;  Short URL:  pendek.in/my-link"
              flags={[
                { flag: '-c, --custom', desc: 'Custom short code' },
                {
                  flag: '-e, --expiry',
                  desc: 'Expiration date (RFC3339 or YYYY-MM-DD)',
                },
              ]}
            />
            <CommandSection
              name="list"
              description="List all your shortened URLs"
              usage="pendek list"
              example="pendek list"
              output="3 links found&#10;  Code     Original URL          Clicks  Created&#10;  x7k9m2   example.com/...       247     2025-01-15&#10;  abc123   github.com/...        89      2025-01-10"
            />
            <CommandSection
              name="stats"
              description="Show analytics and statistics"
              usage="pendek stats [flags]"
              example="pendek stats --range 30d"
              output="Analytics  2025-01-01 to 2025-01-30&#10;  Total Clicks     1,247&#10;  Active Links     12&#10;  Avg Daily Clicks 41"
              flags={[
                {
                  flag: '-r, --range',
                  desc: 'Time range: 7d, 30d, 90d (default: 7d)',
                },
              ]}
            />
            <CommandSection
              name="share"
              description="Copy a shortened URL to clipboard"
              usage="pendek share <short-code>"
              example="pendek share x7k9m2"
              output="✓ Copied to clipboard: pendek.in/x7k9m2"
            />
            <CommandSection
              name="delete"
              description="Delete a shortened URL"
              usage="pendek delete <link-id> [flags]"
              example="pendek delete abc123 --force"
              output="✓ Link abc123 deleted"
              flags={[
                { flag: '-f, --force', desc: 'Skip confirmation prompt' },
              ]}
            />
            <CommandSection
              name="whoami"
              description="Show current authenticated user"
              usage="pendek whoami"
              example="pendek whoami"
              output="✓ Logged in as John Doe&#10;  Name    John Doe&#10;  Email   user@example.com&#10;  Verified  Yes"
            />
            <CommandSection
              name="logout"
              description="Log out and clear saved credentials"
              usage="pendek logout"
              example="pendek logout"
              output="✓ Logged out successfully"
            />
            <CommandSection
              name="version"
              description="Print version information"
              usage="pendek version"
              example="pendek version"
              output="pendek version 1.0.0 (commit: a1b2c3d, built: 2025-01-15)"
            />
          </div>
        </section>

        {/* Global Flags */}
        <section className="py-8">
          <h2 className="mb-6 text-2xl font-bold text-white">Global Flags</h2>
          <div className="rounded-xl border-2 border-zinc-700 bg-zinc-900 p-6">
            <div className="space-y-3">
              <div>
                <code className="text-electric-yellow font-mono text-sm">
                  --json
                </code>
                <span className="ml-3 text-sm text-zinc-400">
                  Output in JSON format (useful for scripting)
                </span>
              </div>
              <div>
                <code className="text-electric-yellow font-mono text-sm">
                  --no-color
                </code>
                <span className="ml-3 text-sm text-zinc-400">
                  Disable colored output
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Configuration */}
        <section className="py-8">
          <h2 className="mb-6 text-2xl font-bold text-white">Configuration</h2>
          <p className="mb-4 text-zinc-400">
            Configure the CLI using environment variables or a{' '}
            <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-400">
              .env
            </code>{' '}
            file in your working directory.
          </p>
          <div className="rounded-xl border-2 border-zinc-700 bg-zinc-900 p-6">
            <div className="space-y-4">
              <div>
                <code className="text-electric-yellow font-mono text-sm">
                  PENDEK_API_URL
                </code>
                <p className="mt-1 text-sm text-zinc-500">
                  API server URL. Defaults to{' '}
                  <code className="text-zinc-400">http://localhost:8080</code>
                </p>
              </div>
              <div>
                <code className="text-electric-yellow font-mono text-sm">
                  PENDEK_APP_URL
                </code>
                <p className="mt-1 text-sm text-zinc-500">
                  App URL used for short link display. Defaults to{' '}
                  <code className="text-zinc-400">http://localhost:3000</code>
                </p>
              </div>
              <div>
                <code className="text-electric-yellow font-mono text-sm">
                  PENDEK_CONFIG_DIR
                </code>
                <p className="mt-1 text-sm text-zinc-500">
                  Custom config directory. Defaults to{' '}
                  <code className="text-zinc-400">~/.config/pendek-in/</code>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-3 text-sm text-zinc-400">
              Example{' '}
              <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-400">
                .env
              </code>{' '}
              file:
            </p>
            <CodeBlock>
              PENDEK_API_URL=https://api.pendek.in{'\n'}
              PENDEK_APP_URL=https://pendek.in
            </CodeBlock>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t-2 border-zinc-800 py-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="bg-electric-yellow flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700">
                <Scissors className="text-charcoal h-4 w-4" />
              </div>
              <span className="font-bold text-white uppercase">Pendek In</span>
            </div>

            <div className="flex items-center gap-6 text-sm text-zinc-500">
              <Link href="/" className="link-underline hover:text-white">
                Home
              </Link>
              <span className="text-zinc-700">|</span>
              <span>&copy; {new Date().getFullYear()} Pendek In</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
