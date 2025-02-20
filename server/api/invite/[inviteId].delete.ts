import { getSupabaseClient } from "@/utils/supabase";
import { defineEventHandler, getRouterParam, readBody } from "h3";
import { PostgrestError } from "@supabase/supabase-js";

import { InviteType } from "@/types/invite";

export default defineEventHandler(async (event) => {
  const client = await getSupabaseClient();
  const inviteId = getRouterParam(event, "inviteId");

  if (!inviteId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invite ID is required",
    });
  }

  // Read the request body
  const body: Partial<InviteType> = await readBody(event);

  try {
    // Step 1: Delete guests in one query
    if (body?.guests?.length) {
      const guestIds = body.guests.map((guest) => guest.id);
      const { error: guestError } = await client
        .from("guests")
        .delete()
        .in("id", guestIds);

      if (guestError) {
        throw createError({
          statusCode: 500,
          statusMessage: "Failed to delete guests",
        });
      }
    }

    // Step 2: Delete the invite
    const { error: inviteError } = await client
      .from("invites")
      .delete()
      .eq("id", inviteId);

    if (inviteError) {
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to delete invite",
      });
    }

    return { message: "Invite and guests deleted successfully" };
  } catch (err: unknown | PostgrestError) {
    throw createError({
      statusCode: 500,
      statusMessage: "An error occurred",
      data: JSON.stringify(err),
    });
  }
});
