<template>
  <div class="background">
    <v-container>
      <v-row>
        <v-col cols="12" sm="7" class="d-flex flex-column justify-center">
          <h3 class="text-h4">
            {{ $t("schedule.header") }}
          </h3>

          <v-divider class="my-6" />

          <p class="text-h6">{{ $t("schedule.description") }}</p>
        </v-col>
        <v-col cols="12" sm="5" class="d-flex justify-center">
          <v-img src="assets/images/light-grey.jpeg" max-width="500" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style lang="scss" scoped>
.background {
  background: #ebebeb;
}
</style>
