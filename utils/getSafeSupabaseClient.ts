import { createError } from 'h3';
import type { SupabaseClient } from '@supabase/supabase-js';

import { getSupabaseClient } from '@/utils/supabase';
import { SupabaseErrorEnums } from '@/types/apiErrors';

export async function getSafeSupabaseClient(): Promise<SupabaseClient> {
  const { client, error } = await getSupabaseClient();

  if (error) throw error;

  if (!client) {
    throw createError({
      statusCode: 500,
      statusMessage: SupabaseErrorEnums.SUPABASE,
      message: 'Supabase client is not available',
    });
  }

  return client;
}
