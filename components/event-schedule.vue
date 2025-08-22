<template>
  <div class="bg-grey-lighten-3">
    <v-container>
      <v-row>
        <v-col cols="12" sm="7" class="d-flex flex-column justify-center">
          <h3 class="text-h4">
            {{ $t('schedule.header') }}
          </h3>

          <v-divider class="my-6" />

          <p class="text-h6">{{ $t('schedule.description') }}</p>
        </v-col>
        <v-col cols="12" sm="5" class="d-flex justify-center">
          <v-img src="assets/images/koala-drinks-stars.png" max-width="500">
            <template #sources>
              <source srcset="assets/images/koala-drinks-stars.webp" />
            </template>
          </v-img>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
