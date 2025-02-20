<template>
  <v-pull-to-refresh
    :pull-down-threshold="pullDownThreshold"
    @load="handleRefetchingLists"
  >
    <v-container :fluid="mdAndUp" max-width="100%"
      ><v-row
        ><v-col>
          <v-data-table
            v-model:expanded="expanded"
            :items="filteredItems"
            :headers="headers"
            :mobile="!mdAndUp"
            :density="mdAndUp ? 'default' : 'compact'"
            :loading="isLoading"
            :items-per-page="mdAndUp ? 25 : 10"
            item-value="id"
            class="elevation-4"
            show-expand
            v-model:sort-by="sortBy"
          >
            <!-- Loading state -->
            <template v-slot:loading>
              <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
            </template>

            <!-- Footer -->
            <template v-slot:footer.prepend>
              <v-btn
                color="primary"
                class="ml-2 mb-4 mb-sm-0"
                @click="openCreateDialog"
              >
                Create New Invite
              </v-btn>
              <v-spacer />
            </template>

            <!-- Top Bannner -->
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title class="flex-sm-0-0 mr-2">
                  Invite Summary
                </v-toolbar-title>

                <v-chip color="primary">
                  <span class="hidden-sm-and-down mr-1">Confirmed:</span>
                  {{ invitesData?.totalAttendingGuests }}</v-chip
                >

                <v-spacer />

                <search-guests
                  v-model="filteredByGuests"
                  ref="searchGuestsRef"
                />

                <action-item
                  tooltip-text="Reload list"
                  icon="mdi-reload"
                  className="ml-2"
                  size="default"
                  tooltip-location="bottom"
                  @click="handleRefetchingLists"
                />
              </v-toolbar>
            </template>

            <!-- Action Items -->
            <template v-slot:item.actions="{ item }: TableItemType">
              <action-item
                tooltip-text="Copy RSVP Link"
                icon="mdi-content-copy"
                @click="copyRSVPUrl(item)"
              />

              <action-item
                tooltip-text="Reset RSVP data"
                icon="mdi-reload-alert"
                @click="confirmResetRSVP(item)"
              />

              <action-item
                tooltip-text="Edit Invite"
                icon="mdi-pencil"
                @click="openEditDialog(item)"
              />
            </template>

            <template #item.id="{ item }: TableItemType">
              <nuxt-link
                :to="
                  localePath({
                    name: 'rsvp-id',
                    params: { id: item.id },
                  })
                "
                class="app-link"
                >{{ item.id }}</nuxt-link
              >
            </template>

            <template #item.guests_summary="{ item }: TableItemType">
              <span v-if="item.guests[0]">
                {{ item.guests[0].first_name }} {{ item.guests[0].last_name }}
              </span>
              <span v-else>N/A</span>
            </template>

            <template #item.additional_notes="{ item }: TableItemType">
              {{ item.additional_notes || "No notes" }}
            </template>

            <template
              #item.accommadation_arrival_date="{ item }: TableItemType"
            >
              {{ formatDate(item.accommadation_arrival_date) }}
            </template>

            <template #item.accommadation_leave_date="{ item }: TableItemType">
              {{ formatDate(item.accommadation_leave_date) }}
            </template>

            <template #item.first_replied="{ item }: TableItemType">
              {{ formatDate(item.first_replied) }}
            </template>

            <template #item.update_timestamp="{ item }: TableItemType">
              {{ formatDate(item.update_timestamp) }}
            </template>

            <template #item.guest_count="{ item }: TableItemType">
              <v-chip>{{ item.guest_count }}</v-chip>
            </template>

            <template #item.is_any_guest_attending="{ item }: TableItemType">
              <v-chip
                :color="item.is_any_guest_attending ? 'success' : 'error'"
                >{{ item.is_any_guest_attending }}</v-chip
              >
            </template>

            <template #item.has_submitted_rsvp="{ item }: TableItemType">
              <v-chip :color="item.has_submitted_rsvp ? 'success' : 'error'">{{
                item.has_submitted_rsvp
              }}</v-chip>
            </template>

            <template #item.shared_photos_link="{ item }: TableItemType">
              <a
                v-if="item.shared_photos_link"
                :href="item.shared_photos_link"
                target="_blank"
                class="app-link"
                ><v-icon>mdi-image-multiple-outline</v-icon></a
              >
              <span v-else>No album</span>
            </template>

            <!-- Expandable Row Content -->
            <template
              v-slot:expanded-row="{
                columns,
                item,
              }: {
                columns: any,
                item: InviteAdminType,
              }"
            >
              <tr>
                <td :colspan="columns.length">
                  <p>
                    First Replied: {{ item.first_replied || "Not replied" }}
                  </p>
                  <p>Last updated: {{ item.update_timestamp || "N/A" }}</p>
                </td>
              </tr>
              <tr>
                <td :colspan="columns.length">
                  <v-data-table
                    :headers="guestHeaders"
                    :items="item.guests"
                    hide-default-footer
                    class="elevation-1"
                    density="compact"
                  >
                    <template v-slot:top>
                      <v-toolbar density="compact" flat>
                        <v-toolbar-title>Guest Information</v-toolbar-title>
                      </v-toolbar>
                    </template>

                    <!-- Customize Guest Table Content -->
                    <template
                      #item.is_attending="{ item }: { item: GuestType }"
                      v-if="isSupported"
                    >
                      <v-chip
                        :color="item?.is_attending ? 'green' : 'red'"
                        dark
                        small
                      >
                        {{ item.is_attending ? "Attending" : "Not Attending" }}
                      </v-chip>
                    </template>
                  </v-data-table>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-col>
      </v-row>

      <!-- Create / Edit Invite Dialog -->

      <invite-form-dialog
        v-if="showFormDialog"
        v-model:showDialog="showFormDialog"
        :invite-prop="selectedInvite"
        @savedInvite="handleSaveInvite"
      />

      <!-- Confirm Reset Invite Dialog -->
      <confirm-reset-dialog
        v-model:displayDialog="displayResetDialog"
        :is-loading="isLoading"
        @closeDialog="closeConfirmDialog"
        @confirmReset="handleResetRSVP"
      />
    </v-container>
  </v-pull-to-refresh>
