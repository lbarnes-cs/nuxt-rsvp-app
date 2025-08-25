import { getSafeSupabaseClient } from '@/utils/getSafeSupabaseClient';
import { ServerErrorEnums } from '@/types/apiErrors';

export default defineEventHandler(async () => {
  const supabase = await getSafeSupabaseClient();

  const { data, error } = await supabase.rpc('get_arrival_departure_by_dates');

  if (error) {
    throw createError({
      statusCode: 404,
      statusMessage: ServerErrorEnums.GUEST_NOT_FOUND,
      message: 'Get guests by arrival and depaturee dates not found',
    });
  }

  return data;
});
