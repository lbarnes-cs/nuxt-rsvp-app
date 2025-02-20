<template>
  <client-only>
    <v-autocomplete
      v-model="selectedGuests"
      :items="guestSearchList"
      :loading="isLoading"
      label="Search Guests"
      density="comfortable"
      hide-details="auto"
      clearable
      item-title="full_name"
      item-value="id"
      chips
      closable-chips
      multiple
      max-width="460"
      return-object
    >
      <template v-slot:chip="{ props, item }">
        <v-chip v-bind="props" :text="item.raw?.full_name"></v-chip>
      </template>
    </v-autocomplete>
  </client-only>
</template>

<script lang="ts" setup>
import { ref, defineEmits, defineExpose, computed, onMounted } from "vue";

import type { GuestType } from "@/types/guest";

const props = defineProps<{
  modelValue: GuestType[]; // Binds selected guests from parent
}>();

const emit = defineEmits(["update:modelValue"]); // Emits selection changes

const isLoading = ref(false);
const guestSearchList = ref<GuestType[]>([]);

const selectedGuests = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

/**
 * Fetch the list of guests from the API
 */
const fetchGuests = async () => {
  isLoading.value = true;

  try {
    guestSearchList.value = await $fetch("/api/guests/");
  } catch (error: any) {
    console.error(`Error getting list of Guests ${error}`);
  }

  isLoading.value = false;
};

onMounted(() => {
  fetchGuests();
});

// Expose the fetch function so the parent can call it
defineExpose({ fetchGuests });
</script>
