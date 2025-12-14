'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BentoCard } from '@/components/ui/bento-card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Download, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

export function DangerZoneSection() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const exportData = () => {
    toast.success('Data export started! You will receive an email shortly.');
  };

  const handleDelete = () => {
    toast.success('Account deletion request submitted.');
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <BentoCard
        title="Danger Zone"
        icon={<AlertTriangle className="h-4 w-4" />}
        className="border-salmon/50"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-white">Export Data</p>
              <p className="text-sm text-zinc-500">
                Download all your links and analytics
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={exportData}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>

          <div className="border-t border-zinc-700 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-salmon font-medium">Delete Account</p>
                <p className="text-sm text-zinc-500">
                  Permanently delete your account and all data
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
          </div>
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
                    Delete Account
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
                Are you sure you want to delete your account? This action cannot
                be undone. All your links, analytics data, and settings will be
                permanently removed.
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
                  onClick={handleDelete}
                >
                  Delete Account
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