</template>

<script lang="ts" setup>
import { VPullToRefresh } from "vuetify/labs/VPullToRefresh";

import { ref } from "vue";
import { useClipboard } from "@vueuse/core";
import { useDisplay } from "vuetify";
import { format } from "date-fns";
import { createError } from "#app";

import type { InviteAdminType, InviteCreationType } from "@/types/invite.ts";
import type { GuestType } from "@/types/guest";

import { useAdminInviteActions } from "@/composables/useAdminInviteActions";

import confirmResetDialog from "@/components/admin/confirm-reset-dialog.vue";
import actionItem from "@/components/action-item.vue";
import searchGuests from "@/components/search-guests.vue";
import inviteFormDialog from "@/components/admin/invite-form-dialog.vue";

type TableItemType = {
  item: InviteAdminType;
};

// Define the custom type for headers
type DataTableHeader = {
  key: string;
  title: string;
  align?: "start" | "center" | "end";
  sortable?: boolean;
  value?: string;
  width?: string | number | undefined;
  children?: DataTableHeader[];
};

type InvitePayloadType = {
  invitesWithGuests: InviteAdminType[];
  totalAttendingGuests: number;
};

type SortByType = { key: string; order?: boolean | "asc" | "desc" };

const localePath = useLocalePath();
const { mdAndUp } = useDisplay();
const { isSupported } = useClipboard();

const {
  copyRSVPUrl,
  confirmResetRSVP,
  closeConfirmDialog,
  resetRSVP,
  displayResetDialog,
} = useAdminInviteActions();

// Form Dialog
const showFormDialog = ref(false);
const selectedInvite = ref<InviteAdminType | null>(null);

// Open Create Dialog
const openCreateDialog = () => {
  selectedInvite.value = null;
  showFormDialog.value = true;
};

// Open Edit Dialog
const openEditDialog = (invite: InviteAdminType) => {
  selectedInvite.value = { ...invite };
  showFormDialog.value = true;
};

