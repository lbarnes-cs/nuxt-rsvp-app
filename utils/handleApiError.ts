import { createError } from '#app';
import type { NuxtError } from 'nuxt/app';
import type { H3Error } from 'h3';
import { SupabaseErrorEnums } from '@/types/apiErrors';

export function handleApiError(
  error: H3Error | NuxtError | undefined,
  { statusMessage, message }: { statusMessage: string; message: string },
) {
  // Try to get the message from error.data.message, fallback to error.message
  const errorMsg =
    (error?.data && typeof error.data === 'object' && 'message' in error.data
      ? (error.data as { message?: string }).message
      : undefined) ||
    error?.message ||
    message;

  // If errorType is present, show original message for admins
  if (
    error?.statusMessage &&
    Object.values(SupabaseErrorEnums).includes(
      error.statusMessage as SupabaseErrorEnums,
    )
  ) {
    console.log('API Error:', error?.message);
    // TypeScript now knows error is ApiError
    return createError({
      statusCode: error?.statusCode,
      statusMessage: error?.statusMessage,
      message: `<p>${errorMsg}</p> <p class="mt-4 font-italic">Message: ${error?.message || ''}</p>`,
    });
  }

  console.log('General Error:', error);
  // Otherwise, show default message

  // const nuxtError = createError({
  //   statusCode: inviteError.value.statusCode || 404,
  //   statusMessage: t('error-state.invite-get.title'),
  //   message: `<p>${t('error-state.invite-get.message')}</p><p class="mt-4 font-italic">Message: ${inviteError.value.message}</p>`,
  // });

  return createError({
    statusCode: error?.statusCode || 500,
    statusMessage,
    message: `<p>${message}</p> <p class="mt-4 font-italic">Message: ${error?.message}</p>`,
  });
}
