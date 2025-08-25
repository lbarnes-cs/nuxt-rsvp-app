import { getSafeSupabaseClient } from '@/utils/getSafeSupabaseClient';
import { ServerErrorEnums } from '@/types/apiErrors';

export default defineEventHandler(async () => {
  const supabase = await getSafeSupabaseClient();

  const { data, error } = await supabase.rpc('get_guests_by_dates');

  if (error) {
    throw createError({
      statusCode: 404,
      statusMessage: ServerErrorEnums.GUEST_NOT_FOUND,
      message: 'Get guests by dates (timeline summary) not found',
    });
  }

  return {
    data,
  };
});
