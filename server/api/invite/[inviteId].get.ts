import { getSupabaseClient } from "@/utils/supabase";

export default defineEventHandler(async (event) => {
  const supabase = await getSupabaseClient();

  const { inviteId } = event.context.params ?? {};

  if (!inviteId || inviteId.trim() === "") {
    throw createError({
      statusCode: 400,
      message: "Invite ID is required and cannot be empty",
    });
  }

  const { data: inviteData, error: inviteError } = await supabase
    .from("invites")
    .select("*")
    .eq("id", inviteId)
    .single();

  if (inviteError) {
    console.error("Error fetching invite:", inviteError.message); // Add logging here
    throw createError({ statusCode: 404, message: "Invite not found" });
  }

  const { data: guestsData, error: guestError } = await supabase
    .from("guests")
    .select("*")
    .order("order", { ascending: true })
    .eq("invite_id", inviteId);

  if (guestError) {
    console.error("Error fetching guests:", guestError.message); // Add logging here
    throw createError({ statusCode: 404, message: "Guest not found" });
  }

  return { ...inviteData, guests: guestsData };
});
