<template>
  <v-card variant="tonal">
    <v-container>
      <v-row>
        <v-col cols="12" sm="4" md="3" align-self="center">
          <v-img
            src="assets/images/koala-camera.webp"
            max-height="260"
            rounded
            cover
          />
        </v-col>

        <v-col cols="12" sm="8" md="9" align-self="center">
          <h1 class="text-h5 font-weight-medium pb-2">
            {{ $t("sharedPhotos.title") }}
          </h1>

          <p class="text-body-1 pb-2">
            {{ $t("sharedPhotos.description-1") }}
          </p>

          <p class="text-body-1 pb-4">
            {{ $t("sharedPhotos.description-2") }}
          </p>

          <v-btn
            :href="sharedLink"
            target="_blank"
            ref="nofollow noindex"
            color="primary"
            variant="tonal"
          >
            <v-icon class="mr-2" size="large">mdi-upload-circle-outline</v-icon>
            {{ $t("sharedPhotos.cta") }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  sharedLink: string;
}>();
</script>
