<template>
  <div>
    <v-menu>
      <template #activator="{ props }">
        <v-btn
          icon="mdi-translate"
          variant="text"
          size="small"
          v-bind="props"
          class="d-md-none"
        />
      </template>

      <v-list theme="dark">
        <v-list-subheader>Language</v-list-subheader>

        <v-list-item
          v-for="(locale, i) in supportedLocale"
          :key="i"
          :to="switchLocalePath(locale.code)"
        >
          <template #prepend>
            {{ locale.flag }}
          </template>

          <v-list-item-title class="ml-4">
            {{ $t(locale.localeKey) }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <div class="d-none d-md-flex ga-3">
      <v-btn
        v-for="(locale, index) in supportedLocale"
        :key="index"
        :to="switchLocalePath(locale.code)"
        variant="tonal"
        size="small"
      >
        {{ locale.flag }}
        <span class="ml-2">{{ locale.code }}</span>
      </v-btn>
    </div>
  </div>
</template>

<script setup>
  const switchLocalePath = useSwitchLocalePath();

  const supportedLocale = [
    { code: 'en', flag: '🇬🇧' },
    { code: 'fr', flag: '🇫🇷' },
    { code: 'de', flag: '🇩🇪' },
    { code: 'it', flag: '🇮🇹' },
    { code: 'pl', flag: '🇵🇱' },
  ];
</script>
