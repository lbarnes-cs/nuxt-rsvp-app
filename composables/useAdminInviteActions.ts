import { ref, reactive } from 'vue';
import { useClipboard } from '@vueuse/core';
import { useSnackbar } from '@/composables/useSnackbar';

import type { InviteAdminType } from '@/types/invite';
import type { PostgrestError as _PostgrestError } from '@supabase/supabase-js';

export function useAdminInviteActions() {
  const { copy } = useClipboard();
  const { displaySnackbar } = useSnackbar();

  const localePath = useLocalePath();

  // Use to manage the invite in the dialog window
  const dialogInvite = ref<InviteAdminType | null>(null);

  const dialogs = reactive({
    reset: false,
    delete: false,
    manage: false,
  });

  const firstGuestName = computed(
    () => dialogInvite.value?.guests[0]?.first_name || 'N/A',
  );

  /**
   * Opens a specific dialog for an invite, and set the dialog invite
   * @param type The dialog type ('reset', 'delete', 'manage')
   * @param invite The invite related to the action
   */
  const openDialog = (type: keyof typeof dialogs, invite?: InviteAdminType) => {
    if (!invite && type !== 'manage') return;

    dialogInvite.value = invite || null;
    dialogs[type] = true;
  };

  /**
   * Closes a specific dialog, and reset dialog invite
   * @param type The dialog type ('reset', 'delete', 'create')
   */
  const closeDialog = (type: keyof typeof dialogs) => {
    dialogInvite.value = null;
    dialogs[type] = false;
  };

  /**
   * Copies the invite link to clipboard
   * @param invite The invite object
   */
  const copyRSVPUrl = (invite: InviteAdminType) => {
    if (import.meta.client && invite.id) {
      const currentUrl = window.location.origin;
      const path = localePath({ name: 'rsvp-id', params: { id: invite.id } });
      const url = `${currentUrl}${path}`;
      const guestName = invite.guests[0]?.first_name || 'N/A';

      copy(url);
      displaySnackbar({
        message: `Copied link to ${guestName}'s invite`,
        code: url,
        color: 'success',
      });
    }
  };

  /**
   * Resets the RSVP status for the invite
   */
  const resetRSVP = async () => {
    if (!dialogInvite.value || !dialogInvite.value.id) return;

    try {
      await $fetch(`/api/invite/reset/${dialogInvite.value.id}`, {
        method: 'POST',
        body: { ...dialogInvite.value },
      });

      displaySnackbar({
        message: `RSVP reset successfully for ${firstGuestName.value}!`,
        color: 'success',
      });
    } catch (error: _PostgrestError | unknown) {
      // TODO: Send error to Sentry
      displaySnackbar({
        message: 'Failed to reset RSVP',
        color: 'error',
        code: JSON.stringify(error),
      });
    }
  };

  /**
   * Delete the invite and any assigned guests
   */
  const deleteRSVP = async () => {
    if (!dialogInvite.value || !dialogInvite.value.id) return;

    try {
      await $fetch(`/api/invite/${dialogInvite.value.id}`, {
        method: 'DELETE',
        body: { ...dialogInvite.value },
      });

      displaySnackbar({
        message: `Successfully deleted invite and guests assigned to ${firstGuestName.value}!`,
        color: 'success',
      });
    } catch (error: _PostgrestError | unknown) {
      // TODO: Send error to Sentry

      const message = `
      <p class="text-subtitle-1 mb-2">Failed to delete invite.</p>
      <p class="mb-2">There seems to be an issue behind the scenes deleting the guest or invite.</p>
      <p>The best step here is to talk to the admins to investigate further. Sorry!</p>`;

      displaySnackbar({
        message,
        color: 'error',
        code: JSON.stringify(error),
      });
    }
  };

  return {
    dialogs,
    dialogInvite,
    firstGuestName,
    openDialog,
    closeDialog,
    copyRSVPUrl,
    resetRSVP,
    deleteRSVP,
  };
}
