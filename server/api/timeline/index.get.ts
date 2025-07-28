import { getSupabaseClient } from '@/utils/supabase';

export default defineEventHandler(async () => {
  const supabase = await getSupabaseClient();

  const { data, error } = await supabase.rpc('get_arrival_departure_by_dates');

  if (error) {
    throw createError({
      statusCode: 404,
      message: 'Get guests by arrival and depaturee dates not found',
    });
  }

  return data;
});
