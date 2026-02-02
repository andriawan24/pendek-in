'use client';

import { motion } from 'motion/react';
import { BentoCard } from '@/components/ui/bento-card';
import { Globe } from 'lucide-react';
import type { CountryData } from '@/lib/analytics';
import { capitalizeTitle } from '@/lib/utils';

interface GeographicDataProps {
  data: CountryData[];
}

const countryFlags: Record<string, string> = {
  US: '\uD83C\uDDFA\uD83C\uDDF8',
  GB: '\uD83C\uDDEC\uD83C\uDDE7',
  DE: '\uD83C\uDDE9\uD83C\uDDEA',
  FR: '\uD83C\uDDEB\uD83C\uDDF7',
  CA: '\uD83C\uDDE8\uD83C\uDDE6',
  AU: '\uD83C\uDDE6\uD83C\uDDFA',
  NL: '\uD83C\uDDF3\uD83C\uDDF1',
  JP: '\uD83C\uDDEF\uD83C\uDDF5',
};

export function GeographicData({ data }: GeographicDataProps) {
  const topCountries = data.slice(0, 5);

  return (
    <BentoCard title="Top Countries" icon={<Globe className="h-4 w-4" />}>
      <div className="space-y-3">
        {topCountries.map((country, index) => (
          <motion.div
            key={country.code}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between rounded-xl border-2 border-zinc-700 bg-zinc-800/50 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">
                {countryFlags[country.code] || '\uD83C\uDFF3\uFE0F'}
              </span>
              <span className="font-medium text-white">
                {capitalizeTitle(country.name)}
              </span>
            </div>
            <div className="text-right">
              <p className="font-bold text-white">
                {country.clicks.toLocaleString()}
              </p>
              <p className="text-xs text-zinc-400">{country.percentage}%</p>
            </div>
          </motion.div>
        ))}
      </div>
    </BentoCard>
  );
}
