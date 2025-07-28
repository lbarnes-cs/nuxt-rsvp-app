<template>
  <div>
    <banner />

    <div class="bg-blue-lighten-5 py-6 py-md-12">
      <v-container>
        <v-row>
          <v-col cols="12" sm="5" class="d-flex justify-center">
            <v-img src="assets/images/crest.png" max-width="500">
              <template #sources>
                <source srcset="assets/images/crest.webp" />
                <source srcset="assets/images/crest.avif" />
              </template>
            </v-img>
          </v-col>

          <v-col
            cols="12"
            sm="6"
            offset-sm="1"
            class="d-flex flex-column justify-center"
          >
            <i18n-t
              keypath="home.welcome"
              tag="h3"
              class="text-h4 pb-8"
              scope="global"
            >
              <template #personA>
                {{ personA.fullName }}
              </template>

              <template #personB>
                {{ personB.fullName }}
              </template>
            </i18n-t>

            <i18n-t keypath="home.introduction" tag="p" scope="global">
              <template #personB>
                {{ personB.firstName }}
              </template>
            </i18n-t>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <event-schedule />

    <div class="bg-pink-lighten-5 py-16">
      <v-container max-width="1200px">
        <v-row>
          <v-col cols="12">
            <googleMap />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" class="d-flex justify-center">
            <v-btn
              :href="eventInfo.address.googleMapUrl"
              target="_blank"
              prepend-icon="mdi-map-marker"
              color="secondary"
            >
              {{ $t("home.openMap") }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <v-container class="pb-16">
      <v-row>
        <v-col cols="12" class="d-flex">
          <frequentQuestions class="pb-16 w-100" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { personA, personB } from "@/constants/people";

import banner from "@/components/intro-banner.vue";
import googleMap from "@/components/google-map.vue";
import frequentQuestions from "@/components/frequent-questions.vue";
import eventSchedule from "@/components/event-schedule.vue";

import { eventInfo } from "@/constants/event";

const { t } = useI18n();

useSeoMeta({
  description: () =>
    t("home.seoDescription", {
      personA: personA.fullName,
      personB: personB.fullName,
    }),
  ogTitle: () =>
    t("home.seoTitle", {
      personA: personA.firstName,
      personB: personB.firstName,
    }),
  ogDescription: () =>
    t("home.seoDescription", {
      personA: personA.firstName,
      personB: personB.firstName,
    }),
});
</script>

<style lang="scss" scoped>
path {
  fill: transparent;
}

text {
  fill: #000;
  font-size: 35px;
  text-align: center;
}
</style>
