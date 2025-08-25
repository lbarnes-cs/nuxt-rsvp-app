import { getSafeSupabaseClient } from '@/utils/getSafeSupabaseClient';
import type { PostgrestError as _PostgrestError } from '@supabase/supabase-js';
import { defineEventHandler, getRouterParam, readBody } from 'h3';

import type { InviteType } from '@/types/invite';
import { ServerErrorEnums } from '@/types/apiErrors';

export default defineEventHandler(async (event) => {
  const supabase = await getSafeSupabaseClient();

  const inviteId = getRouterParam(event, 'inviteId');

  if (!inviteId) {
    throw createError({
      statusCode: 400,
      message: 'Invite ID is required',
      statusMessage: ServerErrorEnums.MISSING_INVITE_ID,
    });
  }

  // Read the request body
  const body: Partial<InviteType> = await readBody(event);

  try {
    // Step 1: Delete guests in one query
    if (body?.guests?.length) {
      const guestIds = body.guests.map((guest) => guest.id);

      const { error: guestError } = await supabase
        .from('guests')
        .delete()
        .in('id', guestIds);

      if (guestError) {
        throw createError({
          statusCode: 400,
          message: 'Bad Reuqest: Failed to delete guests',
          statusMessage: ServerErrorEnums.GUEST_DELETE_FAILED,
          data: JSON.stringify(guestError),
        });
      }
    }
  } catch (err: _PostgrestError | unknown) {
    throw createError({
      statusCode: 500,
      message: 'An error occurred whilst deleting guests',
      statusMessage: ServerErrorEnums.GUEST_DELETE_FAILED,
      data: JSON.stringify(err),
    });
  }

  try {
    // Step 2: Delete the invite
    const { error: inviteError } = await supabase
      .from('invites')
      .delete()
      .eq('id', inviteId);

    if (inviteError) {
      throw createError({
        statusCode: 500,
        statusMessage: ServerErrorEnums.INVITE_DELETE_FAILED,
        message: 'Failed to delete invite',
        data: JSON.stringify(inviteError),
      });
    }

    return { message: 'Invite and guests deleted successfully' };
  } catch (err: _PostgrestError | unknown) {
    throw createError({
      statusCode: 500,
      statusMessage: ServerErrorEnums.INTERNAL_SERVER_ERROR,
      message: 'An error occurred whilst deleting invite',
      data: JSON.stringify(err),
    });
  }
});
