<template>
  <v-dialog v-model="localDisplayDialog" max-width="400" persistent>
    <v-card prepend-icon="mdi-update">
      <template v-slot:title> Reset invite </template>

      <v-divider></v-divider>

      <v-card-text>
        <p class="mb-2">Are you sure you want to reset the invite?</p>

        <p>
          This will remove the saved data of attending, notes, and date-stamps.
        </p>
      </v-card-text>

      <template v-slot:actions>
        <v-btn
          :disabled="isLoading"
          class="ms-auto"
          text="Cancel"
          color="primary"
          @click="closeDialog"
        ></v-btn>

        <v-spacer />

        <v-btn
          :loading="isLoading"
          class="ms-auto"
          text="Confirm reset"
          color="error"
          @click="confirmReset"
        ></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
const props = defineProps({
  displayDialog: {
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (e: "update:displayDialog", value: boolean): void;
  (e: "closeDialog"): void;
  (e: "confirmReset"): void;
}>();

// Local state to bind with the dialog
const localDisplayDialog = ref<boolean>(false);

// Watch for the incoming modelValue and update local state
watch(
  () => props.displayDialog,
  (newVal) => {
    localDisplayDialog.value = newVal;
  }
);

// Watch for changes to localDisplayDialog and emit the update
watch(localDisplayDialog, (newVal) => {
  emit("update:displayDialog", newVal);
});

const closeDialog = () => {
  emit("closeDialog");
};

const confirmReset = () => {
  emit("confirmReset");
};
</script>
