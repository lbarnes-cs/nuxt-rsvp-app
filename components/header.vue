<template>
  <v-app-bar flag color="primary">
    <v-container class="mx-auto d-flex align-center justify-center">
      <nuxt-link
        :to="localePath('/')"
        class="d-flex text-white text-decoration-none"
      >
        <v-icon class="mr-2">mdi-kangaroo</v-icon>
        <v-app-bar-title>
          {{ $t("personOne") }} <span class="and">&</span> {{ $t("personTwo") }}
        </v-app-bar-title>
      </nuxt-link>

      <v-spacer />

      <languageSwitch v-if="isHomePage" />
    </v-container>
  </v-app-bar>
</template>

<script setup lang="ts">
import languageSwitch from "~/components/language-switch.vue";
import { useLocalePath, useNuxtApp } from "#imports";

const localePath = useLocalePath();
const route = useRoute();
const { $i18n } = useNuxtApp();

// Check if the current route is the home page for any locale
const isHomePage = computed(() => {
  // Get the current locale and localized home page path
  const currentLocale = $i18n.locale;
  const localizedHomePath = localePath("/") || "/";

  // Check if the current route matches the localized home path
  return route.path === localizedHomePath;
});
</script>

<style lang="scss" scoped>
.and {
  font-style: italic;
  font-weight: 200;
}
</style>
