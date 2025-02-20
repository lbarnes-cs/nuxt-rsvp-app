import { ref } from "vue";

import { useDateFormatter } from "@/composables/useDateFormatter";

import type { GuestCreationType, GuestType } from "@/types/guest";
import type { InviteType, InviteCreationType } from "@/types/invite";

export function useInviteManagement() {
  const { formatDate } = useDateFormatter();

  const isSubmitting = ref<boolean>(false);

  const guestBootstrap: GuestCreationType = {
    first_name: null,
    last_name: null,
    is_attending: false,
  };

  // Initialize the invite for creation with guests as GuestCreationType[]
  const invite = ref<InviteCreationType | InviteType>({
    id: "", // empty id on creation
    shared_photos_link: null,
    accommadation_arrival_date: null,
    accommadation_leave_date: null,
    guests: [{ ...guestBootstrap }],
  });

  const isValid = ref(false);

  const isDraggable = computed(() => (invite.value?.guests?.length ?? 0) > 1);

  /**
   * Add new guest to list, using the bootstrap to ensure
   * that the default information is pre-filled
   */
  const addGuest = () => {
    requestAnimationFrame(() => {
      invite.value.guests.push({ ...(guestBootstrap as GuestType) });
    });
  };

  /**
   * Remove guest from invite
   *
   * @param index unique location of the guest in the array
   */
  const removeGuest = (index: number) => {
    if (invite.value.guests.length > 1) {
      invite.value.guests.splice(index, 1);
    } else {
      console.error("At least one guest must remain.");
    }
  };

  const draggedIndex = ref<number | null>(null);

  const onGuestDragStart = (index: number) => {
    draggedIndex.value = index;
  };

  const onGuestDrop = (index: number) => {
    if (draggedIndex.value === null || draggedIndex.value === index) return;

    const draggedItem = invite.value.guests[draggedIndex.value];
    invite.value.guests.splice(draggedIndex.value, 1);
    invite.value.guests.splice(index, 0, draggedItem);
    draggedIndex.value = null;
  };

  // Computed property to get the date range
  const datesStaying = computed({
    get: () => {
      const start = invite.value?.accommadation_arrival_date;
      const end = invite.value?.accommadation_leave_date;

      if (!start || !end) {
        return []; // Return an empty array if either date is null
      }

      // Format the start and end dates
      const startDateParts = formatDate(start);
      const endDateParts = formatDate(end);

      // Initialize array to store the date range
      const dateArray: Date[] = [];
      let currentDate = new Date(startDateParts);

      // Loop until we reach the end date
      while (currentDate <= new Date(endDateParts)) {
        // Add the currentDate as a Date object
        dateArray.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1); // Increment by 1 day
      }

      return dateArray;
    },
    set: (newDates: Date[]) => {
      if (newDates.length >= 2) {
        invite.value = {
          ...invite.value,
          accommadation_arrival_date: new Date(formatDate(newDates[0])),
          accommadation_leave_date: new Date(
            formatDate(newDates[newDates.length - 1])
          ),
        };
      }
    },
  });

  const submitInvite = async (
    invite: Ref<InviteCreationType | InviteType | null>,
    isEditMode: boolean
  ) => {
    if (!invite.value) return;

    isSubmitting.value = true;

    const form: InviteCreationType | InviteType = {
      id: invite.value.id,
      accommadation_arrival_date: invite.value.accommadation_arrival_date,
      accommadation_leave_date: invite.value.accommadation_leave_date,
      shared_photos_link: invite.value.shared_photos_link,
      guests: invite.value.guests,
    };

    const endpoint = isEditMode
      ? `/api/invite/${invite.value.id}`
      : "/api/invite";

    console.log("endpoint", endpoint);

    try {
      const response = await $fetch(endpoint, {
        method: "POST",
        body: { ...form },
      });

      console.log("useInviteManagement > response", response);

      if (!response) {
        console.log("error", response);
      }
    } catch (error: any) {
      console.error("API Error:", error);
      throw new Error(error);
    }

    isSubmitting.value = false;
    return true;
  };

  return {
    invite,
    isValid,
    isSubmitting,
    isDraggable,
    datesStaying,
    addGuest,
    removeGuest,
    onGuestDragStart,
    onGuestDrop,
    submitInvite,
  };
}
