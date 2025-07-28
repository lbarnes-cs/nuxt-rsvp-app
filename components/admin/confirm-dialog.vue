<template>
  <v-dialog v-model="localDisplayDialog" max-width="400" persistent>
    <v-card :prepend-icon="icon" color="red-darken-4">
      <template #title>
        <span class="font-weight-black">
          <slot name="title">
            {{ title }}
          </slot>
        </span>
      </template>

      <v-divider />

      <v-card-text class="bg-surface-light">
        <slot name="text" />
      </v-card-text>

      <v-card-actions class="bg-surface-light">
        <v-btn
          :disabled="isLoading"
          class="ms-auto"
          color="primary"
          @click="updateDialog(false)"
        >
          Cancel
        </v-btn>

        <v-spacer />

        <v-btn
          :loading="isLoading"
          class="ms-auto"
          :color="confirmColor"
          variant="tonal"
          @click="emit('confirmAction')"
        >
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  type PropsType = {
    displayDialog?: boolean;
    isLoading?: boolean;
    confirmText?: string;
    confirmColor?: string;
    icon?: string;
    title?: string;
  };

  const props = withDefaults(defineProps<PropsType>(), {
    displayDialog: false,
    isLoading: false,
    confirmText: 'Confirm',
    confirmColor: 'error',
    icon: 'mdi-alert-circle-outline',
    title: 'Alert',
  });

  const emit = defineEmits<{
    (e: 'update:displayDialog', value: boolean): void;
    (e: 'confirmAction'): void;
  }>();

  // Local state to bind with the dialog
  const localDisplayDialog = computed({
    get: () => props.displayDialog,
    set: (value) => emit('update:displayDialog', value),
  });

  const updateDialog = (value: boolean) => {
    emit('update:displayDialog', value);
  };
</script>
