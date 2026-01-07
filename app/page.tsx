'use client';

import { useState, useEffect, useRef, useEffectEvent } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'motion/react';
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
  Zap,
} from 'lucide-react';
import { URLShortenerDemo } from '@/components/landing/url-shortener-demo';
import { AnimatedCounter } from '@/components/landing/animated-counter';

function FeatureCard({
  icon: Icon,
  title,
  description,
  visual,
  delay = 0,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  visual: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="card-tilt shadow-neo-lg group rounded-2xl border-2 border-zinc-700 bg-zinc-900 p-6"
    >
      <div className="mb-4 h-40 overflow-hidden rounded-xl border-2 border-zinc-700 bg-zinc-800">
        {visual}
      </div>
      <div className="text-electric-yellow flex h-10 w-10 items-center justify-center rounded-xl border-2 border-zinc-700 bg-zinc-800 transition-transform group-hover:scale-110">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-lg font-bold text-white">{title}</h3>
      <p className="mt-2 text-sm text-zinc-400">{description}</p>
    </motion.div>
  );
}

function MiniChartVisual() {
  const bars = [40, 65, 45, 80, 55, 90, 70];

  return (
    <div className="flex h-full items-end justify-around gap-2 p-4">
      {bars.map((height, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          whileInView={{ height: `${height}%` }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          viewport={{ once: true }}
          className="bg-electric-yellow w-6 rounded-t"
        />
      ))}
    </div>
  );
}

function QRCodeVisual() {
  return (
    <div className="flex h-full items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        whileInView={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
        viewport={{ once: true }}
        className="grid grid-cols-5 gap-1"
      >
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className={`h-5 w-5 rounded-sm ${
              [0, 1, 2, 4, 5, 6, 10, 12, 14, 18, 19, 20, 22, 23, 24].includes(i)
                ? 'bg-electric-yellow'
                : 'bg-zinc-700'
            }`}
          />
        ))}
      </motion.div>
    </div>
  );
}

function GlobeVisual() {
  return (
    <div className="relative flex h-full items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="border-electric-yellow/30 relative h-24 w-24 rounded-full border-2"
      >
        <div className="border-electric-yellow/30 absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 border-t-2" />
        <div className="border-electric-yellow/30 absolute inset-x-4 top-1/4 h-12 rounded-full border-2" />
      </motion.div>
      {/* Ping markers */}
      <motion.div
        className="bg-electric-yellow absolute top-6 left-1/4 h-2 w-2 rounded-full"
        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.div
        className="bg-cyan absolute right-1/4 bottom-8 h-2 w-2 rounded-full"
        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
      />
      <motion.div
        className="bg-hot-pink absolute top-1/2 right-8 h-2 w-2 rounded-full"
        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
      />
    </div>
  );
}

function TerminalStep({
  step,
  command,
  output,
  delay,
}: {
  step: number;
  command: string;
  output: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="shadow-neo-md rounded-xl border-2 border-zinc-700 bg-zinc-900 p-4"
    >
      <div className="mb-3 flex items-center gap-2">
        <div className="bg-electric-yellow text-charcoal flex h-6 w-6 items-center justify-center rounded text-xs font-bold">
          {step}
        </div>
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
        </div>
      </div>
      <div className="font-mono text-sm">
        <div className="flex items-center gap-2">
          <span className="text-electric-yellow">$</span>
          <span className="text-zinc-300">{command}</span>
          <span className="animate-blink text-electric-yellow">▌</span>
        </div>
        <div className="mt-2 text-zinc-500">{output}</div>
      </div>
    </motion.div>
  );
}

function StatItem({
  value,
  label,
  suffix = '',
}: {
  value: number;
  label: string;
  suffix?: string;
}) {
  return (
    <div className="text-center">
      <div className="text-electric-yellow text-3xl font-bold sm:text-4xl">
        <AnimatedCounter target={value} suffix={suffix} />
      </div>
      <div className="mt-1 text-xs tracking-wider text-zinc-500 uppercase">
        {label}
      </div>
    </div>
  );
}

