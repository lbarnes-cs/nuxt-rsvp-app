import { SupabaseErrorEnums } from '@/types/apiErrors';
import { SupabaseClient } from '@supabase/supabase-js';
import { createError, type H3Error } from 'h3';

type SupabaseClientResult = {
  client?: SupabaseClient;
  error?: H3Error;
};

const DB_PAUSED_MESSAGE =
  'Cannot connect to Supabase. Please check that the database is enabled.';

export const getSupabaseClient = async (): Promise<SupabaseClientResult> => {
  const config = useRuntimeConfig();
  const supabaseUrl = config.public.supabaseUrl;
  const supabaseKey = config.public.supabaseAnonKey;

  if (!supabaseUrl || !supabaseKey) {
    return {
      error: createError({
        statusCode: 500,
        message: 'Please add in the supabase config into your .env file',
        statusMessage: SupabaseErrorEnums.MISSING_CONFIG,
      }),
      client: undefined,
    };
  }

  const { createClient } = await import('@supabase/supabase-js');
  const client = createClient(supabaseUrl, supabaseKey);

  // Test the connection by making a simple query
  try {
    // Use the health check endpoint which is available in all Supabase projects
    // and doesn't require any special permissions
    const response = await fetch(
      `${supabaseUrl}/rest/v1/?apikey=${supabaseKey}`,
    );

    if (!response.ok) {
      // If we get an error status, the database might be paused
      if (response.status === 404 || response.status >= 500) {
        // TODO: Add logging here, send errors to an external service
        return {
          error: createError({
            statusCode: 503,
            message: DB_PAUSED_MESSAGE,
            statusMessage: SupabaseErrorEnums.DB_PAUSED,
          }),
          client: undefined,
        };
      }

      // TODO: Add logging here, send errors to an external service
      return {
        error: createError({
          statusCode:
            response.status >= 400 && response.status < 500 ? 400 : 500, // client or server error
          message: `Supabase error: ${response.statusText}`,
          statusMessage: SupabaseErrorEnums.SUPABASE,
        }),
        client: undefined,
      };
    }

    return { client, error: undefined };
  } catch (err) {
    // TODO: Add logging here, send errors to an external service
    return {
      error: createError({
        statusCode: 503,
        message: DB_PAUSED_MESSAGE,
        cause: err,
        statusMessage: SupabaseErrorEnums.DB_PAUSED,
      }),
      client: undefined,
    };
  }
};
