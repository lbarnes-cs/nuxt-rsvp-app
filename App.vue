<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
  import { useRuntimeConfig } from '#app';

  import { personA, personB } from '@/constants/people';

  const { t } = useI18n();

  const config = useRuntimeConfig();

  const seoTitle = computed(() =>
    t('home.seoTitle', {
      personA: personA.firstName,
      personB: personB.firstName,
    }),
  );

  useHead({
    titleTemplate: (title) =>
      title ? `${title} | ${seoTitle.value}` : seoTitle.value,
    description: () =>
      t('home.seoDescription', {
        personA: personA.firstName,
        personB: personB.firstName,
      }),
    ogTitle: () =>
      t('home.seoTitle', {
        personA: personA.firstName,
        personB: personB.firstName,
      }),
    ogDescription: () =>
      t('home.seoDescription', {
        personA: personA.firstName,
        personB: personB.firstName,
      }),
    ogUrl: config.public.siteUrl,
    ogType: 'website',
  });
</script>
