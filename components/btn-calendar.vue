<template>
  <div>
    <add-to-calendar-button v-bind="calendarProps" />
  </div>
</template>

<script lang="ts" setup>
  import 'add-to-calendar-button';
  import { personA, personB } from '@/constants/people';

  import type { EventType } from '@/types/events.ts';

  const { locale } = useI18n();

  const props = withDefaults(
    defineProps<{
      event: EventType;
      label?: string;
      size?: string | number;
      lightMode?: string;
    }>(),
    {
      lightMode: 'dark',
      size: undefined,
      label: undefined,
    },
  );

  const ICAL_FILENAME = `${personA.firstName.toLowerCase()}-${personB.firstName.toLowerCase()}-event`;

  /**
   * Note: we are binding the props to ensure we use camelKase, as the custom web-element needs to preserved the object.
   * Prettier otherwise converts it to kebab-case and breaks the structure
   */
  const calendarProps = {
    buttonStyle: 'round',
    description: props.event.description,
    endDate: props.event.endDate,
    endTime: props.event.endTime,
    hideCheckmark: true,
    iCalFileName: ICAL_FILENAME,
    label: props.label,
    language: locale,
    lightMode: props.lightMode,
    listStyle: 'dropdown-static',
    location: props.event.location,
    name: props.event.title,
    options: "['Google', 'Apple','iCal','Outlook.com','Yahoo']",
    startDate: props.event.startDate,
    startTime: props.event.startTime,
    timeZone: props.event.timeZone,
    trigger: 'click',
    size: props.size,
  };
</script>
