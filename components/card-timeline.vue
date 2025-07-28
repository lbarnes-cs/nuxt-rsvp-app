<template>
  <v-card
    theme="dark"
    background="grey-darken-2"
    class="overflow-visible"
    variant="flat"
  >
    <v-card-item>
      <template #title>Your customised timetable</template>

      <template #subtitle>
        View your customised timeline for the weekend
      </template>

      <template #prepend>
        <v-avatar color="blue-darken-2" class="mr-2">
          <v-icon icon="mdi-timeline-clock" />
        </v-avatar>
      </template>
    </v-card-item>

    <v-card-text class="bg-surface-light">
      <p class="pt-4">Save your weekend trip to your calendar</p>

      <btn-calendar
        :event="weekendEvent"
        :label="$t('calendar.eventWeekend')"
        class="mt-4"
        size="2"
        light-mode="light"
      />
    </v-card-text>

    <v-card-actions>
      <v-btn color="orange-lighten-2" text="Explore" @click="show = !show" />

      <v-spacer />

      <v-btn
        :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        @click="show = !show"
      />
    </v-card-actions>

    <v-expand-transition>
      <div v-show="show">
        <v-divider />

        <v-card-text>
          <personalised-timeline
            :arrival-date="invite.arrival_date"
            :depature-date="invite.departure_date"
            :is-arriving-by-train="invite.is_arriving_by_train"
          />
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script lang="ts" setup>
  import personalisedTimeline from '@/components/personalised-timeline.vue';

  import { useDateFormatter } from '@/composables/useDateFormatter';
  import { useRsvpInviteLocale } from '@/composables/useRsvpInviteLocale';

  import { personA, personB } from '@/constants/people';
  import { eventInfo } from '@/constants/event';

  import type { EventType } from '@/types/events';
  import type { InviteType } from '@/types/invite';

  const show = ref<boolean>(false);

  const props = defineProps<{
    invite: InviteType;
  }>();

  const { t } = useI18n();
  const { formatDate } = useDateFormatter();
  const { getEventDescription } = useRsvpInviteLocale();

  const weekendEvent: EventType = {
    title: t('calendar.eventWeekendTitle', {
      personA: personA.firstName,
      personB: personB.firstName,
    }),
    startDate: formatDate(new Date(props.invite.arrival_date!)),
    startTime: eventInfo.eventDate.minArrivalTime,
    endDate: formatDate(new Date(props.invite.departure_date!)),
    endTime: eventInfo.eventDate.maxDepatureTime,
    description: getEventDescription(props.invite),
    timeZone: eventInfo.timeZone,
    location: eventInfo.address.fullAddress,
  };
</script>
