'use client';

import { useState, useEffect, useEffectEvent } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { useAuth } from '@/lib/auth';
import {
  ArrowRight,
  BarChart3,
  Globe,
  Link2,
  MousePointer2,
  QrCode,
  Scissors,
  Shield,
  Smartphone,
  Terminal,
  Zap,
} from 'lucide-react';
import StatItem from '@/components/landing/stat-item';
import FeatureCard from '@/components/landing/feature-card';
import {
  GlobeVisual,
  MiniChartVisual,
  QRCodeVisual,
} from '@/components/landing/visual';
import { TerminalStep } from '@/components/landing/terminal-step';
import { LandingNavbar } from '@/components/landing/navbar';
import { getLandingStats, type LandingStats } from '@/lib/analytics';

export default function LandingPage() {
  const [isAuth, setIsAuth] = useState(false);
  const [stats, setStats] = useState<LandingStats>({
    totalLinks: 0,
    totalActiveUsers: 0,
    totalClicks: 0,
  });
  const { isAuthenticated } = useAuth();

  const setupAuth = useEffectEvent(() => {
    setIsAuth(isAuthenticated);
  });

  useEffect(() => {
    setupAuth();
  }, [isAuthenticated]);

  useEffect(() => {
    async function fetchStats() {
      const data = await getLandingStats();
      setStats(data);
    }
    fetchStats();
  }, []);

  return (
    <div className="bg-charcoal relative min-h-screen overflow-hidden">
      <div className="grain-overlay" />

      <div className="pointer-events-none absolute inset-0">
        <div className="bg-electric-yellow/5 absolute -top-40 -right-40 h-80 w-80 rounded-full blur-3xl" />
        <div className="bg-cyan/5 absolute top-1/3 -left-40 h-80 w-80 rounded-full blur-3xl" />
        <div className="bg-hot-pink/5 absolute right-1/4 -bottom-40 h-80 w-80 rounded-full blur-3xl" />
      </div>

      <div className="grid-pattern pointer-events-none absolute inset-0 opacity-30" />

      <div className="relative mx-auto max-w-6xl px-4">
        <LandingNavbar isAuth={isAuth} />

        {/* Hero Section */}
        <section className="py-24 md:py-36">
          <div className="mx-auto max-w-3xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl leading-[1.1] font-bold tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              Links that work
              <br />
              <span className="text-electric-yellow">as hard as you do</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mx-auto mt-6 max-w-xl text-base text-zinc-400 sm:text-base"
            >
              A link shortener built for developers and creators. Shorten URLs,
              track clicks in real-time, and generate QR codes.
            </motion.p>

            {/* Live URL Shortener Demo */}
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mx-auto mt-10 max-w-xl"
            >
              <URLShortenerDemo />
            </motion.div> */}

            {/* Stats ticker */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12 flex flex-wrap items-center justify-center gap-8 border-y border-zinc-800 py-6 sm:gap-12"
            >
              <StatItem value={stats.totalLinks} label="Links created" />
              <StatItem value={stats.totalActiveUsers} label="Active users" />
              <StatItem value={stats.totalClicks} label="Total link clicked" />
            </motion.div>
          </div>
        </section>

        {/* Dashboard Preview */}
        <section className="py-8 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              See what you&apos;re getting
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-zinc-400">
              A powerful dashboard that puts you in control. Track every click,
              every device, every location.
            </p>
          </motion.div>

          {/* Bento Grid Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mt-12"
          >
            <div className="shadow-neo-xl rounded-3xl border-2 border-zinc-700 bg-zinc-900 p-4 sm:p-6">
              {/* Mock dashboard header */}
              <div className="mb-6 flex items-center justify-between rounded-xl border border-zinc-700 bg-zinc-800 p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-electric-yellow h-8 w-8 rounded-lg" />
                  <div>
                    <div className="h-3 w-24 rounded bg-zinc-600" />
                    <div className="mt-1.5 h-2 w-16 rounded bg-zinc-700" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-20 rounded-lg border border-zinc-600 bg-zinc-700" />
                  <div className="bg-electric-yellow h-8 w-24 rounded-lg" />
                </div>
              </div>

              {/* Bento grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Large stats card */}
                <div className="shadow-neo-sm rounded-2xl border-2 border-zinc-700 bg-zinc-800 p-5 sm:col-span-2 lg:col-span-1 lg:row-span-2">
                  <div className="mb-4 flex items-center gap-2 text-xs text-zinc-500 uppercase">
                    <BarChart3 className="h-4 w-4" />
                    <span>Total Clicks</span>
                  </div>
                  <div className="text-electric-yellow text-5xl font-bold">
                    24.7K
                  </div>
                  <div className="mt-1 text-sm text-green-400">
                    +12.5% from last week
                  </div>
                  <div className="mt-6 h-32">
                    <MiniChartVisual />
                  </div>
                </div>

                {/* Device breakdown */}
                <div className="shadow-neo-sm rounded-2xl border-2 border-zinc-700 bg-zinc-800 p-5">
                  <div className="mb-4 flex items-center gap-2 text-xs text-zinc-500 uppercase">
                    <Smartphone className="h-4 w-4" />
                    <span>Devices</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-300">Mobile</span>
                      <div className="flex items-center gap-2">
                        <div className="bg-electric-yellow h-2 w-24 rounded-full" />
                        <span className="text-sm text-zinc-400">64%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-300">Desktop</span>
                      <div className="flex items-center gap-2">
                        <div className="bg-cyan h-2 w-14 rounded-full" />
                        <span className="text-sm text-zinc-400">28%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-300">Tablet</span>
                      <div className="flex items-center gap-2">
                        <div className="bg-hot-pink h-2 w-6 rounded-full" />
                        <span className="text-sm text-zinc-400">8%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent clicks */}
                <div className="shadow-neo-sm rounded-2xl border-2 border-zinc-700 bg-zinc-800 p-5">
                  <div className="mb-4 flex items-center gap-2 text-xs text-zinc-500 uppercase">
                    <MousePointer2 className="h-4 w-4" />
                    <span>Recent Clicks</span>
                  </div>
                  <div className="space-y-2">
                    {['US', 'UK', 'DE', 'JP'].map((country, i) => (
                      <div
                        key={country}
                        className="flex items-center justify-between rounded-lg bg-zinc-700/50 px-3 py-2 text-sm"
                      >
                        <span className="text-zinc-300">{country}</span>
                        <span className="text-zinc-500">{i + 1}s ago</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* QR Code preview */}
                <div className="shadow-neo-sm rounded-2xl border-2 border-zinc-700 bg-zinc-800 p-5 sm:col-span-2 lg:col-span-1">
                  <div className="mb-4 flex items-center gap-2 text-xs text-zinc-500 uppercase">
                    <QrCode className="h-4 w-4" />
                    <span>QR Code</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="grid grid-cols-5 gap-1 rounded-xl bg-white p-4">
                      {Array.from({ length: 25 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-4 w-4 ${
                            [
                              0, 1, 2, 4, 5, 6, 10, 12, 14, 18, 19, 20, 22, 23,
                              24,
                            ].includes(i)
                              ? 'bg-charcoal'
                              : 'bg-white'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating labels */}
              <div className="absolute -top-3 left-8 rounded-full border border-zinc-600 bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
                Live preview
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-8 md:py-20">
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-white sm:text-4xl"
            >
              Everything you need
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mx-auto mt-4 max-w-lg text-zinc-400"
            >
              Powerful features wrapped in a brutalist interface that
              doesn&apos;t get in your way.
            </motion.p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={BarChart3}
              title="Real-time Analytics"
              description="Watch clicks happen live. See geographic distribution, devices, browsers, and referrers."
              visual={<MiniChartVisual />}
              delay={0}
            />
            <FeatureCard
              icon={QrCode}
              title="QR Code Generation"
              description="Every link gets a downloadable QR code. Perfect for print materials and presentations."
              visual={<QRCodeVisual />}
              delay={0.1}
            />
            <FeatureCard
              icon={Globe}
              title="Geographic Data"
              description="Know where your audience is. Track clicks by country, city, and region."
              visual={<GlobeVisual />}
              delay={0.2}
            />
          </div>

          {/* Secondary features */}
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Zap,
                title: 'Fast Redirects',
                desc: '<50ms response time',
              },
              {
                icon: Shield,
                title: 'Secure Links',
                desc: 'HTTPS everywhere',
              },
              {
                icon: Link2,
                title: 'Custom Slugs',
                desc: 'Brand your links',
              },
              { icon: Globe, title: 'API Access', desc: 'Build integrations' },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="shadow-neo-sm rounded-xl border-2 border-zinc-700 bg-zinc-900 p-4"
              >
                <feature.icon className="text-electric-yellow h-5 w-5" />
                <h4 className="mt-3 font-bold text-white">{feature.title}</h4>
                <p className="mt-1 text-sm text-zinc-500">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CLI CTA Section */}
        <section className="py-8 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="shadow-neo-xl relative overflow-hidden rounded-3xl border-2 border-zinc-700 bg-zinc-900 p-8 sm:p-12"
          >
            <div className="stripe-pattern pointer-events-none absolute inset-0 opacity-10" />

            <div className="relative flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:gap-12">
              <div className="flex-1 text-center lg:text-left">
                <div className="bg-electric-yellow/10 border-electric-yellow/30 mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
                  <Terminal className="text-electric-yellow h-4 w-4" />
                  <span className="text-electric-yellow font-medium">
                    New: CLI Tool
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-white sm:text-4xl">
                  Shorten links from
                  <br />
                  <span className="text-electric-yellow">your terminal</span>
                </h2>
                <p className="mt-4 max-w-md text-zinc-400">
                  A powerful CLI built with Go. Shorten URLs, manage links, and
                  view analytics without leaving your terminal.
                </p>
                <div className="mt-6">
                  <Link
                    href="/cli"
                    className="bg-electric-yellow text-charcoal shadow-neo-sm hover:shadow-neo-sm-hover inline-flex items-center gap-2 rounded-xl border-2 border-zinc-700 px-6 py-3 font-bold tracking-wide uppercase transition-all duration-100"
                  >
                    View CLI Docs
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="w-full max-w-md flex-1">
                <div className="rounded-xl border-2 border-zinc-700 bg-zinc-800 p-4">
                  <div className="mb-3 flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                  </div>
                  <div className="space-y-3 font-mono text-sm">
                    <div>
                      <span className="text-electric-yellow">$ </span>
                      <span className="text-zinc-300">
                        pendek shorten https://example.com
                      </span>
                    </div>
                    <div className="text-zinc-500">✓ pendek.in/x7k9m2</div>
                    <div className="border-t border-zinc-700 pt-3">
                      <span className="text-electric-yellow">$ </span>
                      <span className="text-zinc-300">pendek list</span>
                    </div>
                    <div className="text-zinc-500">✓ 3 links found</div>
                    <div className="border-t border-zinc-700 pt-3">
                      <span className="text-electric-yellow">$ </span>
                      <span className="text-zinc-300">
                        pendek stats --range 7d
                      </span>
                    </div>
                    <div className="text-zinc-500">
                      ✓ 1,247 clicks | 12 active links
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* How it works - Terminal style */}
        <section className="py-8 md:py-20">
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-white sm:text-4xl"
            >
              How it works
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mx-auto mt-4 max-w-lg text-zinc-400"
            >
              Three simple steps from your terminal.
            </motion.p>
          </div>

          <div className="mx-auto mt-12 grid max-w-3xl gap-6">
            <TerminalStep
              step={1}
              command="pendek shorten https://my-very-long-url.com/path"
              output="✓ URL shortened successfully!  →  pendek.in/x7k9m2"
              delay={0}
            />
            <TerminalStep
              step={2}
              command="pendek share x7k9m2"
              output="✓ Copied to clipboard: pendek.in/x7k9m2"
              delay={0.15}
            />
            <TerminalStep
              step={3}
              command="pendek stats --range 30d"
              output="✓ Analytics  2025-01-01 to 2025-01-30  |  1,247 clicks"
              delay={0.3}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-center"
          >
            <Link
              href="/cli"
              className="text-electric-yellow link-underline inline-flex items-center gap-1.5 text-sm font-medium"
            >
              View full CLI docs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </section>

        {/* CTA Section */}
        {!isAuth && (
          <section className="py-8 md:py-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="shadow-neo-xl relative overflow-hidden rounded-3xl border-2 border-zinc-700 bg-zinc-900 p-8 text-center sm:p-12"
            >
              {/* Background decoration */}
              <div className="stripe-pattern pointer-events-none absolute inset-0 opacity-20" />

              <h2 className="relative text-3xl font-bold text-white sm:text-4xl">
                Ready to get started?
              </h2>
              <p className="relative mx-auto mt-4 max-w-md text-zinc-400">
                Start for free. No credit card required.
              </p>

              <div className="relative mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/sign-in"
                  className="bg-electric-yellow text-charcoal shadow-neo-md hover:shadow-neo-md-hover btn-glow inline-flex items-center gap-2 rounded-xl border-2 border-zinc-700 px-8 py-4 font-bold tracking-wide uppercase transition-all duration-100"
                >
                  Create Free Account
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </motion.div>
          </section>
        )}

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
              <Link href="/cli" className="link-underline hover:text-white">
                CLI
              </Link>
              <span className="text-zinc-700">|</span>
              <Link
                href={isAuth ? '/dashboard' : '/sign-in'}
                className="link-underline hover:text-white"
              >
                {isAuth ? 'Dashboard' : 'Sign in'}
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
