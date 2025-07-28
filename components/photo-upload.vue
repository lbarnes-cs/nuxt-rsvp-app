<template>
  <v-container class="text-body-1">
    <v-row>
      <v-col cols="12">
        <h2 class="text-h3 mt-6">{{ $t('photoUpload.title') }}</h2>
      </v-col>
      <v-col cols="12">
        <card-upload-photos
          :title="$t('photoUpload.cardTitle')"
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

      <v-col cols="12">
        <content-blocks :content-blocks="sections" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  import cardUploadPhotos from '@/components/card-upload-photos.vue';

  import type { SectionBlocks } from '@/types/contentBlocks';

  const { t, tm } = useI18n();

  // Localized invite sections (with links etc)
  const sections = computed<Record<string, SectionBlocks>>(
    () => tm('photoUpload.sections') as Record<string, SectionBlocks>,
  );

  const supportMobile = computed<Record<string, SectionBlocks>>(
    () => tm('uploadSupport.mobile') as Record<string, SectionBlocks>,
  );

  const supportDesktop = computed<Record<string, SectionBlocks>>(
    () => tm('uploadSupport.desktop') as Record<string, SectionBlocks>,
  );

  const photoUploadDescription = computed(() => {
    const result = tm('photoUpload.description');
    return Array.isArray(result) ? (result as string[]) : [];
  });

  const iFrameSrc = computed(() => {
    return `${t('photoUpload.link')}embed/`;
  });
</script>
