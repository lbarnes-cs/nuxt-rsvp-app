<template>
  <v-parallax
    src="assets/images/background-image.webp"
    :gradient="gradient"
    class="banner"
  >
    <div
      class="d-flex flex-column fill-height text-center justify-center align-center text-white px-4 py-8 sm-pa-0"
    >
      <h1
        class="text-h2 text-sm-h1 font-weight-bold mb-4"
        data-testid="banner-title"
      >
        {{ $t("personOne") }} {{ $t("and") }} {{ $t("personTwo") }}
      </h1>

      <h2 class="text-h3 mb-4 sm-mb-8">{{ $t("banner.eventName") }}</h2>
      <span class="text-h4 text-uppercase">{{ $t("banner.date") }}</span>
    </div>
  </v-parallax>
</template>

<script setup lang="ts">
const gradient =
  "to top right, rgba(255, 0, 0, 50%) 0%, rgba(255, 154, 0, 50%) 30%, rgba(208, 222, 33, 50%) 20%, rgba(79, 220, 74, 50%) 30%, rgba(63, 218, 216, 50%) 40%, rgba(47, 201, 226, 50%) 50%, rgba(28, 127, 238, 50%) 60%, rgba(95, 21, 242, 50%) 70%, rgba(186, 12, 248, 50%) 80%, rgba(251, 7, 217, 50%) 90%, rgba(255, 0, 0, 50%) 100%";

const rainbow =
  "to right, rgb(237, 34, 36, 50%), rgb(243, 91, 34, 50%), rgb(249, 150, 33, 50%), rgb(245, 193, 30, 50%), rgb(241, 235, 27, 50%) 27%, rgb(241, 235, 27, 50%), rgb(241, 235, 27, 50%) 33%, rgb(99, 199, 32, 50%), rgb(12, 155, 73, 50%), rgb(33, 135, 141, 50%), rgb(57, 84, 165, 50%), rgb(97, 55, 155, 50%), rgb(147, 40, 142, 50%)";
</script>

<style lang="scss" scoped>
.banner {
  height: 100vh;
}
</style>
