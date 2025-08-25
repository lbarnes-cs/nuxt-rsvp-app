import { getSafeSupabaseClient } from '@/utils/getSafeSupabaseClient';

import type { InviteType } from '@/types/invite';
import { ServerErrorEnums } from '@/types/apiErrors';

export default defineEventHandler(async (event) => {
  const supabase = await getSafeSupabaseClient();

  const newInvite: InviteType = await readBody(event);
  const inviteId = newInvite.id;

  // Ensure we have an invite ID before we move forward
  if (!inviteId || inviteId.trim() === '') {
    throw createError({
      statusCode: 400,
      statusMessage: ServerErrorEnums.MISSING_INVITE_ID,
      message: 'Invite ID is required and cannot be empty',
    });
  }

  const { error: inviteError } = await supabase.from('invites').insert({
    id: newInvite.id?.trim(),
    additional_notes: newInvite.additional_notes?.trim() || '',
    arrival_date: newInvite.arrival_date,
    departure_date: newInvite.departure_date,
    shared_photos_link: newInvite.shared_photos_link?.trim(),
    created_at: new Date().toISOString(),
  });

  if (inviteError) {
    console.error('Error updating guest:', {
      message: inviteError,
      newInvite,
    });

    throw createError({
      statusCode: 500,
      statusMessage: ServerErrorEnums.INVITE_SAVE_FAILED,
      message: 'Error saving Invite information',
    });
  }

  await Promise.all(
    newInvite.guests.map(async (guest, index) => {
      const { error: guestUpdateError } = await supabase.from('guests').insert({
        invite_id: inviteId,
        first_name: guest.first_name?.trim(),
        last_name: guest.last_name?.trim(),
        is_attending: guest.is_attending || false,
        order: index,
      });

      if (guestUpdateError) {
        console.error('Error updating guest:', {
          message: guestUpdateError,
          guest,
        });

        throw createError({
          statusCode: 500,
          statusMessage: ServerErrorEnums.GUEST_SAVE_FAILED,
          message: `Error saving guest information for guest ${guest.id}`,
          data: JSON.stringify(guestUpdateError),
        });
      }
    }),
  );

  return true;
});
