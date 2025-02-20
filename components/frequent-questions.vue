<template>
  <div>
    <h4 class="text-h4 py-8">{{ $t("questions.header") }}</h4>
    <ul>
      <li>
        <p class="text-h5 my-2">{{ $t("questions.when.question") }}</p>
        <p>{{ $t("questions.when.answer") }}</p>

        <v-divider class="my-4" />
      </li>
      <li>
        <p class="text-h5 my-2">{{ $t("questions.where.question") }}</p>
        <p class="mb-4">
          <a
            :href="$t('questions.where.link')"
            target="_blank"
            class="app-link"
            >{{ $t("questions.where.answer") }}</a
          >
        </p>

        <p>{{ $t("questions.where.description") }}</p>

        <v-divider class="my-4" />
      </li>
      <li>
        <p class="text-h5 my-2">{{ $t("questions.how.question") }}</p>
        <p>{{ $t("questions.how.answer") }}</p>

        <v-divider class="my-4" />
      </li>
      <li>
        <p class="text-h5 my-2">{{ $t("questions.rsvp.question") }}</p>
        <p>{{ $t("questions.rsvp.answer") }}</p>

        <v-divider class="my-4" />
      </li>

      <li>
        <p class="text-h5 my-2">{{ $t("questions.what-sleep.question") }}</p>
        <p>{{ $t("questions.what-sleep.answer") }}</p>

        <v-divider class="my-4" />
      </li>
      <li>
        <p class="text-h5 my-2">{{ $t("questions.what-eat.question") }}</p>
        <p>{{ $t("questions.what-eat.answer") }}</p>

        <v-divider class="my-4" />
      </li>

      <li>
        <p class="text-h5 my-2">{{ $t("questions.what-wear.question") }}</p>
        <p>{{ $t("questions.what-wear.answer") }}</p>

        <v-divider class="my-4" />
      </li>
      <li>
        <p class="text-h5 my-2">{{ $t("questions.gifts.question") }}</p>
        <p>{{ $t("questions.gifts.answer") }}</p>

        <v-divider class="my-4" />
      </li>
      <li>
        <p class="text-h5 my-2">{{ $t("questions.cannot-attend.question") }}</p>
        <p>{{ $t("questions.cannot-attend.answer") }}</p>

        <v-divider class="my-4" />
      </li>
      <li>
        <p class="text-h5 my-2">{{ $t("questions.helping.question") }}</p>
        <p>{{ $t("questions.helping.answer") }}</p>

        <v-divider class="my-4" />
      </li>
      <li>
        <p class="text-h5 my-2">{{ $t("questions.more.question") }}</p>
        <p>{{ $t("questions.more.answer") }}</p>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
ul {
  list-style: none;
}
</style>
