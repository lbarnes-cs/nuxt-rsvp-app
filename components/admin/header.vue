<template>
  <v-app-bar flag color="primary">
    <v-container class="mx-auto d-flex align-center justify-center">
      <nuxt-link
        :to="localePath('/admin')"
        class="d-flex text-white text-decoration-none"
      >
        <v-icon class="mr-2">mdi-kangaroo</v-icon>
        <v-app-bar-title>Admin Portal</v-app-bar-title>
      </nuxt-link>

      <v-spacer />

      <v-btn to="/admin">List</v-btn>

      <v-btn to="/admin/timeline">Timeline</v-btn>
    </v-container>
  </v-app-bar>
</template>

<script setup lang="ts">
  import { useLocalePath } from '#imports';

  const localePath = useLocalePath();
</script>
