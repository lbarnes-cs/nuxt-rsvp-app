<template>
  <div>
    <banner />

    <div class="bg-blue-lighten-5 py-6 py-md-12">
      <v-container>
        <v-row>
          <v-col cols="12" sm="5" class="d-flex justify-center">
            <v-img
              src="assets/images/crest/v5.png"
              max-width="500"
              md-max-width="100%"
            >
              <template #sources>
                <source srcset="assets/images/crest/v5.webp" />
                <source srcset="assets/images/crest/v5.avif" />
              </template>
            </v-img>
          </v-col>

          <v-col
            cols="12"
            sm="6"
            offset-sm="1"
            class="d-flex flex-column justify-center"
          >
            <h3 class="text-h4 pb-8">{{ $t("home.welcome") }}</h3>
            <p>{{ $t("home.introduction") }}</p>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <wedding-schedule />

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
              href="https://maps.app.goo.gl/WytXRTHj6r7rZaoZ7"
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
import banner from "@/components/banner.vue";
import googleMap from "@/components/google-map.vue";
import frequentQuestions from "@/components/frequent-questions.vue";
import weddingSchedule from "@/components/wedding-schedule.vue";

const { t } = useI18n();

const seoTitle = computed(() => t("home.seoTitle"));
const seoDescription = computed(() => t("home.seoDescription"));

useSeoMeta({
  title: "",
  description: () => seoDescription.value,
  ogTitle: () => seoTitle.value,
  ogDescription: () => seoDescription.value,
  ogUrl: "https://demo.comingsoon.com",
  ogType: "website",
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
