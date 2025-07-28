import { getSupabaseClient } from '@/utils/supabase';

import type { InviteAdminType, InviteType } from '@/types/invite';
import type { GuestType } from '@/types/guest';

export default defineEventHandler(async () => {
  const supabase = await getSupabaseClient();

  const { data: allInvites, error: invitesError } = await supabase
    .from('invites')
    .select('*');

  if (invitesError) {
    console.error('Error fetching invites:', invitesError.message); // Add logging here
    throw createError({ statusCode: 404, message: 'Invites not found' });
  }

  const { data: allGuests } = await supabase
    .from('guests')
    .select('*')
    .order('order', { ascending: true });

  const invitesWithGuests: InviteAdminType[] = allInvites.map(
    (invite: InviteType) => {
      // Get all guests related to this invite
      const inviteGuests =
        allGuests?.filter(
          (guest: GuestType) => guest.invite_id === invite.id,
        ) || [];

      // Calculate guest count
      const guestCount = inviteGuests.length;

      // Calculate attending guest count (guests who are attending)
      const attendingGuestCount = inviteGuests.filter(
        (guest: GuestType) => guest.is_attending === true,
      ).length;

      // Check if any guest is attending
      const isAnyGuestAttending = attendingGuestCount > 0;

      // Check if the RSVP has been submitted
      const hasSubmittedRSVP = !!invite.first_replied;

      return {
        ...invite,
        guests: inviteGuests,
        guest_count: guestCount, // Add guestCount
        is_any_guest_attending: isAnyGuestAttending, // Add isAnyGuestAttending
        attending_guest_count: attendingGuestCount,
        has_submitted_rsvp: hasSubmittedRSVP,
      } as InviteAdminType;
    },
  );

  // Calculate the total number of attending guests across all invites
  const totalAttendingGuests: number = invitesWithGuests.reduce(
    (total, invite) => total + invite.attending_guest_count,
    0,
  );

  return {
    invitesWithGuests,
    totalAttendingGuests, // Add the total count of attending guests
  };
});
