import { ref } from "vue";
import { useClipboard } from "@vueuse/core";

import { useSnackbar } from "@/composables/useSnackbar";

import type { InviteAdminType } from "@/types/invite";

export function useAdminInviteActions() {
  const { copy } = useClipboard();
  const { displaySnackbar } = useSnackbar();

  const localePath = useLocalePath();

  const tempInvite = ref<InviteAdminType | null>(null);
  const displayResetDialog = ref<boolean>(false);

  /**
   * Copies the invite link to clipboard
   * @param inviteId The ID of the invite
   */
  const copyRSVPUrl = (invite: InviteAdminType) => {
    if (import.meta.client && invite.id) {
      const currentUrl = window.location.origin;

      const path = localePath({
        name: "rsvp-id",
        params: { id: invite.id },
      });

      const url = `${currentUrl}${path}`;
      const guestName = invite.guests[0].first_name || "N/A";

      copy(url);

      displaySnackbar({
        message: `Copied link to ${guestName}'s invite`,
        code: url,
        color: "success",
      });
    }
  };

  /**
   * Opens the reset dialog for an invite
   * @param invite The invite to reset
   */
  const confirmResetRSVP = (invite: InviteAdminType) => {
    tempInvite.value = invite;
    displayResetDialog.value = true;
  };

  /**
   * Closes the reset dialog
   */
  const closeConfirmDialog = () => {
    displayResetDialog.value = false;
  };

  /**
   * Resets the RSVP status for the invite
   */
  const resetRSVP = async () => {
    if (!tempInvite.value || !tempInvite.value.id) return;

    try {
      await $fetch(`/api/invite/reset/${tempInvite.value.id}`, {
        method: "POST",
        body: { ...tempInvite.value },
      });

      displayResetDialog.value = false;
      const guestName = tempInvite.value.guests[0].first_name || "N/A";

      displaySnackbar({
        message: `RSVP reset successfully for ${guestName}!`,
        color: "success",
      });
    } catch (error) {
      console.error("Failed to reset RSVP:", error);
      displaySnackbar({ message: "Failed to reset RSVP", color: "error" });
    }
  };

  return {
    copyRSVPUrl,
    confirmResetRSVP,
    closeConfirmDialog,
    resetRSVP,
    displayResetDialog,
  };
}
