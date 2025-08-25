import { getSafeSupabaseClient } from '@/utils/getSafeSupabaseClient';
import { ServerErrorEnums } from '@/types/apiErrors';

export default defineEventHandler(async (event) => {
  const supabase = await getSafeSupabaseClient();

  const { inviteId } = event.context.params ?? {};

  if (!inviteId || inviteId.trim() === '') {
    // TODO: Add logging here, send errors to an external service
    console.error('Invite ID is missing or empty');

    throw createError({
      statusCode: 400,
      statusMessage: ServerErrorEnums.MISSING_INVITE_ID,
      message: 'Invite ID is required and cannot be empty',
    });
  }

  const { data: inviteData, error: inviteError } = await supabase
    .from('invites')
    .select('*')
    .eq('id', inviteId)
    .single();

  if (inviteError) {
    // TODO: Add logging here, send errors to an external service
    console.error('Error fetching invite:', inviteError.message);

    throw createError({
      statusCode: 404,
      statusMessage: ServerErrorEnums.INVITE_NOT_FOUND,
      message: 'We are unable to find your invite',
    });
  }

  const { data: guestsData, error: guestError } = await supabase
    .from('guests')
    .select('*')
    .order('order', { ascending: true })
    .eq('invite_id', inviteId);

  if (guestError) {
    // TODO: Add logging here, send errors to an external service
    console.error('Error fetching guests:', guestError.message);

    throw createError({
      statusCode: 404,
      statusMessage: ServerErrorEnums.GUEST_NOT_FOUND,
      message: 'We cannot found your guest',
    });
  }

  return { ...inviteData, guests: guestsData };
});
