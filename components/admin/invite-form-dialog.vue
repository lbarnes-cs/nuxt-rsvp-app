<template>
  <v-dialog
    :model-value="showDialog"
    :fullscreen="!mdAndUp"
    max-width="800px"
    close-on-back
    persistent
    @update:model-value="emit('update:showDialog', $event)"
  >
    <v-form v-model="isFormValid" @submit.prevent="handleSubmit">
      <v-card class="pa-2">
        <v-card-title class="mt-2 d-flex align-center">
          <span class="text-h5">
            {{ isEditMode ? 'Edit Invite' : 'Create New Invite' }}
          </span>

          <v-spacer />

          <v-btn icon size="small" :disabled="isLoading" @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-container fluid>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="invite.id"
                label="UUID"
                hint="This should already be generated in the spreadsheet"
                :rules="[requiredField, validUUID]"
              >
                <template #append>
                  <v-btn
                    class="mb-1"
                    outlined
                    color="indigo"
                    @click="generateUUIDForInvite"
                  >
                    Generate UUID
                  </v-btn>
                </template>
              </v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="invite.shared_photos_link"
                label="Photo Album"
                prepend-icon="mdi-image-multiple-outline"
                hint="The unique photo album for guests to share photos"
                :rules="[requiredField, validUrl]"
              />
            </v-col>
          </v-row>

          <v-row v-if="invite?.guests">
            <v-col
              v-for="(guest, index) in invite?.guests"
              :key="index"
              class="position-relative"
            >
              <div
                :draggable="areGuestsDraggable"
                @dragstart="onGuestDragStart(index)"
                @dragover.prevent
                @drop="onGuestDrop(index)"
              >
                <v-icon
                  v-if="areGuestsDraggable"
                  class="drag-handle bg-blue-grey-darken-1 rounded-ts-sm rounded-bs-sm position-absolute pa-1"
                  size="small"
                >
                  mdi-reorder-horizontal
                </v-icon>

                <v-card
                  variant="outlined"
                  :class="{ ' overflow-visible': areGuestsDraggable }"
                >
                  <v-card-title class="d-flex">
                    {{ $t('form.guestInformation') }}

                    <v-spacer />

                    <action-item
                      v-if="areGuestsDraggable"
                      tooltip-text="Remove guest"
                      icon="mdi-close"
                      @click="removeGuest(index)"
                    />
                  </v-card-title>

                  <v-card-text>
                    <v-text-field
                      v-model="guest.first_name"
                      :label="$t('form.firstName')"
                    />
                    <v-text-field
                      v-model="guest.last_name"
                      :label="$t('form.lastName')"
                    />

                    <v-btn-toggle
                      v-model="guest.is_attending"
                      color="secondary"
                      variant="outlined"
                      density="comfortable"
                      group
                      mandatory
                    >
                      <v-btn :value="false">
                        {{ $t('form.attending.false') }}
                      </v-btn>

                      <v-btn :value="true">
                        {{ $t('form.attending.true') }}
                      </v-btn>
                    </v-btn-toggle>
                  </v-card-text>
                </v-card>
              </div>
            </v-col>
          </v-row>

          <v-row justify="end">
            <v-col cols="auto">
              <v-btn color="secondary" @click="addGuest">
                <v-icon class="mr-2">mdi-plus</v-icon>
                Add guest
              </v-btn>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-date-input
                v-model="datesStaying"
                :label="$t('form.selectDatesLabel')"
                multiple="range"
                :min="eventInfo.eventDate.minArrivalDate"
                :max="eventInfo.eventDate.maxDepartureDate"
                :month="6"
                :year="2025"
                :hide-actions="false"
                :hint-details="false"
                :hint="$t('form.dateSelectionHint')"
                persistent-hint
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-switch
                v-model="invite.is_arriving_by_train"
                :label="$t('form.arrivingByTrain')"
                inset
                color="primary"
              />
            </v-col>
          </v-row>
        </v-container>

        <v-card-actions>
          <v-btn :disabled="isLoading" color="red" @click="closeDialog">
            Cancel
          </v-btn>
          <v-spacer />

          <v-btn :loading="isLoading" color="primary" type="submit">
            {{ isEditMode ? 'Save Changes' : 'Create Invite' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup lang="ts">
  import { VDateInput } from 'vuetify/labs/VDateInput';
  import { useDisplay } from 'vuetify';

  import { generateUUID } from '@/utils/uuid';

  import { useFormValidation } from '@/composables/useFormValidation';
  import { useInviteManagement } from '@/composables/useInviteManagement';
  import { useSnackbar } from '@/composables/useSnackbar';

  import type { InviteAdminType, InviteType } from '@/types/invite.ts';

  import actionItem from '@/components/admin/action-item.vue';

  import { eventInfo } from '@/constants/event';

  type PropsType = {
    showDialog?: boolean;
    inviteProp?: InviteAdminType | null;
  };

  const props = withDefaults(defineProps<PropsType>(), {
    showDialog: false,
    inviteProp: null,
  });

  const emit = defineEmits(['update:showDialog', 'savedInvite']);

  const { t } = useI18n();
  const { mdAndUp } = useDisplay();
  const { requiredField, validUrl, validUUID } = useFormValidation();
  const { displaySnackbar } = useSnackbar();

  // Guest management
  const {
    invite,
    isFormValid,
    isLoading,
    areGuestsDraggable,
    datesStaying,
    addGuest,
    removeGuest,
    onGuestDragStart,
    onGuestDrop,
    submitInvite,
  } = useInviteManagement();

  const isEditMode = computed(() => !!props.inviteProp);

  watch(
    () => props.inviteProp,
    (newVal: InviteType | null) => {
      invite.value = (newVal as InviteAdminType)
        ? { ...(newVal as InviteType) }
        : { ...invite.value };
    },
    { immediate: true },
  );

  const scrollToFirstError = async () => {
    await nextTick();

    // Find all error inputs
    const errorElements = document.querySelectorAll('.v-input--error');

    if (errorElements.length > 0) {
      const firstErrorElement = errorElements[0] as HTMLElement;

      if (firstErrorElement) {
        // Scroll the error element into view
        firstErrorElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });

        // Apply an offset
        const offset = 24;
        const dialogContent = document.querySelector(
          '.v-dialog .v-card',
        ) as HTMLElement;

        if (dialogContent) {
          dialogContent.scrollTop = firstErrorElement.offsetTop - offset;
        }
      }
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid.value) {
      displaySnackbar({
        message: t('validationRules.requiredAttention'),
        color: 'error',
        timeout: 2000,
      });

      await scrollToFirstError();

      return;
    }

    if ((invite.value?.guests?.length ?? 0) < 1) {
      displaySnackbar({
        message: 'You need at least one guest',
        color: 'error',
      });

      return false;
    }
    try {
      const response = await submitInvite(invite, isEditMode.value);

      if (response) {
        emit('savedInvite');
        closeDialog();
      }
    } catch {
      displaySnackbar({
        message: 'There was an error saving your invite',
        color: 'error',
      });
    }
  };

  const closeDialog = () => {
    emit('update:showDialog', false);
  };

  const generateUUIDForInvite = () => {
    try {
      invite.value.id = generateUUID();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while generating UUID.';

      displaySnackbar({
        message,
        color: 'error',
      });
    }
  };
</script>
