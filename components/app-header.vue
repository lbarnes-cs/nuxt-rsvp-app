<template>
  <v-app-bar flag color="primary">
    <v-container class="mx-auto d-flex align-center justify-center">
      <nuxt-link
        :to="localePath('/')"
        class="d-flex text-white text-decoration-none"
      >
        <v-icon class="mr-2">mdi-kangaroo</v-icon>
        <v-app-bar-title>
          {{ personA.firstName }}
          <span class="and">&</span>
          {{ personB.firstName }}
        </v-app-bar-title>
      </nuxt-link>

      <v-spacer />

      <languageSwitch v-if="isLocaleVisible" />
    </v-container>
  </v-app-bar>
</template>

<script setup lang="ts">
  import languageSwitch from '@/components/language-switch.vue';
  import { useLocalePath } from '#imports';
  import { personA, personB } from '@/constants/people';

  const localePath = useLocalePath();
  const route = useRoute();

  const allowedLocaleChange = [
    localePath('/'),
    localePath('/card'),
    localePath('/photos'),
  ];
  const currentPath = route.path;

  // Check if the current route is the home page for any locale
  const isLocaleVisible = allowedLocaleChange.find(
    (item) => item === currentPath,
  );
</script>

<style lang="scss" scoped>
  .and {
    font-style: italic;
    font-weight: 200;
  }
</style>
