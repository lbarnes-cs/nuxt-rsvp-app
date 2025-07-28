<template>
  <v-card
    class="mx-auto my-16"
    elevation="12"
    width="100%"
    max-width="400"
    theme="light"
    rounded="lg"
    color="grey-lighten-4"
  >
    <div class="errorImage pt-4">
      <v-img
        :src="getImagePath()"
        max-width="300"
        md-max-width="100%"
        class="align-end text-black"
        height="240"
        cover
      />
    </div>

    <v-card-item>
      <v-card-subtitle>
        <v-icon
          color="error"
          icon="mdi-alert-circle"
          size="small"
          class="me-1"
        />

        <span class="font-weight-medium">Error: {{ statusCode }}</span>
      </v-card-subtitle>

      <v-card-title class="d-flex align-center">
        <span class="font-weight-black">{{ statusMessage }}</span>
      </v-card-title>
    </v-card-item>

    <!-- eslint-disable-next-line vue/no-v-html vue/no-v-text-v-html-on-component -->
    <v-card-text v-html="message" />

    <v-divider class="mx-4 my-2" />

    <v-list-item
      append-icon="mdi-chevron-right"
      base-color="secondary"
      :to="localePath('/')"
    >
      <v-list-item-subtitle opacity="1">
        <span class="font-weight-bold">
          {{ $t('error-state.return-home') }}
        </span>
      </v-list-item-subtitle>
    </v-list-item>
  </v-card>
</template>

<script setup lang="ts">
  const localePath = useLocalePath();

  type Props = {
    statusCode?: number;
    statusMessage?: string;
    message?: string;
  };

  const props = withDefaults(defineProps<Props>(), {
    statusCode: 500,
    statusMessage: 'This page has gone for a walkabout.',
    message: 'Something went wrong.',
  });

  const getImagePath = () => {
    if (props.statusCode === 503)
      return new URL('@/assets/images/error-state.webp', import.meta.url).href;

    return new URL('@/assets/images/error-state.webp', import.meta.url).href; // Fallback for other cases
  };
</script>

<style lang="scss" scoped>
  .errorImage {
    background: #dfddd9;
  }
</style>
