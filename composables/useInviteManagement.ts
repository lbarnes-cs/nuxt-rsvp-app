import { ref } from 'vue';

import { useDateFormatter } from '@/composables/useDateFormatter';
import { useSnackbar } from '@/composables/useSnackbar';

import type { GuestCreationType, GuestType } from '@/types/guest';
import type { InviteType, InviteCreationType } from '@/types/invite';
import type { PostgrestError as _PostgrestError } from '@supabase/supabase-js';

const guestTemplate: GuestCreationType = {
  first_name: null,
  last_name: null,
  is_attending: false,
};

const inviteTemplate: InviteCreationType = {
  id: '', // empty id on creation
  shared_photos_link: null,
  arrival_date: null,
  departure_date: null,
  is_arriving_by_train: false,
  guests: [{ ...guestTemplate }],
};

export function useInviteManagement() {
  const { formatDate } = useDateFormatter();
  const { displaySnackbar } = useSnackbar();

  const isLoading = ref<boolean>(false);

  // Initialize the invite for creation with guests as GuestCreationType[]
  const invite = ref<InviteCreationType | InviteType>({ ...inviteTemplate });

  const isFormValid = ref(false);

  /**
   * Will only be used in the admin portal to arrange the guest's order-id
   * for the database. This will be used to set the order of guests for the invite.
   * EG: Parents before children.
   *
   * Admin are only able to enable sort once there is more than one guests per invite.
   */
  const areGuestsDraggable = computed<boolean>(
    () => (invite.value?.guests?.length ?? 0) > 1,
  );

  /**
   * Add new guest to list, using the bootstrap to ensure
   * that the default information is pre-filled
   */
  const addGuest = () => {
    requestAnimationFrame(() => {
      invite.value.guests.push({ ...(guestTemplate as GuestType) });
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
      return;
    }

    displaySnackbar({
      message: 'You need at least one guest in the invite',
      color: 'alert',
    });
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
      const start = invite.value?.arrival_date;
      const end = invite.value?.departure_date;

      if (!start && !end) {
        return []; // Return an empty array if either date is null
      }

      // Format the start and end dates
      const startDateParts = formatDate(start);
      const endDateParts = formatDate(end);

      // If only the start date has been selected
      if (start && !end) {
        return [startDateParts];
      }

      // Initialize array to store the date range
      const dateArray: Date[] = [];
      const earliestSelectedDate = new Date(startDateParts);

      // Loop until we reach the end date
      while (earliestSelectedDate <= new Date(endDateParts)) {
        // Add the currentDate as a Date object
        dateArray.push(new Date(earliestSelectedDate));
        earliestSelectedDate.setDate(earliestSelectedDate.getDate() + 1); // Increment by 1 day
      }

      return dateArray;
    },
    set: (newDates: Date[]) => {
      const arrival_date = new Date(formatDate(newDates[0]));

      if (newDates.length >= 2) {
        invite.value = {
          ...invite.value,
          arrival_date,
          departure_date: new Date(formatDate(newDates[newDates.length - 1])),
        };

        return;
      }

      invite.value = {
        ...invite.value,
        arrival_date,
      };
    },
  });

  const onDateStayingsChange = (dateRange: Date[] | string) => {
    const arrival_date = new Date(formatDate(dateRange[0]));
    const departure_date = new Date(
      formatDate(dateRange[dateRange.length - 1]),
    );

    invite.value = {
      ...invite.value,
      arrival_date,
      departure_date,
    };
  };

  const submitInvite = async (
    invite: Ref<InviteCreationType | InviteType | null>,
    isEditMode: boolean,
  ) => {
    if (!invite.value) return;

    isLoading.value = true;

    const form: InviteCreationType | InviteType = {
      id: invite.value.id,
      arrival_date: invite.value.arrival_date,
      departure_date: invite.value.departure_date,
      shared_photos_link: invite.value.shared_photos_link,
      guests: invite.value.guests,
      is_arriving_by_train: invite.value.is_arriving_by_train,
    };

    const endpoint = isEditMode
      ? `/api/invite/${invite.value.id}`
      : '/api/invite';

    try {
      const response = await $fetch(endpoint, {
        method: 'POST',
        body: { ...form },
      });

      if (!response) {
        // TODO: Loge error to sentry
        throw new Error(
          `Issue saving invite: ${response}, endpoint: ${endpoint}`,
        );
      }
    } catch (error: _PostgrestError | unknown) {
      // TODO: Log error to sentry
      throw new Error(error);
    }

    isLoading.value = false;
    return true;
  };

  return {
    invite,
    isFormValid,
    isLoading,
    areGuestsDraggable,
    datesStaying,
    onDateStayingsChange,
    addGuest,
    removeGuest,
    onGuestDragStart,
    onGuestDrop,
    submitInvite,
  };
}
