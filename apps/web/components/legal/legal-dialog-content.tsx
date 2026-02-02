import { cn } from '@/lib/utils';

export function LegalDialogContent({
  updatedAt,
  sections,
}: {
  updatedAt: string;
  sections: ReadonlyArray<{
    heading: string;
    body: ReadonlyArray<string>;
  }>;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border-2 border-zinc-700 bg-zinc-800 p-4">
        <p className="text-sm text-zinc-300">
          <span className="font-bold text-white">Last updated:</span>{' '}
          {updatedAt}
        </p>
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <section key={section.heading} className="space-y-3">
            <h3 className="text-sm font-bold tracking-wide text-white uppercase">
              {section.heading}
            </h3>
            <div className="space-y-2">
              {section.body.map((p, idx) => (
                <p
                  key={`${section.heading}-${idx}`}
                  className={cn('text-sm leading-6 text-zinc-300')}
                >
                  {p}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
