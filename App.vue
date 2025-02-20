<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { useHead } from "@unhead/vue";

const { t } = useI18n();

const seoTitle = computed(() => t("home.seoTitle"));
const seoDescription = computed(() => t("home.seoDescription"));

useHead({
  titleTemplate: (title) =>
    title ? `${title} | ${seoTitle.value}` : seoTitle.value,
  description: () => seoDescription.value,
  ogTitle: () => seoTitle.value,
  ogDescription: () => seoDescription.value,
  ogUrl: "https://demo.comingsoon.com",
  ogType: "website",
});
</script>