// Handle Saving Invite (Create or Edit)
const handleSaveInvite = async (
  inviteData: InviteAdminType | InviteCreationType
) => {
  if (selectedInvite.value) {
    // Edit Mode: Update existing invite
    console.log("Edit mode", inviteData);
  } else {
    // Create Mode: Add new invite
    console.log("Create mode", inviteData);
  }

  showFormDialog.value = false;
  refetchInvites(); // Refresh data
};

// Pulldown threshold
const pullDownThreshold = ref(46);

// Table settings
const expanded = ref([]);
const sortBy = ref<SortByType[]>([
  { key: "has_submitted_rsvp", order: "desc" },
  { key: "update_timestamp", order: "desc" },
]);

// Search by guests
const filteredByGuests = ref<GuestType[]>([]); // Stores selected guests
const searchGuestsRef = ref<InstanceType<typeof searchGuests> | null>(null);

// Loading state
const isLoading = computed(() => invitesStatus.value === "pending");

// Fetch the invite API
const {
  data: invitesData,
  error: inviteError,
  refresh: refetchInvites,
  status: invitesStatus,
} = await useAsyncData<InvitePayloadType>("invitesData", () =>
  $fetch(`/api/invite/`)
);

// Handle errors from API fetch
if (inviteError.value) {
  const nuxtError = createError({
    statusCode: 404,
    statusMessage: "Failed to get list of invites 😢",
    message: `<p>There has been an issue finding the invitation.</p> <p class="mt-4 font-italic">Message: ${inviteError.value}</p>`,
  });
  useError().value = nuxtError; // Make sure the error is properly handled
  throw nuxtError;
}

// Table headers
const headers = ref<DataTableHeader[]>([
  { title: "ID", key: "id" },
  { title: "Invitee", key: "guests_summary", sortable: false },
  { title: "Guest Count", key: "guest_count", align: "start" },
  { title: "Submitted RSVP", key: "has_submitted_rsvp" },
  { title: "Is Attending", key: "is_any_guest_attending", align: "start" },
  { title: "Arrival Date", key: "accommadation_arrival_date" },
  { title: "Leave Date", key: "accommadation_leave_date" },
  { title: "Additional Notes", key: "additional_notes" },
  {
    title: "Shared Album",
    key: "shared_photos_link",
    sortable: false,
    align: "center",
  },
  {
    title: "Actions",
    key: "actions",
    sortable: false,
    align: "center",
    width: 152,
  },
]);

// Sub-table headers
const guestHeaders = ref<DataTableHeader[]>([
  { title: "ID", key: "id" },
  { title: "First Name", key: "first_name" },
  { title: "Last Name", key: "last_name" },
  { title: "Attending", key: "is_attending" },
  { title: "Order", key: "order" },
]);

const filteredItems = computed(() => {
  if (!filteredByGuests.value.length)
    return invitesData.value?.invitesWithGuests;

  const selectedInviteIds = new Set(
    filteredByGuests.value.map((g: GuestType) => g.invite_id)
  );

  return invitesData.value?.invitesWithGuests.filter(
    (invite: InviteAdminType) => selectedInviteIds.has(invite.id!)
  );
});

const handleResetRSVP = async () => {
  await resetRSVP();
  await handleRefetchingLists();
};

/**
 * Formats a date string into a readable format.
 * @param date The date string or null
 */
const formatDate = (date: Date | string | null): string => {
  return date ? format(new Date(date), "yyyy-MM-dd") : "N/A";
};

/**
 * Unified refetch function between v-pull-to-refetch and click handler
 * @param event
 */
const handleRefetchingLists = async (event?: { done?: () => void }) => {
  try {
    await Promise.all([refetchInvites(), searchGuestsRef.value?.fetchGuests()]);
  } catch (error) {
    console.error("Error refreshing data:", error);
  } finally {
    event?.done?.();
  }
};

useSeoMeta({
  title: () => "Admin",
});

/**
 * As we are using Vuetify's v-pull-to-refresh,
 * we don't want to use the default browser behavour to
 * pull to refresh. But we only want to apply this to the
 * admin's index page.
 */
useHead({
  style: [
    {
      children: `
        html {
          overflow: hidden;
          overscroll-behavior: none;
        }
      `,
    },
  ],
});
</script>

<style lang="scss" scoped>
.hover-fade {
  transition: color ease-in-out 200ms;
}
</style>
