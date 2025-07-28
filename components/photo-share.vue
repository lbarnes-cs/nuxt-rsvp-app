<template>
  <v-container class="text-body-1">
    <v-row>
      <v-col cols="12">
        <h2 class="text-h3 mt-6">{{ $t('photoShare.title') }}</h2>
      </v-col>
      <v-col cols="12">
        <card-upload-photos
          :title="$t('photoShare.cardTitle')"
          :description="photoUploadDescription"
        />
      </v-col>

      <v-col cols="12" md="6">
        <content-blocks :content-blocks="supportMobile" />
      </v-col>
      <v-col cols="12" md="6">
        <content-blocks :content-blocks="supportDesktop" />
      </v-col>

      <v-col cols="12">
        <iframe
          v-if="iFrameSrc"
          :key="iFrameSrc"
          :src="iFrameSrc"
          width="100%"
          height="300px"
          style="border: 0"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  import cardUploadPhotos from '@/components/card-upload-photos.vue';

  import type { SectionBlocks } from '@/types/contentBlocks';

  const { t, tm } = useI18n();

  const photoUploadDescription = computed(() => {
    const result = tm('photoShare.description');
    return Array.isArray(result) ? (result as string[]) : [];
  });

  const iFrameSrc = computed(() => {
    return `${t('photoShare.link')}embed/`;
  });

  const supportMobile = computed<Record<string, SectionBlocks>>(
    () => tm('uploadSupport.mobile') as Record<string, SectionBlocks>,
  );

  const supportDesktop = computed<Record<string, SectionBlocks>>(
    () => tm('uploadSupport.desktop') as Record<string, SectionBlocks>,
  );
</script>
