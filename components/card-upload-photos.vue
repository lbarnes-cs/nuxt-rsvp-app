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

        <v-col cols="12" sm="8" md="9" align-self="center" class="text-body-1">
          <h1 class="text-h5 font-weight-medium pb-2">
            {{ title || t('sharedPhotos.title') }}
          </h1>

          <p
            v-for="(para, i) in description || $tm('sharedPhotos.description')"
            :key="i"
            class="my-2"
          >
            {{ $rt(para) }}
          </p>

          <v-btn
            v-if="sharedLink"
            ref="nofollow noindex"
            :href="sharedLink"
            target="_blank"
            color="primary"
            variant="tonal"
            class="mt-2"
          >
            <v-icon class="mr-2" size="large">mdi-upload-circle-outline</v-icon>
            {{ $t('sharedPhotos.cta') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script setup lang="ts">
  const { t } = useI18n();

  type PropsType = {
    title?: string;
    description?: string[];
    sharedLink?: string;
  };

  withDefaults(defineProps<PropsType>(), {
    title: undefined,
    description: undefined,
    sharedLink: undefined,
  });
</script>
