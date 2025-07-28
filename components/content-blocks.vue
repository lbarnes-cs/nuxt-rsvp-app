<template>
  <template v-for="(section, index) in contentBlocks" :key="index">
    <!-- Paragraphs -->
    <template v-if="$rt(section.type) === 'paragraphs'">
      <p
        v-for="(para, i) in section.content"
        :key="i"
        class="content-paragraph my-4"
      >
        {{ $rt(para) }}
      </p>
    </template>

    <!-- Header -->
    <template v-else-if="$rt(section.type) === 'header'">
      <p class="content-header mb-4 text-h4">{{ $rt(section.content) }}</p>
    </template>

    <!-- Header -->
    <template v-else-if="$rt(section.type) === 'subheader'">
      <p class="content-subheader mb-4 font-weight-bold">
        {{ $rt(section.content) }}
      </p>
    </template>

    <!-- List -->
    <template v-else-if="$rt(section.type) === 'list'">
      <ul class="content-list pl-6">
        <li v-for="(item, i) in section.content" :key="i">
          {{ $rt(item) }}
        </li>
      </ul>
    </template>
  </template>
</template>

<script setup lang="ts">
  import type { SectionBlocks } from '@/types/contentBlocks';

  defineProps<{ contentBlocks: Record<string, SectionBlocks> }>();
</script>
