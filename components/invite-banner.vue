<template>
  <v-container class="banner">
    <v-row>
      <v-col
        cols="12"
        sm="4"
        class="d-flex justify-center"
        order="1"
        order-sm="2"
      >
        <v-img src="assets/images/rsvp-kangaroo-crop.webp" max-width="200" />
      </v-col>
      <v-col
        cols="12"
        sm="8"
        class="d-flex flex-column justify-end"
        order="2"
        order-sm="1"
      >
        <template v-if="guests?.length">
          <p class="text-h4 secondary-font font-weight-bold">
            {{ $t("personOne") }} {{ $t("and") }} {{ $t("personTwo") }}
          </p>
          <p class="text-h3 secondary-font font-weight-medium">
            {{ $t("rsvp.invite", { name: inviteName }) }}
          </p>
        </template>
        <template v-else>
          <p class="text-h4 secondary-font font-weight-bold">
            {{ $t("rsvp.loadingInvite") }}
          </p>
        </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useFormatGuestNames } from "@/composables/useFormatGuestNames";

import type { GuestType } from "@/types/guest";

const props = defineProps<{
  guests?: GuestType[];
}>();

// Use computed property to get invite name
const inviteName = computed(() => {
  // Ensure guests are available before calling useFormatGuestNames
  return useFormatGuestNames(props.guests).value;
});
</script>

<style lang="scss" scoped>
.banner {
  background-image: url("@/assets/images/stripe-thin.png");
  background-position: center;
  background-repeat: repeat-x;
  background-size: auto 100%;
  background-color: rgba(#efe8c0, 0.6);
  background-blend-mode: hard-light;

  .v-theme--dark & {
    background-blend-mode: difference;
    background-color: rgba(#efe8c0, 0.3);
  }
}
</style>
