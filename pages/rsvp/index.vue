<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <error-card
          :status-code="statusCode"
          :status-message="statusMessage"
          :message="message"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
const { t } = useI18n();

// Extract statusCode and message with fallbacks
const statusCode = 404;
const statusMessage = t("error-state.invite-id-missing.title");
const message = t("error-state.invite-id-missing.message");

const title = computed(() => t("home.title"));

useSeoMeta({
  title: () => `Invite ID not found | ${title.value}`,
  description: () => "There has been an error",
  ogDescription: () => "There has been an error",
  ogUrl: "https://demo.comingsoon.com",
  ogType: "website",
});
</script>
