<template>
  <v-container>
    <v-row>
      <v-col v-if="invite" cols="12">
        <v-card theme="light" :loading="isLoading">
          <invite-banner :guests="invite?.guests" />

          <template v-if="!isLoading">
            <v-card-title v-if="invite.first_replied" class="mt-4">
              {{ $t('confirmation.title', { guests: inviteName }) }}
            </v-card-title>

            <v-card-text>
              <p class="text-body-1 mb-2">
                {{ $t('confirmation.text-1') }}
              </p>

              <p class="text-body-1">
                {{ $t('confirmation.text-2') }}
              </p>

              <btn-calendar
                :event="weekendEvent"
                :label="$t('calendar.eventWeekend')"
                class="mt-4"
              />
            </v-card-text>

            <v-card-title v-if="invite.first_replied" class="mt-4">
              {{ $t('confirmation.custom-timeline') }}
            </v-card-title>

            <v-card-text v-if="invite" class="text-body-1">
              <personalised-timeline
                :arrival-date="invite?.arrival_date"
                :depature-date="invite?.departure_date"
                :is-arriving-by-train="invite.is_arriving_by_train"
              />
            </v-card-text>

            <card-upload-photos
              v-if="invite.shared_photos_link"
              class="ma-4"
              :shared-link="invite.shared_photos_link"
            />

            <v-card-actions>
              <v-spacer />

              <v-btn
                color="primary"
                :to="
                  localePath({
                    name: 'index',
                  })
                "
              >
                {{ $t('confirmation.homepage') }}
              </v-btn>
            </v-card-actions>
          </template>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';

  import type { InviteType } from '@/types/invite';
  import type { EventType } from '@/types/events.ts';

  import { useFormatGuestNames } from '@/composables/useFormatGuestNames';
  import { useDateFormatter } from '@/composables/useDateFormatter';
  import { useRsvpInviteLocale } from '@/composables/useRsvpInviteLocale';

  import btnCalendar from '@/components/btn-calendar.vue';
  import cardUploadPhotos from '@/components/card-upload-photos.vue';
  import inviteBanner from '@/components/invite-banner.vue';
  import personalisedTimeline from '@/components/personalised-timeline.vue';

  import { personA, personB } from '@/constants/people';
  import { eventInfo } from '@/constants/event';

  // Useful code
  const route = useRoute();
  const localePath = useLocalePath();
  const { t } = useI18n();
  const { formatDate } = useDateFormatter();

  const { getEventDescription } = useRsvpInviteLocale();

  // Retrieve inviteId from the URL
  const inviteId = route.params.id as string | undefined; // Get the `id` from route params

  // Set the states
  const isLoading = ref(true);
  const invite: InviteType = await $fetch(`/api/invite/${inviteId}`);

  // Update states
  isLoading.value = false;

  // Use computed property to get invite name
  const inviteName = computed(
    () =>
      // Ensure guests are available before calling useFormatGuestNames
      useFormatGuestNames(invite?.guests).value,
  );

  const weekendEvent: EventType = {
    title: t('calendar.eventWeekendTitle', {
      personA: personA.firstName,
      personB: personB.firstName,
    }),
    startDate: formatDate(new Date(invite.arrival_date!)),
    startTime: eventInfo.eventDate.minArrivalTime,
    endDate: formatDate(new Date(invite.departure_date!)),
    endTime: eventInfo.eventDate.maxDepatureTime,
    description: getEventDescription(invite),
    timeZone: eventInfo.timeZone,
    location: eventInfo.address.fullAddress,
  };

  useHead({
    title: 'Confirmation',
  });
</script>

<style lang="scss" scoped>
  ::v-deep(.v-card-title) {
    white-space: normal;
  }
</style>
