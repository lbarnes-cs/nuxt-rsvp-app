<template>
  <v-form v-model="isValid" @submit.prevent="updateInvite">
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card :loading="isLoading">
            <invite-banner :guests="guestInfomation" />

            <v-card-text v-if="invite.first_replied">
              <v-alert
                border="start"
                icon="mdi-check-decagram-outline"
                variant="tonal"
              >
                <template #title>{{ $t('rsvp.alert-header') }}</template>
                <p class="pt-2">
                  {{ $t('rsvp.alert-submitted') }}
                </p>
              </v-alert>
            </v-card-text>

            <v-card-title class="mt-2">
              {{ $t('form.inviteTitle') }}
            </v-card-title>

            <v-container v-if="invite.guests?.length" fluid>
              <v-row v-if="invite?.guests">
                <v-col
                  v-for="guest in invite?.guests"
                  :key="guest.id"
                  class="d-flex"
                >
                  <v-card
                    variant="outlined"
                    class="height-auto"
                    color="grey-lighten-1"
                  >
                    <template #title>
                      <span class="text-grey-darken-4">
                        {{ $t('form.guestInformation') }}
                      </span>
                    </template>

                    <v-container fluid>
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                            v-model="guest.first_name"
                            :label="$t('form.firstName')"
                            :rules="[requiredField]"
                            hide-details="auto"
                          />
                        </v-col>

                        <v-col cols="12">
                          <v-text-field
                            v-model="guest.last_name"
                            :label="$t('form.lastName')"
                            :rules="[requiredField]"
                            hide-details="auto"
                          />
                        </v-col>

                        <v-col cols="12">
                          <p class="text-subtitle-1 mb-2 text-grey-darken-1">
                            Select if you are able to attend:
                          </p>

                          <v-btn-toggle
                            v-model="guest.is_attending"
                            color="primary"
                            base-color="grey"
                            group
                            mandatory
                            variant="outlined"
                            density="comfortable"
                            :rules="[requiredAttendance]"
                          >
                            <v-btn :value="false">
                              {{ $t('form.attending.false') }}
                            </v-btn>

                            <v-btn :value="true">
                              {{ $t('form.attending.true') }}
                            </v-btn>
                          </v-btn-toggle>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <v-date-input
                    v-model="datesStaying"
                    :label="$t('form.selectDatesLabel')"
                    multiple="range"
                    :min="eventInfo.eventDate.minArrivalDate"
                    :max="eventInfo.eventDate.maxDepartureDate"
                    :month="6"
                    :year="2025"
                    persistent-hint
                    :rules="[(value) => validDates(value, inviteData)]"
                    :hint="$t('form.dateSelectionHint')"
                    :hint-details="false"
                    :hide-actions="false"
                  />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="invite.additional_notes"
                    :label="$t('form.additionalNotes')"
                    prepend-icon="mdi-note-edit-outline"
                    rows="4"
                  />
                </v-col>
              </v-row>
            </v-container>

            <v-card-actions class="mb-2">
              <v-btn
                :to="
                  localePath({
                    name: 'rsvp-id',
                    params: { id: inviteId },
                  })
                "
                color="secondary"
                :disabled="isSubmitting"
              >
                {{ $t('form.buttonCancel') }}
              </v-btn>

              <v-spacer />

              <v-btn :loading="isSubmitting" color="primary" type="submit">
                {{ $t('form.buttonSubmit') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts" setup>
  import { useRouter, useRoute } from 'vue-router';
  import { useGoTo } from 'vuetify';
  import { VDateInput } from 'vuetify/labs/VDateInput';

  import type { NuxtError } from 'nuxt/app';
  import type { InternalGoToOptions } from 'vuetify/lib/composables/goto';
  import type { InviteType } from '@/types/invite';
  import type { GuestType } from '@/types/guest';
  import type { PostgrestError as _PostgrestError } from '@supabase/supabase-js';

  import inviteBanner from '@/components/invite-banner.vue';

  import { useDateFormatter } from '@/composables/useDateFormatter';
  import { useFormValidation } from '@/composables/useFormValidation';
  import { useSnackbar } from '@/composables/useSnackbar';

  import { eventInfo } from '@/constants/event';

  // Form Validation
  const { requiredField, requiredAttendance, validDates } = useFormValidation();

  // Date Formatter
  const { formatDate } = useDateFormatter();

  const { displaySnackbar } = useSnackbar();

  const route = useRoute();
  const router = useRouter();
  const goTo = useGoTo();
  const localePath = useLocalePath();
  const { t } = useI18n();

  // Retrieve inviteId from the URL
  const inviteId = route.params.id as string | undefined; // Get the `id` from route params

  const invite = ref<InviteType>({} as InviteType);
  const guestInfomation = ref([] as GuestType[]);

  // Set the states
  const isValid = ref<boolean>(false);
  const isLoading = ref<boolean>(true);
  const isSubmitting = ref<boolean>(false);

  // Fetch the invite API
  const { data: inviteData, error: inviteError } =
    await useAsyncData<InviteType>('inviteData', () =>
      $fetch(`/api/invite/${inviteId}`),
    );

  // Handle errors from API fetch
  if (inviteError.value) {
    const handleError = handleApiError(inviteError.value, {
      statusMessage: t('error-state.invite-get.title'),
      message: t('error-state.invite-get.message'),
    });

    useError().value = handleError; // Make sure the error is properly handled
    throw handleError;
  }

  // Update states
  // Get information from the API-fetch and associate it to the refs
  invite.value = { ...(inviteData.value as InviteType) };

  // Clone the array without reference
  guestInfomation.value = inviteData.value?.guests?.map((guest: GuestType) => ({
    ...guest,
  })) as GuestType[];

  isLoading.value = false;

  // Computed property to get the date range
  const datesStaying = computed({
    get: () => {
      const start = invite.value?.arrival_date;
      const end = invite.value?.departure_date;

      if (!start || !end) {
        return []; // Return an empty array if either date is null
      }

      // Format the start and end dates
      const startDateParts = formatDate(start);
      const endDateParts = formatDate(end);

      // Initialize array to store the date range
      const dateArray: Date[] = [];
      const currentDate = new Date(startDateParts);

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
          arrival_date: new Date(formatDate(newDates[0])),
          departure_date: new Date(formatDate(newDates[newDates.length - 1])),
        };
      }
    },
  });

  function scrollToFirstError() {
    // Find all error inputs
    const errorElements = document.querySelectorAll('.v-input--error');

    // Check if there are any error elements
    if (errorElements.length > 0) {
      const firstErrorElement = errorElements[0] as HTMLElement;

      // Scroll to the first error element using Vuetify's goTo
      const goToOptions: Partial<Partial<InternalGoToOptions>> = {
        duration: 300,
        easing: 'easeInOutCubic',
        offset: -80,
      };

      goTo(firstErrorElement, goToOptions);
    }
  }

  // Update the invite and guest details
  const updateInvite = async () => {
    if (!isValid.value) {
      displaySnackbar({
        message: t('validationRules.requiredAttention'),
        color: 'error',
      });

      return scrollToFirstError();
    }

    if (isValid.value && inviteId && invite.value && invite.value?.guests) {
      isSubmitting.value = true;
      // Ensure that invite.value is being used and type it properly
      const first_replied = invite.value.first_replied
        ? new Date(invite.value.first_replied)
        : new Date();

      const form: Partial<InviteType> = {
        first_replied,
        additional_notes: invite.value.additional_notes || '',
        update_timestamp: new Date(),
        arrival_date: invite.value.arrival_date,
        departure_date: invite.value.departure_date,
        guests: invite.value.guests, // Include guests if needed, if it's part of the update
        created_at: invite.value.created_at, // Include created_at if needed
      };

      try {
        const response = await $fetch(`/api/invite/${inviteId}`, {
          method: 'POST',
          body: { ...form },
        });

        if (response) {
          const path = localePath({
            name: 'rsvp-id-confirmation',
            params: { id: inviteId },
          });

          router.push(path);
        }
      } catch (error: _PostgrestError | unknown) {
        displayAPIErrorMessage(error);
      }

      isSubmitting.value = false;
    }
  };

  function displayAPIErrorMessage(apiErrorMessage: NuxtError<unknown> | null) {
    const message = `
      <p class="text-subtitle-1 mb-2">${t('form.saveErrorTitle')}</p>

      <p class="pb-4">
        ${t('form.saveErrorMessage')}
      </p>`;

    displaySnackbar({
      message: message,
      code: JSON.stringify(apiErrorMessage?.data),
      color: 'error',
      timeout: -1,
    });
  }
</script>

<style lang="scss" scoped>
  .custom-error {
    max-height: 300px;
    overflow: scroll;
  }
</style>
