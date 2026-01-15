'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BentoCard } from '@/components/ui/bento-card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useAuth } from '@/lib/auth';

const SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? 'support@pendek.in';

export function DangerZoneSection() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { user } = useAuth();

  const handleRequestDeletion = () => {
    const subject = encodeURIComponent('Account Deletion Request');
    const body = encodeURIComponent(
      `Hi,\n\nI would like to request the deletion of my account.\n\nAccount email: ${user?.email ?? 'N/A'}\nAccount ID: ${user?.id ?? 'N/A'}\n\nPlease confirm this action.\n\nThank you.`
    );
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <BentoCard
        title="Danger Zone"
        icon={<AlertTriangle className="h-4 w-4" />}
        className="border-salmon/50"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-salmon font-medium">Delete Account</p>
            <p className="text-sm text-zinc-500">
              Request permanent deletion of your account and all data
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-salmon text-salmon hover:bg-salmon/10"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </BentoCard>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-black/80 p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="border-salmon/50 shadow-neo-lg w-full max-w-md cursor-auto rounded-2xl border-2 bg-zinc-900 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-salmon/20 rounded-lg p-2">
                    <AlertTriangle className="text-salmon h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-bold tracking-wide text-white uppercase">
                    Request Deletion
                  </h2>
                </div>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="mt-4 text-zinc-400">
                Are you sure you want to request account deletion? This will
                open your email client to send a deletion request to our support
                team. Once processed, all your links, analytics data, and
                settings will be permanently removed.
              </p>

              <div className="mt-6 flex gap-3">
                <Button
                  variant="ghost"
                  className="flex-1"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="secondary"
                  className="bg-salmon hover:bg-salmon/90 flex-1 text-white"
                  onClick={handleRequestDeletion}
                >
                  Request Deletion
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
