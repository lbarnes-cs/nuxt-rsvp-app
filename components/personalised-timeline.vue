<template>
  <div class="timeline">
    <v-timeline
      side="end"
      align="center"
      direction="vertical"
      hide-opposite
      justify="auto"
      class="test"
    >
      <v-timeline-item
        v-if="arrivalDate"
        dot-color="green"
        icon="mdi-airplane-landing"
        fill-dot
      >
        <p class="text-subtitle-1 font-weight-bold mb-1">
          {{ formatLocaleDate(arrivalDate) }}
        </p>

        <i18n-t
          v-if="isArrivingByTrain"
          keypath="timeline.arrival"
          tag="p"
          scope="global"
        >
          <template #venueName>
            <a :href="VENUE_GOOGLE_MAPS" target="_blank" class="app-link">
              {{ eventInfo.venueName }}
            </a>
          </template>
        </i18n-t>

        <i18n-t
          v-if="isArrivingByTrain"
          keypath="timeline.train.text"
          tag="p"
          scope="global"
          class="mt-2"
        >
          <template #trainStation>
            <a :href="VIERZON_GOOGLE_MAP" target="_blank" class="app-link">
              {{ $t('timeline.train.trainStation') }}
            </a>
          </template>

          <template #ticket>
            <a
              :href="TRAIN_PARIS_VIERZON_LINK"
              target="_blank"
              class="app-link"
            >
              {{ $t('timeline.train.ticket') }}
            </a>
          </template>
        </i18n-t>
      </v-timeline-item>

      <v-timeline-item
        icon="mdi-weather-sunny"
        fill-dot
        dot-color="red-lighten-2"
        density="compact"
      >
        <p class="text-h6 font-weight-bold">
          {{ formatLocaleDate('2025-07-12') }}
        </p>
      </v-timeline-item>

      <v-timeline-item icon="mdi-hand-heart-outline" dot-color="red-lighten-3">
        <p class="text-subtitle-1 font-weight-bold mb-1">
          {{ formatLocaleTime('11:00') }}
        </p>
        <p>
          {{ $t('timeline.saturday-setup') }}
        </p>
      </v-timeline-item>

      <v-timeline-item icon="mdi-glass-cocktail" dot-color="red-lighten-4">
        <p class="text-subtitle-1 font-weight-bold mb-1">
          {{ formatLocaleTime('15:00') }}
        </p>
        <p>
          {{ $t('timeline.saturday-picnic') }}
        </p>
      </v-timeline-item>

      <v-timeline-item
        icon="mdi-church-outline"
        dot-color="yellow-darken-4"
        fill-dot
        density="compact"
      >
        <p class="text-h6 font-weight-bold">
          {{ formatLocaleDate('2025-07-13') }}
        </p>

        <btn-calendar
          class="mt-2"
          :event="celebrationEvent"
          :label="$t('calendar.eventMain')"
        />
      </v-timeline-item>

      <v-timeline-item size="small" dot-color="yellow-darken-3">
        <p class="text-subtitle-1 font-weight-bold mb-1">
          {{ formatLocaleTime('12:00') }}
        </p>
        <p>{{ $t('timeline.sunday-drinks') }}</p>
      </v-timeline-item>

      <v-timeline-item size="small" dot-color="yellow-darken-2">
        <p class="text-subtitle-1 font-weight-bold mb-1">
          {{ formatLocaleTime('13:00') }}
        </p>
        <p>{{ $t('timeline.sunday-ceremony') }}</p>
      </v-timeline-item>

      <v-timeline-item size="small" dot-color="yellow-darken-1">
        <p class="text-subtitle-1 font-weight-bold mb-1">
          {{ formatLocaleTime('14:00') }}
        </p>
        <p>{{ $t('timeline.sunday-celebration') }}</p>
        <v-spacer />
      </v-timeline-item>

      <v-timeline-item
        v-if="depatureDate"
        dot-color="yellow-lighten-1"
        size="small"
      >
        <p class="text-subtitle-1 font-weight-bold mb-1">
          {{ formatLocaleTime('22:00') }}
        </p>
        <p>
          {{
            $t('timeline.sunday-afterparty', { venueName: eventInfo.venueName })
          }}
        </p>
      </v-timeline-item>

      <v-timeline-item
        :dot-color="isDepartingEarly ? 'green' : 'blue-darken-1'"
        :icon="isDepartingEarly ? 'mdi-airplane-takeoff' : 'mdi-swim'"
        fill-dot
      >
        <p class="text-subtitle-1 font-weight-bold mb-1">
          {{ formatLocaleDate('2025-07-14') }}
        </p>

        <p v-if="isDepartingEarly" class="mb-2">
          {{ $t('timeline.monday-farewell') }}
        </p>

        <p>{{ $t('timeline.monday-day') }}</p>
      </v-timeline-item>

      <v-timeline-item
        v-if="!isDepartingEarly"
        dot-color="green"
        icon="mdi-airplane-takeoff"
        fill-dot
      >
        <p class="text-subtitle-1 font-weight-bold mb-1">
          {{ formatLocaleDate(depatureDate!) }}
        </p>

        <p>
          {{
            $t('timeline.tuesday-farewell', { time: formatLocaleTime('17:00') })
          }}
        </p>

        <p>{{ $t('timeline.tuesday-day') }}</p>
      </v-timeline-item>
    </v-timeline>
  </div>
</template>

<script lang="ts" setup>
  import { useDateFormatter } from '@/composables/useDateFormatter';

  import type { EventType, CommonEventDetailsType } from '@/types/events.ts';

  import btnCalendar from '@/components/btn-calendar.vue';

  import { personA, personB } from '@/constants/people';
  import { eventInfo } from '@/constants/event';
  import {
    VIERZON_GOOGLE_MAP,
    TRAIN_PARIS_VIERZON_LINK,
    VENUE_GOOGLE_MAPS,
  } from '@/constants/links';

  const { formatLocaleDate, formatLocaleTime } = useDateFormatter();

  const props = defineProps<{
    isArrivingByTrain?: boolean;
    arrivalDate?: Date | string | null;
    depatureDate?: Date | string | null;
  }>();

  const { t } = useI18n();

  const commonEventDetails: CommonEventDetailsType = {
    location: eventInfo.location,
    timeZone: eventInfo.timeZone,
  };

  const celebrationEvent: EventType = {
    title: t('calendar.eventTitle', {
      personA: personA.firstName,
      personB: personB.firstName,
    }),
    startDate: eventInfo.eventDate.startDate,
    startTime: eventInfo.eventDate.startTime,
    endDate: eventInfo.eventDate.endDate,
    endTime: eventInfo.eventDate.endTime,
    description: t('calendar.eventDescription', {
      personA: personA.fullName,
      personB: personB.fullName,
    }),
    ...commonEventDetails,
  };

  const isDepartingEarly = computed(
    () =>
      props.depatureDate &&
      new Date(props.depatureDate) < new Date(eventInfo.eventDate.maxDepartureDate),
  );
</script>

<style lang="scss" scoped>
  @use 'vuetify/settings' as *;
  @use 'vuetify/styles' as *;

  @use 'sass:map';

  ::v-deep(.v-timeline.v-timeline--vertical) {
    grid-template-columns: 0 min-content auto !important;

    @media #{map.get($display-breakpoints, 'sm-and-up')} {
      grid-template-columns: auto min-content auto !important;
    }
  }
</style>
