'use client';

import { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { TERMS_AND_CONDITIONS_DRAFT } from '@/lib/legal/terms';
import { PRIVACY_POLICY_DRAFT } from '@/lib/legal/privacy';
import { LegalDialogContent } from '@/components/legal/legal-dialog-content';

function TextButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="hover:decoration-electric-yellow inline-flex items-center rounded-md px-1 font-bold text-white underline decoration-zinc-600 underline-offset-4"
    >
      {children}
    </button>
  );
}

export function LegalLinksLine() {
  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  return (
    <>
      <p className="text-xs text-zinc-500">
        By continuing, you agree to the
        <TextButton onClick={() => setTermsOpen(true)}>Terms</TextButton>
        and acknowledge the
        <TextButton onClick={() => setPrivacyOpen(true)}>
          Privacy Policy
        </TextButton>
        .
      </p>

      <Dialog
        open={termsOpen}
        onOpenChange={setTermsOpen}
        title={TERMS_AND_CONDITIONS_DRAFT.title}
        description="Please read these terms carefully."
      >
        <LegalDialogContent
          updatedAt={TERMS_AND_CONDITIONS_DRAFT.updatedAt}
          sections={TERMS_AND_CONDITIONS_DRAFT.sections}
        />
      </Dialog>

      <Dialog
        open={privacyOpen}
        onOpenChange={setPrivacyOpen}
        title={PRIVACY_POLICY_DRAFT.title}
        description="How we collect, use, and share information."
      >
        <LegalDialogContent
          updatedAt={PRIVACY_POLICY_DRAFT.updatedAt}
          sections={PRIVACY_POLICY_DRAFT.sections}
        />
      </Dialog>
    </>
  );
}
