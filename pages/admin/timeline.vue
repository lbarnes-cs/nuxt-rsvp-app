<template>
  <v-timeline side="end">
    <v-timeline-item
      v-for="(item, index) in timelineItems"
      :key="String(item.date)"
      :timestamp="item.date"
      color="primary"
      width="240"
    >
      <v-table density="compact" class="border-sm">
        <tbody>
          <tr
            :class="{
              'bg-grey-lighten-4': item.guestsArriving,
              'font-weight-bold': item.guestsArriving,
            }"
          >
            <td>Guest Arriving</td>
            <td class="text-right">{{ item.guestsArriving }}</td>
          </tr>
          <tr
            :class="{
              'bg-grey-lighten-4': item.guestsDeparting,
              'font-weight-bold': item.guestsDeparting,
            }"
          >
            <td>Guest Departing</td>
            <td class="text-right">{{ item.guestsDeparting }}</td>
          </tr>
        </tbody>

        <tfoot class="bg-blue-grey-darken-1">
          <tr>
            <td><strong>Total Guests</strong></td>
            <td class="text-right">{{ item.totalGuests }}</td>
          </tr>
        </tfoot>
      </v-table>

      <template #opposite>
        <v-card
          width="260"
          :color="cardColor(item.guestsArriving, item.guestsDeparting)"
        >
          <v-card-subtitle class="pt-4 d-flex">
            <span class="font-weight-bold">
              Day {{ index + 1 }}: {{ formatLocaleDate(item.date, 'EEEE') }}
            </span>

            <v-spacer />
            <v-icon v-if="item.guestsArriving" color="white">
              mdi-airplane-landing
            </v-icon>
            <v-icon v-if="item.guestsDeparting" color="white">
              mdi-airplane-takeoff
            </v-icon>
          </v-card-subtitle>
          <v-card-title class="pt-0">
            {{ formatLocaleDate(item.date, 'MMMM dd, yyyy') }}
          </v-card-title>
        </v-card>
      </template>
    </v-timeline-item>
  </v-timeline>
</template>

<script setup lang="ts">
  import type { EventDateType } from '@/types/timeline';
  import { useDateFormatter } from '@/composables/useDateFormatter';

  definePageMeta({
    layout: 'admin',
  });

  const { formatLocaleDate } = useDateFormatter();

  // Fetch the Timeline API
  const { data: timelineData } = await useAsyncData<EventDateType[]>(
    'timelineData',
    () => $fetch('/api/timeline/'),
  );

  const timelineItems = computed(() => timelineData.value ?? []);

  const cardColor = (arrival: number, depature: number): string => {
    if (arrival > depature) return 'green-darken-1';

    if (arrival < depature) return 'blue-darken-1';

    return 'grey-lighten-2';
  };
</script>
