import { getSafeSupabaseClient } from '@/utils/getSafeSupabaseClient';

import type { GuestType } from '@/types/guest';

export default defineEventHandler(async () => {
  const supabase = await getSafeSupabaseClient();

  // Use the base query to select guests
  const query = supabase
    .from('guests')
    .select('id, invite_id, is_attending, first_name, last_name');

  // Execute the query
  const { data: guestsData, error } = await query;

  // Handle any errors
  if (error) {
    console.error('Error fetching guests:', error);
    throw new Error('Unable to fetch guests');
  }

  // Map results to include the full_name field
  return (
    guestsData?.map((guest: GuestType) => ({
      ...guest,
      full_name: `${guest.first_name} ${guest.last_name}`,
    })) || []
  );
});