function LandingNavbar({ isAuth }: { isAuth: boolean }): React.ReactNode {
  return (
    <header className="flex h-20 items-center justify-between">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3"
      >
        <div className="bg-electric-yellow shadow-neo-sm flex h-11 w-11 items-center justify-center rounded-xl border-2 border-zinc-700">
          <Scissors className="text-charcoal h-5 w-5" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white uppercase">
          pendek-in
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3"
      >
        {isAuth ? (
          <Link
            href="/dashboard"
            className="bg-electric-yellow text-charcoal shadow-neo-sm hover:shadow-neo-sm-hover animate-pulse-glow inline-flex items-center gap-2 rounded-xl border-2 border-zinc-700 px-5 py-2.5 text-sm font-bold tracking-wide uppercase transition-all duration-100"
          >
            Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <>
            <Link
              href="/sign-in"
              className="link-underline hidden text-sm text-zinc-400 transition-colors hover:text-white sm:block"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="bg-electric-yellow text-charcoal shadow-neo-sm hover:shadow-neo-sm-hover animate-pulse-glow inline-flex items-center gap-2 rounded-xl border-2 border-zinc-700 px-5 py-2.5 text-sm font-bold tracking-wide uppercase transition-all duration-100"
            >
              Try NOw
              <ArrowRight className="h-4 w-4" />
            </Link>
          </>
        )}
      </motion.div>
    </header>
  );
}

export default function LandingPage() {
  const [isAuth, setIsAuth] = useState(false);
  const { isAuthenticated } = useAuth();

  const setupAuth = useEffectEvent(() => {
    setIsAuth(isAuthenticated);
  });

  useEffect(() => {
    setupAuth();
  }, [isAuthenticated]);

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
        <section className="py-8">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-800/50 px-4 py-2 text-xs text-zinc-400"
            >
              <span className="bg-electric-yellow h-1.5 w-1.5 animate-pulse rounded-full" />
              <span>New: Real-time analytics dashboard</span>
            </motion.div>

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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mx-auto mt-10 max-w-xl"
            >
              <URLShortenerDemo />
            </motion.div>

            {/* Stats ticker */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12 flex flex-wrap items-center justify-center gap-8 border-y border-zinc-800 py-6 sm:gap-12"
            >
              <StatItem value={1247893} label="Links created" />
              <StatItem value={47000} suffix="+" label="Active users" />
              <StatItem value={99} suffix="%" label="Uptime" />
            </motion.div>
          </div>
        </section>

        {/* Dashboard Preview */}
        <section className="py-20">
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
        <section className="py-20">
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

        {/* How it works - Terminal style */}
        <section className="py-20">
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
              Three simple steps to start tracking your links.
            </motion.p>
          </div>

          <div className="mx-auto mt-12 grid max-w-3xl gap-6">
            <TerminalStep
              step={1}
              command="pendek-in shorten https://my-very-long-url.com/path"
              output="→ pendek.in/x7k9m2"
              delay={0}
            />
            <TerminalStep
              step={2}
              command="pendek-in share x7k9m2"
              output="→ Link copied to clipboard"
              delay={0.15}
            />
            <TerminalStep
              step={3}
              command="pendek-in stats x7k9m2"
              output="→ 1,247 clicks | 32 countries | 89% mobile"
              delay={0.3}
            />
          </div>
        </section>

        {/* CTA Section */}
        {!isAuth && (
          <section className="py-20">
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
                Start for free. No credit card required. Upgrade anytime.
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

              <p className="relative mt-6 text-xs text-zinc-500">
                Join 47,000+ developers and creators
              </p>
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
              <span className="font-bold text-white uppercase">pendek-in</span>
            </div>

            <div className="flex items-center gap-6 text-sm text-zinc-500">
              <Link
                href={isAuth ? '/dashboard' : '/sign-in'}
                className="link-underline hover:text-white"
              >
                {isAuth ? 'Dashboard' : 'Sign in'}
              </Link>
              <span className="text-zinc-700">|</span>
              <span>&copy; {new Date().getFullYear()} pendek-in</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
