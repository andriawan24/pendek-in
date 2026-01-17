import { SettingsHeader } from '@/components/settings/settings-header';
import { ProfileSection } from '@/components/settings/profile-section';
import { DangerZoneSection } from '@/components/settings/danger-zone-section';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <SettingsHeader />
      <ProfileSection />
      {/* <PreferencesSection />
      <ApiKeysSection /> */}
      <DangerZoneSection />
    </div>
  );
}
