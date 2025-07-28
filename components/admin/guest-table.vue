<template>
  <v-data-table
    :headers="guestHeaders"
    :items="guests"
    class="elevation-1 bg-blue-grey-lighten-5 my-2 w-100"
    density="compact"
    hide-default-footer
  >
    <template #top>
      <v-toolbar density="compact" flat color="blue-grey-lighten-3">
        <v-toolbar-title>Guest Information</v-toolbar-title>
      </v-toolbar>
    </template>

    <!-- Customize Guest Table Content -->
    <template #item.is_attending="{ item }: { item: GuestType }">
      <v-chip :color="item?.is_attending ? 'green' : 'red'" density="compact">
        {{ item.is_attending ? 'Attending' : 'Not Attending' }}
      </v-chip>
    </template>
  </v-data-table>
</template>

<script lang="ts" setup>
  import type { DataTableHeaderType } from '@/types/dataTableHeaders';
  import type { GuestType } from '@/types/guest';

  defineProps<{ guests: GuestType[] }>();

  // Sub-table headers
  const guestHeaders = ref<DataTableHeaderType[]>([
    { title: 'ID', key: 'id' },
    { title: 'First Name', key: 'first_name' },
    { title: 'Last Name', key: 'last_name' },
    { title: 'Attending', key: 'is_attending' },
    { title: 'Order', key: 'order' },
  ]);
</script>
