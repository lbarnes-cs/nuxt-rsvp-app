<template>
  <div>
    <add-to-calendar-button
      :name="event.title"
      :description="event.description"
      :startDate="event.startDate"
      :startTime="event.startTime"
      :endDate="event.endDate"
      :endTime="event.endTime"
      :timeZone="event.timeZone"
      :location="event.location"
      iCalFileName="event-name"
      options="['Google', 'Apple','iCal','Outlook.com','Yahoo']"
      listStyle="dropdown-static"
      buttonStyle="round"
      trigger="click"
      hideCheckmark
      :label="label"
      lightMode="dark"
      :language="locale"
    />
  </div>
</template>

<script lang="ts" setup>
import "add-to-calendar-button";

import type { EventType } from "@/types/events.ts";

const { locale } = useI18n();

// Define props
defineProps<{
  event: EventType;
  label?: string;
}>();
</script>
