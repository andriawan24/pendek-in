# feat: Add "Get From Gravatar" button to profile image section

## Overview

Add a "Get From Gravatar" button next to the existing "Change Avatar" button in the profile settings page. When clicked, it fetches the user's Gravatar image using SHA-256 hash of their email, shows a preview, and lets them upload it through the existing profile image pipeline.

## Problem Statement

Users who have a Gravatar account must currently download their Gravatar image manually and re-upload it through the file picker. This adds unnecessary friction when their preferred avatar already exists on Gravatar.

## Proposed Solution

Add a single button that:

1. Hashes the user's email with SHA-256 (Gravatar's current standard)
2. Fetches the image from `https://gravatar.com/avatar/{hash}?s=256&d=404`
3. Shows a preview (reusing existing preview UI)
4. Lets the user click "Upload" to save (reusing existing upload pipeline)

**Zero new dependencies required** -- uses native Web Crypto API for SHA-256 and Fetch API for the image.

## Technical Approach

### File Changes

#### 1. `apps/web/components/settings/profile-section.tsx`

**New state:**

```tsx
const [isFetchingGravatar, setIsFetchingGravatar] = useState(false);
```

**New helper (inline or extracted):**

```tsx
async function sha256Hex(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
```

**New handler:**

```tsx
const handleGetFromGravatar = async () => {
  if (!email) {
    toast.error("No email address available");
    return;
  }

  setIsFetchingGravatar(true);
  try {
    const hash = await sha256Hex(email.trim().toLowerCase());
    const gravatarUrl = `https://gravatar.com/avatar/${hash}?s=256&d=404`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(gravatarUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error("No Gravatar found for this email address");
    }

    const blob = await response.blob();

    if (blob.size > MAX_FILE_SIZE) {
      throw new Error("Gravatar image exceeds 5MB limit");
    }

    const file = new File([blob], "gravatar.jpg", { type: blob.type });
    setSelectedImage(file);
    const previewUrl = URL.createObjectURL(blob);
    setImagePreview(previewUrl);
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      toast.error("Gravatar request timed out. Please try again.");
    } else {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to fetch Gravatar image",
      );
    }
  } finally {
    setIsFetchingGravatar(false);
  }
};
```

**UI change** -- Replace the single "Change Avatar" button (lines 200-206) with a flex row:

```tsx
<div className="flex gap-2">
  <Button
    variant="outline"
    size="sm"
    onClick={() => fileInputRef.current?.click()}
  >
    Change Avatar
  </Button>
  <Button
    variant="ghost"
    size="sm"
    onClick={handleGetFromGravatar}
    isLoading={isFetchingGravatar}
    disabled={!email || isUploadingImage}
  >
    Get From Gravatar
  </Button>
</div>
```

After clicking "Get From Gravatar", the existing Upload/Cancel buttons appear (same as when selecting a file), so the user confirms before saving.

#### 2. No other file changes needed

- **No `next.config.ts` change**: The Gravatar image is fetched as a blob and displayed via `URL.createObjectURL()`, not rendered directly via `next/image` with a Gravatar URL.
- **No backend changes**: The fetched image goes through the existing `updateProfile({ profileImage: file })` pipeline as a `File` (which extends `Blob`).
- **No new dependencies**: SHA-256 via `crypto.subtle`, image fetch via `fetch()`.

## Edge Cases Handled

| Scenario                               | Behavior                                                     |
| -------------------------------------- | ------------------------------------------------------------ |
| User has no email                      | Button disabled via `disabled={!email}`                      |
| No Gravatar exists (404)               | Toast: "No Gravatar found for this email address"            |
| Network failure                        | Toast: "Failed to fetch Gravatar image"                      |
| Request timeout (>10s)                 | AbortController cancels; toast: "Gravatar request timed out" |
| Image > 5MB                            | Toast: "Gravatar image exceeds 5MB limit"                    |
| File already selected, clicks Gravatar | Gravatar replaces the file preview silently                  |
| Upload in progress                     | "Get From Gravatar" button disabled                          |
| Clicks Gravatar, then cancels          | Existing Cancel button clears preview                        |

## Acceptance Criteria

- [ ] "Get From Gravatar" button appears next to "Change Avatar" when no image is selected
- [ ] Clicking it fetches the Gravatar using SHA-256 hash of the user's email
- [ ] On success: preview appears, Upload/Cancel buttons shown
- [ ] On 404: error toast "No Gravatar found for this email address"
- [ ] On network error/timeout: appropriate error toast
- [ ] Button shows loading spinner during fetch
- [ ] Button is disabled when email is missing or upload is in progress
- [ ] Uploaded Gravatar image persists correctly (same as file upload)

## References

- Gravatar Hash Docs (SHA-256): https://docs.gravatar.com/rest/hash/
- Gravatar Avatar Images: https://docs.gravatar.com/sdk/images/
- Web Crypto API: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
- Existing profile section: `apps/web/components/settings/profile-section.tsx`
- Auth provider (updateProfile): `apps/web/lib/auth/provider.tsx:82-85`
- Backend profile handler: `apps/backend/internal/routes/auth_routes.go:295-384`
