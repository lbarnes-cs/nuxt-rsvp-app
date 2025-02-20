import { PostgrestError } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/utils/supabase";

import { InviteType } from "@/types/invite";

export default defineEventHandler(async (event) => {
  const supabase = await getSupabaseClient();

  const { inviteId } = event.context.params ?? {};

  const body: InviteType = await readBody(event);

  // Ensure we have an invite ID before we move forward
  if (!inviteId || inviteId.trim() === "") {
    throw createError({
      statusCode: 400,
      message: "Invite ID is required and cannot be empty",
    });
  }

  const { error: inviteError } = await supabase
    .from("invites")
    .update({
      additional_notes: body.additional_notes?.trim() || "",
      accommadation_arrival_date: body.accommadation_arrival_date,
      accommadation_leave_date: body.accommadation_leave_date,
      first_replied: body.first_replied,
      shared_photos_link: body.shared_photos_link,
    })
    .eq("id", inviteId)
    .single();

  if (inviteError) {
    console.error("Error updating guest:", {
      message: inviteError,
      body,
    });

    throw createError({
      statusCode: 500,
      message: "Error saving Invite information",
    });
  }

  // Update guests information
  for (const guest of body.guests) {
    try {
      const { error: guestUpdateError } = await supabase
        .from("guests")
        .update({
          first_name: guest.first_name?.trim(),
          last_name: guest.last_name?.trim(),
          is_attending: guest.is_attending,
        })
        .eq("invite_id", inviteId) // Use invite_id (UUID) to update the guest's details
        .eq("id", guest.id); // No need for matching the guest's ID with inviteId

      if (guestUpdateError) {
        throw guestUpdateError; // This will be caught in the catch block
      }
    } catch (err: unknown | PostgrestError) {
      console.error("Error updating guest:", {
        message: err,
        guest,
      });

      throw createError({
        statusCode: 500,
        message: `Error saving guest information for guest ${guest.id}`,
        statusMessage: JSON.stringify(err),
      });
    }
  }

  return true;
});
