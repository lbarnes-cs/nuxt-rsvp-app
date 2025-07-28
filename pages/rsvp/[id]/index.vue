<!-- pages/rsvp/[id]/index.vue -->
<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card theme="light" :loading="isLoading">
          <invite-banner :guests="invite?.guests" />

          <template v-if="!isLoading">
            <v-card-title class="mt-4">
              {{ $t('invite.dear', { guests: inviteName }) }},
            </v-card-title>

            <card-upload-photos
              v-if="invite.shared_photos_link"
              class="mx-4 mb-4"
              :shared-link="invite.shared_photos_link"
            />

            <card-timeline
              v-if="invite.first_replied"
              :invite="invite"
              class="mx-4"
            />

            <v-card-text v-if="invite" class="text-body-1">
              <p class="mb-4">
                {{ $t('invite.intro') }}
              </p>

              <!-- Render standard sections dynamically -->
              <template v-for="(section, key) in sections" :key="key">
                <p class="font-weight-bold mt-4">
                  {{ $rt(section.title) }}
                </p>

                <i18n-t
                  :keypath="`invite.sections.${key}.text`"
                  tag="p"
                  scope="global"
                >
                  <template
                    v-for="slot in getSectionSlots($rt(key))"
                    :key="slot.key"
                    #[$rt(slot.key)]
                  >
                    <a
                      :href="getSectionHref(slot)"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="app-link"
                    >
                      {{ $rt(slot.text) }}
                    </a>
                  </template>
                </i18n-t>

                <!-- Optional list (e.g. packing) -->
                <ul v-if="section.list" class="pt-2 pb-4 pl-8">
                  <li v-for="(item, i) in section.list" :key="i">
                    {{ $rt(item) }}
                  </li>
                </ul>
              </template>

              <!-- Outro and Signature -->
              <p class="mb-4">
                {{ $t('invite.outro') }}
              </p>

              <p>
                {{ $t('invite.regards') }},
                <br />
                <span class="text-h6 secondary-font">
                  {{ personA.fullName }} {{ $t('and') }} {{ personB.fullName }}
                </span>
              </p>
            </v-card-text>

            <v-card-actions>
              <v-btn
                color="secondary"
                :to="
                  localePath({
                    name: 'index',
                  })
                "
              >
                {{ $t('invite.respondLater') }}
              </v-btn>

              <v-spacer />

              <v-btn
                :to="
                  localePath({
                    name: 'rsvp-id-edit',
                    params: { id: inviteId },
                  })
                "
                color="primary"
              >
                {{ $t('invite.submitRSVP') }}
              </v-btn>
            </v-card-actions>
          </template>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  import { useRoute } from 'vue-router';
  import { createError } from '#app';

  import type { InviteType } from '@/types/invite';

  import { useFormatGuestNames } from '@/composables/useFormatGuestNames';
  import { useRsvpInviteLocale } from '@/composables/useRsvpInviteLocale';

  import { personA, personB } from '@/constants/people';

  import inviteBanner from '@/components/invite-banner.vue';
  import cardUploadPhotos from '@/components/card-upload-photos.vue';

  // Useful code
  const route = useRoute();
  const localePath = useLocalePath();
  const { t } = useI18n();

  const { sections, getSectionSlots, getSectionHref } = useRsvpInviteLocale();

  // Retrieve inviteId from the URL
  const inviteId = route.params.id as string | undefined;

  // Set the states
  const isLoading = ref(true);
  const invite = ref<InviteType>({} as InviteType);

  // Fetch invite data with error handling
  const { data: inviteData, error: inviteError } =
    await useAsyncData<InviteType>('inviteData', () =>
      $fetch(`/api/invite/${inviteId}`),
    );

  if (inviteError.value) {
    const nuxtError = createError({
      statusCode: 404,
      statusMessage: t('error-state.invite-get.title'),
      message: `<p>${t('error-state.invite-get.message')}</p><p class="mt-4 font-italic">Message: ${inviteError.value}</p>`,
    });

    useError().value = nuxtError;
    throw nuxtError;
  }

  invite.value = inviteData.value as InviteType;
  isLoading.value = false;

  // Computed guest names string
  const inviteName = computed(
    () => useFormatGuestNames(invite.value?.guests).value,
  );

  // SEO meta
  useSeoMeta({
    title: 'RSVP',
    description: () =>
      t('home.rsvpSeoDescription', {
        personA: personA.firstName,
        personB: personB.firstName,
      }),
    ogDescription: () =>
      t('home.rsvpSeoDescription', {
        personA: personA.firstName,
        personB: personB.firstName,
      }),
  });
</script>
