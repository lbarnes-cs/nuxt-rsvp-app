<template>
  <div>
    <NuxtLayout name="default">
      <v-container>
        <v-row>
          <v-col cols="12">
            <error-card
              :status-code="error?.statusCode"
              :status-message="error?.statusMessage"
              :message="error?.message"
            />
          </v-col>
        </v-row>
      </v-container>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
  import { useError } from '#app';

  import { personA, personB } from '@/constants/people';

  import ErrorCard from '@/components/error-card.vue';

  // Access the error details
  const error = useError();

  const { t } = useI18n();

  const seoTitle = computed(() =>
    t('home.seoTitle', {
      personA: personA.firstName,
      personB: personB.firstName,
    }),
  );

  useSeoMeta({
    title: () => error.value?.statusMessage || 'Page not found',
    titleTemplate: (title) =>
      title ? `${title} | ${seoTitle.value}` : seoTitle.value,
    description: () => 'There has been an error',
  });
</script>
