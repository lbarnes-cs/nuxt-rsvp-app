<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card theme="light" :loading="isLoading">
          <invite-banner :guests="invite?.guests" />

          <template v-if="!isLoading">
            <v-card-title class="mt-4">
              {{ $t("invite.dear", { guests: inviteName }) }},</v-card-title
            >

            <card-upload-photos
              class="ma-4"
              v-if="invite.shared_photos_link"
              :shared-link="invite.shared_photos_link"
            />

            <v-card-text v-if="invite" class="text-body-1">
              <p class="pb-4">
                {{ $t("invite.intro") }}
              </p>

              <p class="font-weight-bold">
                {{ $t("invite.travel.title") }}
              </p>
              <i18n-t
                keypath="invite.travel.text"
                tag="p"
                class="pb-4"
                scope="global"
              >
                <template #weddingVenue>
                  <a
                    href="https://maps.app.goo.gl/WytXRTHj6r7rZaoZ7"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="app-link"
                  >
                    {{ $t("invite.travel.weddingVenue") }}
                  </a>
                </template>
                <template #airport>
                  <a
                    href="https://ber.berlin-airport.de/"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="app-link"
                  >
                    {{ $t("invite.travel.airport") }}
                  </a>
                </template>
                <template #driveDistance>
                  <a
                    href="https://maps.app.goo.gl/iibKP82xCGQqTAtN7"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="app-link"
                  >
                    {{ $t("invite.travel.driveDistance") }}</a
                  >
                </template>
              </i18n-t>

              <p class="font-weight-bold">
                {{ $t("invite.meals.title") }}
              </p>
              <p class="pb-4">{{ $t("invite.meals.text") }}</p>

              <p class="font-weight-bold">
                {{ $t("invite.reception.title") }}
              </p>
              <p class="pb-4">{{ $t("invite.reception.text") }}</p>

              <p class="font-weight-bold">
                {{ $t("invite.gifts.title") }}
              </p>
              <i18n-t
                keypath="invite.gifts.text"
                tag="p"
                class="pb-4"
                scope="global"
              >
                <template #paypal>
                  <a
                    href="https://paypal.me/link"
                    target="_blank"
                    class="app-link"
                    rel="noopener noreferrer"
                  >
                    {{ $t("invite.gifts.paypal") }}
                  </a>
                </template>
              </i18n-t>

              <p>
                <strong>{{ $t("invite.packing.title") }}</strong>
              </p>
              <p>{{ $t("invite.packing.text") }}</p>
              <ul class="pt-2 pb-4 pl-8">
                <li>{{ $t("invite.packing.item-1") }}</li>
                <li>{{ $t("invite.packing.item-2") }}</li>
                <li>{{ $t("invite.packing.item-3") }}</li>
                <li>{{ $t("invite.packing.item-4") }}</li>
                <li>{{ $t("invite.packing.item-5") }}</li>
                <li>{{ $t("invite.packing.item-6") }}</li>
              </ul>

              <p class="pb-4">
                {{ $t("invite.outro") }}
              </p>

              <p>
                {{ $t("invite.regards") }},
                <br />
                <span class="text-h6 secondary-font"
                  >{{ $t("personOne") }} {{ $t("and") }}
                  {{ $t("personTwo") }}</span
                >
              </p>
            </v-card-text>

            <v-card-actions>
              <v-btn
                color="secondary"
                :to="
                  localePath({
                    name: 'index',
                  })
                "
              >
                {{ $t("invite.respondLater") }}
              </v-btn>

              <v-spacer />

              <v-btn
                :to="
                  localePath({
                    name: 'rsvp-id-edit',
                    params: { id: inviteId },
                  })
                "
                color="primary"
              >
                {{ $t("invite.submitRSVP") }}
              </v-btn>
            </v-card-actions>
          </template>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { createError } from "#app";

import type { InviteType } from "@/types/invite";

import { useFormatGuestNames } from "@/composables/useFormatGuestNames";

import inviteBanner from "@/components/invite-banner.vue";
import cardUploadPhotos from "@/components/card-upload-photos.vue";

// Useful code
const route = useRoute();
const localePath = useLocalePath();
const { t } = useI18n();

// Retrieve inviteId from the URL
const inviteId = route.params.id as string | undefined;

// Set the states
const isLoading = ref(true);
const invite = ref<InviteType>({} as InviteType);

// Fetch the invite API
const { data: inviteData, error: inviteError } = await useAsyncData<InviteType>(
  "inviteData",
  () => $fetch(`/api/invite/${inviteId}`)
);

// Update states
invite.value = inviteData.value as InviteType;
isLoading.value = false;

// Handle errors from API fetch
if (inviteError.value) {
  const nuxtError = createError({
    statusCode: 404,
    statusMessage: t("error-state.invite-get.title"),
    message: `<p>${t(
      "error-state.invite-get.message"
    )}</p><p class="mt-4 font-italic">Message: ${inviteError.value}</p>`,
  });

  useError().value = nuxtError;
  throw nuxtError;
}

// Ensure guests are available before calling useFormatGuestNames
const inviteName = computed(
  () => useFormatGuestNames(invite.value?.guests).value
);

const seoTitle = computed(() => t("home.seoTitle"));
const seoDescription = computed(() => t("home.rsvpSeoDescription"));

useSeoMeta({
  title: "RSVP",
  description: () => seoDescription.value,
  ogTitle: () => seoTitle.value,
  ogDescription: () => seoDescription.value,
  ogUrl: "https://demo.comingsoon.com",
  ogType: "website",
});
</script>
