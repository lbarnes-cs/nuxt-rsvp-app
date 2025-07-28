import { getSupabaseClient } from '@/utils/supabase';
import { defineEventHandler, getRouterParam, readBody } from 'h3';
import type { PostgrestError as _PostgrestError } from '@supabase/supabase-js';

import type { InviteType } from '@/types/invite';

export default defineEventHandler(async (event) => {
  const client = await getSupabaseClient();
  const inviteId = getRouterParam(event, 'inviteId');

  if (!inviteId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invite ID is required',
    });
  }

  // Read the request body
  const body: Partial<InviteType> = await readBody(event);

  try {
    // Step 1: Delete guests in one query
    if (body?.guests?.length) {
      const guestIds = body.guests.map((guest) => guest.id);

      const { error: guestError } = await client
        .from('guests')
        .delete()
        .in('id', guestIds);

      if (guestError) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Bad Reuqest: Failed to delete guests',
          data: JSON.stringify(guestError),
        });
      }
    }
  } catch (err: _PostgrestError | unknown) {
    throw createError({
      statusCode: 500,
      statusMessage: 'An error occurred whilst deleting guests',
      data: JSON.stringify(err),
    });
  }

  try {
    // Step 2: Delete the invite
    const { error: inviteError } = await client
      .from('invites')
      .delete()
      .eq('id', inviteId);

    if (inviteError) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to delete invite',
        data: JSON.stringify(inviteError),
      });
    }

    return { message: 'Invite and guests deleted successfully' };
  } catch (err: _PostgrestError | unknown) {
    throw createError({
      statusCode: 500,
      statusMessage: 'An error occurred whilst deleting invite',
      data: JSON.stringify(err),
    });
  }
});
