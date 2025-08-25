import type { PostgrestError as _PostgrestError } from '@supabase/supabase-js';
import { getSafeSupabaseClient } from '@/utils/getSafeSupabaseClient';

import type { InviteType } from '@/types/invite';
import { ServerErrorEnums } from '@/types/apiErrors';

export default defineEventHandler(async (event) => {
  const supabase = await getSafeSupabaseClient();

  const { inviteId } = event.context.params ?? {};

  const body: InviteType = await readBody(event);

  // Ensure we have an invite ID before we move forward
  if (!inviteId || inviteId.trim() === '') {
    throw createError({
      statusCode: 400,
      statusMessage: ServerErrorEnums.MISSING_INVITE_ID,
      message: 'Invite ID is required and cannot be empty',
    });
  }

  const { error: inviteError } = await supabase
    .from('invites')
    .update({
      additional_notes: null,
      arrival_date: null,
      departure_date: null,
      first_replied: null,
      update_timestamp: null,
      is_arriving_by_train: false,
    })
    .eq('id', inviteId)
    .single();

  if (inviteError) {
    console.error('Error resetting guest:', {
      message: inviteError,
      body,
    });

    throw createError({
      statusCode: 500,
      statusMessage: ServerErrorEnums.INVITE_SAVE_FAILED,
      message: 'Error resetting Invite information',
    });
  }

  // Update guests information
  for (const guest of body.guests) {
    try {
      const { error: guestUpdateError } = await supabase
        .from('guests')
        .update({
          is_attending: false,
        })
        .eq('invite_id', inviteId) // Use invite_id (UUID) to update the guest's details
        .eq('id', guest.id); // No need for matching the guest's ID with inviteId

      if (guestUpdateError) {
        throw guestUpdateError; // This will be caught in the catch block
      }
    } catch (err: _PostgrestError | unknown) {
      console.error('Error resetting guest:', {
        message: err,
        guest,
      });

      throw createError({
        statusCode: 500,
        statusMessage: ServerErrorEnums.GUEST_SAVE_FAILED,
        message: `Error resetting guest information for guest ${guest.id}`,
        data: JSON.stringify(err),
      });
    }
  }

  return true;
});
