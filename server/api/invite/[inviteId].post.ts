import type { PostgrestError as _PostgrestError } from '@supabase/supabase-js';
import { getSafeSupabaseClient } from '@/utils/getSafeSupabaseClient';

import { ServerErrorEnums } from '@/types/apiErrors';
import type { InviteType } from '@/types/invite';

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
      additional_notes: body.additional_notes?.trim() || '',
      arrival_date: body.arrival_date,
      departure_date: body.departure_date,
      first_replied: body.first_replied,
      shared_photos_link: body.shared_photos_link,
      is_arriving_by_train: body.is_arriving_by_train,
    })
    .eq('id', inviteId)
    .single();

  if (inviteError) {
    console.error('Error updating guest:', {
      message: inviteError,
      body,
    });

    throw createError({
      statusCode: 500,
      statusMessage: ServerErrorEnums.INVITE_SAVE_FAILED,
      message: 'Error saving Invite information',
    });
  }

  // Update guests information
  for (const guest of body.guests) {
    try {
      const { error: guestUpdateError } = await supabase
        .from('guests')
        .update({
          first_name: guest.first_name?.trim(),
          last_name: guest.last_name?.trim(),
          is_attending: guest.is_attending,
        })
        .eq('invite_id', inviteId) // Use invite_id (UUID) to update the guest's details
        .eq('id', guest.id); // No need for matching the guest's ID with inviteId

      if (guestUpdateError) {
        throw guestUpdateError; // This will be caught in the catch block
      }
    } catch (err: _PostgrestError | unknown) {
      console.error('Error updating guest:', {
        message: err,
        guest,
      });

      throw createError({
        statusCode: 500,
        statusMessage: ServerErrorEnums.GUEST_SAVE_FAILED,
        message: `Error saving guest information for guest ${guest.id}`,
        data: JSON.stringify(err),
      });
    }
  }

  return true;
});
