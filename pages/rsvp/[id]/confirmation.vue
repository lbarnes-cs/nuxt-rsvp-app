<template>
  <v-container>
    <v-row>
      <v-col cols="12" v-if="invite">
        <v-card theme="light" :loading="isLoading">
          <invite-banner :guests="invite?.guests" />

          <template v-if="!isLoading">
            <v-card-title v-if="invite.first_replied" class="mt-4">
              {{ $t("confirmation.title", { guests: inviteName }) }}
            </v-card-title>

            <v-card-text>
              <p class="text-body-1 mb-2">
                {{ $t("confirmation.text-1") }}
              </p>

              <p class="text-body-1">
                {{ $t("confirmation.text-2") }}
              </p>

              <btn-calendar
                :event="weekendEvent"
                :label="$t('calendar.eventWeekend')"
                class="mt-4"
              />
            </v-card-text>

            <v-card-title v-if="invite.first_replied" class="mt-4">
              {{ $t("confirmation.custom-timeline") }}
            </v-card-title>

            <v-card-text v-if="invite" class="text-body-1">
              <personalised-timeline
                :arrival-date="invite?.accommadation_arrival_date"
                :depature-date="invite?.accommadation_leave_date"
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
                {{ $t("confirmation.homepage") }}
              </v-btn>
            </v-card-actions>
          </template>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRoute } from "vue-router";

import type { InviteType } from "@/types/invite";
import type { EventType, CommonEventDetailsType } from "@/types/events.ts";

import { useFormatGuestNames } from "@/composables/useFormatGuestNames";
import { useDateFormatter } from "@/composables/useDateFormatter";

import btnCalendar from "@/components/btn-calendar.vue";
import cardUploadPhotos from "@/components/card-upload-photos.vue";
import inviteBanner from "@/components/invite-banner.vue";
import personalisedTimeline from "@/components/personalised-timeline.vue";

// Useful code
const route = useRoute();
const localePath = useLocalePath();
const { t } = useI18n();
const { formatDate } = useDateFormatter();

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
    useFormatGuestNames(invite?.guests).value
);

const commonEventDetails: CommonEventDetailsType = {
  location: "Wasserschloßweg 6, 09123 Chemnitz, Germany",
  timeZone: "Europe/Berlin",
};

const description = `${t("calendar.eventDescription")}

Staying at Wasserschloßweg 6, 09123 Chemnitz, Germany. 
Arriving on ${formatDate(new Date(invite.accommadation_leave_date!))} 
Leaving on ${formatDate(new Date(invite.accommadation_arrival_date!))} 

${t("invite.hello", { guests: inviteName.value })}
${t("invite.intro")}

${t("invite.travel.title")}
${t("invite.travel.text", {
  weddingVenue: t("invite.travel.weddingVenue"),
  airport: t("invite.travel.airport"),
  driveDistance: t("invite.travel.driveDistance"),
})}

${t("invite.meals.title")}
${t("invite.meals.text")}

${t("invite.reception.title")}
${t("invite.reception.text")}

${t("invite.gifts.title")}
${t("invite.gifts.text", {
  paypal: `<a href="https://paypal.me/link">${t(
    "invite.gifts.paypal"
  )}</a>(https://paypal.me/link)`,
})}

${t("invite.packing.title")}
${t("invite.packing.text")}
- ${t("invite.packing.item-1")}
- ${t("invite.packing.item-2")}
- ${t("invite.packing.item-3")}
- ${t("invite.packing.item-4")}
- ${t("invite.packing.item-5")}
- ${t("invite.packing.item-6")}
`;

const weekendEvent: EventType = {
  title: t("calendar.eventWeekendTitle"),
  startDate: formatDate(new Date(invite.accommadation_arrival_date!)),
  startTime: "10:00:00",
  endDate: formatDate(new Date(invite.accommadation_leave_date!)),
  endTime: "17:00:00",
  description,
  ...commonEventDetails,
};

useHead({
  title: "Confirmation",
});
</script>

<style lang="scss" scoped>
::v-deep(.v-card-title) {
  white-space: normal;
}
</style>
