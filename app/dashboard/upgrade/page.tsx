'use client';

import type React from 'react';
import { motion } from 'motion/react';
import {
  Check,
  Crown,
  Sparkles,
  Zap,
  Infinity as InfinityIcon,
  QrCode,
  BarChart3,
  Shield,
  Link2,
  Users,
  Webhook,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type Plan = {
  key: 'free' | 'premium' | 'max';
  name: string;
  price: string;
  priceSuffix: string;
  description: string;
  badge?: string;
  accent: 'periwinkle' | 'electric-yellow' | 'salmon';
  cta: {
    label: string;
    variant: 'outline' | 'primary' | 'secondary';
  };
  features: Array<{
    icon: React.ComponentType<{ className?: string }>;
    label: string;
  }>;
};

const plans: Plan[] = [
  {
    key: 'free',
    name: 'Free',
    price: '$0',
    priceSuffix: '/month',
    description: 'Great for trying pendek-in and sharing a few links.',
    accent: 'periwinkle',
    cta: { label: 'Current Plan', variant: 'outline' },
    features: [
      { icon: Link2, label: '10 active links' },
      { icon: BarChart3, label: 'Basic analytics (7 days)' },
      { icon: QrCode, label: 'Standard QR codes' },
      { icon: Shield, label: 'Spam & abuse protection' },
    ],
  },
  {
    key: 'premium',
    name: 'Premium',
    price: '$9',
    priceSuffix: '/month',
    description: 'Unlock power features for creators and growing projects.',
    badge: 'Most Popular',
    accent: 'electric-yellow',
    cta: { label: 'Upgrade to Premium', variant: 'primary' },
    features: [
      { icon: InfinityIcon, label: 'Unlimited links' },
      { icon: QrCode, label: 'Custom QR codes' },
      { icon: BarChart3, label: 'Advanced analytics (90 days)' },
      { icon: Shield, label: 'Password + expiration for links' },
      { icon: Zap, label: 'Faster redirects (priority routing)' },
    ],
  },
  {
    key: 'max',
    name: 'Max',
    price: '$29',
    priceSuffix: '/month',
    description: 'For teams and automation. Everything unlocked, no limits.',
    badge: 'Best Value',
    accent: 'salmon',
    cta: { label: 'Upgrade to Max', variant: 'secondary' },
    features: [
      { icon: InfinityIcon, label: 'Unlimited links + bulk import' },
      { icon: Users, label: 'Team workspaces (up to 5 seats)' },
      { icon: Webhook, label: 'Webhooks + automations' },
      { icon: BarChart3, label: 'Full analytics history' },
      { icon: Shield, label: 'SLA + priority support' },
    ],
  },
];

function accentStyles(accent: Plan['accent']) {
  switch (accent) {
    case 'electric-yellow':
      return {
        iconBg: 'bg-electric-yellow text-charcoal',
        iconColor: 'text-electric-yellow',
        border: 'border-electric-yellow/40',
        glow: 'from-electric-yellow/20 via-transparent to-periwinkle/10',
        badge: 'bg-electric-yellow text-charcoal',
      };
    case 'salmon':
      return {
        iconBg: 'bg-salmon text-charcoal',
        iconColor: 'text-salmon',
        border: 'border-salmon/40',
        glow: 'from-salmon/20 via-transparent to-electric-yellow/10',
        badge: 'bg-salmon text-charcoal',
      };
    case 'periwinkle':
    default:
      return {
        iconBg: 'bg-periwinkle text-charcoal',
        iconColor: 'text-periwinkle',
        border: 'border-periwinkle/40',
        glow: 'from-periwinkle/20 via-transparent to-salmon/10',
        badge: 'bg-periwinkle text-charcoal',
      };
  }
}

export default function UpgradePage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-zinc-800 p-2">
            <Crown className="text-electric-yellow h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-wide text-white uppercase">
              Upgrade
            </h1>
            <p className="text-sm text-zinc-400">
              Choose a plan to unlock more features.
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-xl border-2 border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-zinc-400 sm:flex">
          <Sparkles className="text-periwinkle h-4 w-4" />
          Neo-brutalist pricing, no fluff.
        </div>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {plans.map((plan, index) => {
          const styles = accentStyles(plan.accent);
          const PlanIcon =
            plan.key === 'free'
              ? Sparkles
              : plan.key === 'premium'
                ? Zap
                : InfinityIcon;

          return (
            <motion.div
              key={plan.key}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                ease: 'easeOut',
                delay: index * 0.06,
              }}
              className={cn(
                'shadow-neo-md relative overflow-hidden rounded-2xl border-2 bg-zinc-900 p-6',
                'hover:shadow-neo-sm-hover transition-shadow',
                plan.key === 'premium'
                  ? cn('border-2', styles.border)
                  : 'border-zinc-700'
              )}
            >
              {/* Decorative gradient */}
              <div
                className={cn(
                  'pointer-events-none absolute inset-0 -z-10 opacity-60',
                  'bg-linear-to-br',
                  styles.glow
                )}
              />

              {/* Badge */}
              {plan.badge && (
                <div className="mb-4 flex justify-end">
                  <span
                    className={cn(
                      'inline-flex items-center rounded-full px-3 py-1',
                      'text-xs font-bold tracking-wide uppercase',
                      styles.badge
                    )}
                  >
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Title */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold tracking-wide text-white uppercase">
                    {plan.name}
                  </h2>
                  <p className="mt-1 text-sm text-zinc-400">
                    {plan.description}
                  </p>
                </div>

                <div className={cn('rounded-xl p-2', styles.iconBg)}>
                  <PlanIcon className="h-5 w-5" />
                </div>
              </div>

              {/* Price */}
              <div className="mt-5 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">
                  {plan.price}
                </span>
                <span className="text-sm text-zinc-400">
                  {plan.priceSuffix}
                </span>
              </div>

              {/* Features */}
              <div className="mt-6">
                <p className="text-xs font-bold tracking-wider text-zinc-400 uppercase">
                  Unlocked Features
                </p>
                <ul className="mt-3 space-y-2">
                  {plan.features.map((feature) => {
                    const Icon = feature.icon;
                    return (
                      <li
                        key={feature.label}
                        className="flex items-center gap-2 text-sm text-zinc-300"
                      >
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-zinc-800">
                          <Check className={cn('h-4 w-4', styles.iconColor)} />
                        </span>
                        <Icon className="h-4 w-4 text-zinc-500" />
                        <span>{feature.label}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* CTA */}
              <div className="mt-6">
                <Button
                  variant={plan.cta.variant}
                  size="md"
                  className="w-full"
                  disabled={plan.key === 'free'}
                >
                  {plan.key === 'free' ? (
                    <>
                      <Sparkles className="h-4 w-4" />
                      {plan.cta.label}
                    </>
                  ) : plan.key === 'premium' ? (
                    <>
                      <Zap className="h-4 w-4" />
                      {plan.cta.label}
                    </>
                  ) : (
                    <>
                      <InfinityIcon className="h-4 w-4" />
                      {plan.cta.label}
                    </>
                  )}
                </Button>
                <p className="mt-2 text-center text-xs text-zinc-500">
                  Payments are not wired yet — this is a UI-only screen.
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
