<template>
  <v-app>
    <appHeader />

    <v-main>
      <slot />

      <v-snackbar
        v-model="snackbarSettings.show"
        :timeout="snackbarSettings.timeout"
        :color="snackbarSettings.color"
        top
        multi-line
        vertical
      >
        <div v-html="snackbarSettings.message" class="text-body-1" />

        <v-code
          v-if="snackbarSettings.code"
          class="d-block text-break custom-error mt-4"
        >
          {{ snackbarSettings.code }}
        </v-code>

        <template v-slot:actions>
          <v-btn
            color="white"
            variant="text"
            @click="snackbarSettings.show = false"
          >
            {{ $t("form.buttonClose") }}
          </v-btn>
        </template>
      </v-snackbar>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import appHeader from "@/components/header.vue";

import { useSnackbar } from "@/composables/useSnackbar";

const { snackbarSettings } = useSnackbar();
</script>
