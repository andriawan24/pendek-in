'use client';

import { useEffect, useEffectEvent, useState, useRef } from 'react';
import Image from 'next/image';
import { BentoCard } from '@/components/ui/bento-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User, Check, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import { config } from '@/lib/config';
import { motion, AnimatePresence } from 'motion/react';

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function ProfileSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | undefined>(
    undefined
  );
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, updateProfile, resendVerification } = useAuth();

  const setupProfile = useEffectEvent(() => {
    setName(user?.name ?? '');
    setEmail(user?.email ?? '');
    setIsVerified(user?.is_verified === true);
    if (user?.profile_image_url) {
      const profileImageUrl = user.profile_image_url;
      if (profileImageUrl.startsWith('http')) {
        setProfileImageUrl(profileImageUrl);
      } else {
        setProfileImageUrl(config.apiBaseUrl + profileImageUrl);
      }
    }
    setIsLoading(false);
  });

  useEffect(() => {
    setupProfile();
  }, [user]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error('Please select a valid image file (JPG, PNG, or GIF)');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setSelectedImage(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleImageUpload = async () => {
    if (!selectedImage) return;

    setIsUploadingImage(true);
    try {
      await updateProfile({ profileImage: selectedImage });
      toast.success('Profile image updated!');
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to update profile image'
      );
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleResendVerification = async () => {
    setIsResending(true);
    setResendSuccess(false);
    try {
      await resendVerification();
      setResendSuccess(true);
      toast.success('Verification email sent! Check your inbox.');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to send verification email'
      );
    } finally {
      setIsResending(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile({ name: name.trim() });
      toast.success('Profile updated!');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update profile'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <BentoCard title="Profile" icon={<User className="h-4 w-4" />}>
      {isLoading ? (
        <div className="animate-pulse space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-zinc-800" />
            <div className="h-8 w-32 rounded bg-zinc-800" />
          </div>
          <div className="h-12 w-full rounded-xl bg-zinc-800" />
          <div className="h-12 w-full rounded-xl bg-zinc-800" />
          <div className="h-10 w-32 rounded-xl bg-zinc-800" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-zinc-800">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Profile preview"
                  fill
                  className="object-cover"
                />
              ) : profileImageUrl && profileImageUrl != '' ? (
                <Image
                  src={profileImageUrl}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              ) : (
                <User className="h-8 w-8 text-zinc-500" />
              )}
            </div>

            <div className="flex flex-col gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept={ALLOWED_IMAGE_TYPES.join(',')}
                onChange={handleImageSelect}
                className="hidden"
              />
              {selectedImage ? (
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleImageUpload}
                    isLoading={isUploadingImage}
                  >
                    Upload
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview(null);
                    }}
                    disabled={isUploadingImage}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change Avatar
                </Button>
              )}
            </div>
          </div>

          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-400">
              Email
            </label>
            <div className="flex items-center gap-2">
              <span className="text-white">{email}</span>
              {isVerified && (
                <span className="flex items-center gap-1 text-xs text-green-500">
                  <Check className="h-3 w-3" /> Verified
                </span>
              )}
            </div>

            <AnimatePresence>
              {!isVerified && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="border-electric-yellow/20 bg-electric-yellow/5 mt-2 rounded-xl border-2 p-3">
                    <div className="flex items-start gap-3">
                      <Mail className="text-electric-yellow mt-0.5 h-4 w-4 shrink-0" />
                      <div className="flex-1 space-y-2">
                        <p className="text-sm text-zinc-300">
                          Your email is not verified. Verify your email to
                          access all features.
                        </p>
                        {resendSuccess ? (
                          <p className="flex items-center gap-1 text-xs text-green-400">
                            <Check className="h-3 w-3" />
                            Verification email sent! Check your inbox.
                          </p>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleResendVerification}
                            isLoading={isResending}
                          >
                            Resend verification email
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Button onClick={handleSave} isLoading={isSaving}>
            Save Changes
          </Button>
        </div>
      )}
    </BentoCard>
  );
}
