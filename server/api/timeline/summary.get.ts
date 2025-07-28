import { getSupabaseClient } from '@/utils/supabase';

export default defineEventHandler(async () => {
  const supabase = await getSupabaseClient();

  const { data, error } = await supabase.rpc('get_guests_by_dates');

  if (error) {
    throw createError({
      statusCode: 404,
      message: 'Get guests by dates (timeline summary) not found',
    });
  }

  return {
    data,
  };
});
