import { computed } from "vue";

import type { GuestType } from "@/types/guest";

export function useFormatGuestNames(guests: GuestType[] | undefined) {
  const { t } = useI18n();

  // Helper function to return a guest's name or "guest" if the name is empty
  const getName = (guest: GuestType | undefined): string => {
    return guest?.first_name || t("rsvp.guest");
  };

  // Computed property for formatted guest names
  const formattedNames = computed(() => {
    if (!guests || guests.length === 0) {
      return null; // Return null if no guests
    }

    // Filter out any undefined guests
    const validGuests = guests.filter(Boolean);

    // If there is only one guest
    if (validGuests.length === 1) {
      return getName(validGuests[0]);
    }

    // Otherwise, handle multiple guests
    const names = validGuests.map(getName);
    const lastName = names.pop(); // Get the last name
    return `${names.join(", ")} ${t("and")} ${lastName}`;
  });

  return formattedNames;
}
