<template>
  <v-pull-to-refresh
    :pull-down-threshold="pullDownThreshold"
    @load="handleRefetchingLists"
  >
    <v-container :fluid="mdAndUp" max-width="100%">
      <v-row>
        <v-col>
          <v-data-table
            v-model:expanded="expanded"
            v-model:sort-by="sortBy"
            :items="filteredItems"
            :headers="headers"
            :mobile="!mdAndUp"
            :density="mdAndUp ? 'default' : 'compact'"
            :loading="isLoading"
            :items-per-page="mdAndUp ? 25 : 10"
            item-value="id"
            class="elevation-4"
            show-expand
            hover
          >
            <!-- Loading state -->
            <template #loading>
              <v-skeleton-loader type="table-row@10" />
            </template>

            <!-- Footer -->
            <template #footer.prepend>
              <v-btn
                color="primary"
                class="ml-2 mb-4 mb-sm-0"
                @click="openDialog('manage')"
              >
                Create New Invite
              </v-btn>
              <v-spacer />
            </template>

            <!-- Top Bannner -->
            <template #top>
              <v-toolbar flat>
                <v-toolbar-title class="flex-sm-0-0 mr-2">
                  Invite Summary
                </v-toolbar-title>

                <v-chip color="primary">
                  <span class="hidden-sm-and-down mr-1">Confirmed:</span>
                  {{ invitesData?.totalAttendingGuests }}
                </v-chip>

                <v-spacer />

                <search-guests
                  ref="searchGuestsRef"
                  v-model="filteredByGuests"
                />

                <action-item
                  tooltip-text="Reload list"
                  icon="mdi-reload"
                  class-name="ml-2"
                  size="default"
                  tooltip-location="bottom"
                  @click="handleRefetchingLists"
                />
              </v-toolbar>
            </template>

            <!-- Action Items -->
            <template #item.actions="{ item }: TableItemType">
              <action-item
                tooltip-text="Copy RSVP Link"
                icon="mdi-content-copy"
                @click="copyRSVPUrl(item)"
              />

              <action-item
                tooltip-text="Reset RSVP data"
                icon="mdi-reload-alert"
                @click="openDialog('reset', item)"
              />

              <action-item
                tooltip-text="Edit Invite"
                icon="mdi-pencil"
                @click="openDialog('manage', item)"
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
              >
                {{ item.id }}
              </nuxt-link>
            </template>

            <template #item.guests_summary="{ item }: TableItemType">
              <span v-if="item.guests[0]">
                {{ item.guests[0].first_name }} {{ item.guests[0].last_name }}
              </span>
              <span v-else>N/A</span>
            </template>

            <template #item.additional_notes="{ item }: TableItemType">
              {{ item.additional_notes || 'No notes' }}
            </template>

            <template #item.arrival_date="{ item }: TableItemType">
              {{ formatDate(item.arrival_date) }}
            </template>

            <template #item.departure_date="{ item }: TableItemType">
              {{ formatDate(item.departure_date) }}
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
              >
                {{ item.is_any_guest_attending }}
              </v-chip>
            </template>

            <template #item.has_submitted_rsvp="{ item }: TableItemType">
              <v-chip :color="item.has_submitted_rsvp ? 'success' : 'error'">
                {{ item.has_submitted_rsvp }}
              </v-chip>
            </template>

            <template #item.is_arriving_by_train="{ item }: TableItemType">
              <v-chip :color="item.is_arriving_by_train ? 'success' : 'error'">
                {{ item.is_arriving_by_train }}
              </v-chip>
            </template>

            <template #item.shared_photos_link="{ item }: TableItemType">
              <a
                v-if="item.shared_photos_link"
                :href="item.shared_photos_link"
                target="_blank"
                class="app-link"
              >
                <v-icon>mdi-image-multiple-outline</v-icon>
              </a>
              <span v-else>No album</span>
            </template>

            <!-- Expandable Row Content -->
            <template
              #expanded-row="{
                columns,
                item,
              }: {
                columns: any;
                item: InviteAdminType;
              }"
            >
              <tr>
                <td :colspan="columns.length" class="px-0">
                  <v-table class="w-100 bg-grey-lighten-5 border-b-lg">
                    <tbody>
                      <tr>
                        <td>First Replied:</td>

                        <td>
                          {{ item.first_replied || "Hasn't RSVPed" }}
                        </td>
                      </tr>

                      <tr>
                        <td>Last updated:</td>

                        <td>
                          {{ item.update_timestamp || 'N/A' }}
                        </td>
                      </tr>

                      <tr>
                        <td colspan="2" class="overflow-y-auto">
                          <guest-table :guests="item.guests" />
                        </td>
                      </tr>

                      <!-- Delete Invite -->
                      <tr>
                        <td colspan="2" class="text-right">
                          <v-btn
                            color="error"
                            @click="openDialog('delete', item)"
                          >
                            <v-icon class="mr-2">mdi-delete</v-icon>
                            Delete Invite
                          </v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>

    <!-- Create / Edit Invite Dialog -->
    <invite-form-dialog
      v-if="dialogs.manage"
      v-model:show-dialog="dialogs.manage"
      :invite-prop="dialogInvite"
      @saved-invite="handleSavedInvite"
    />

    <!-- Confirm Reset Invite Dialog -->
    <confirm-dialog
      v-model:display-dialog="dialogs.reset"
      title="Reset Invite"
      :is-loading="isLoading"
      icon="mdi-update"
      confirm-text="Reset Invite"
      @confirm-action="handleResetRSVP"
    >
      <template #text>
        <p class="mb-2">Are you sure you want to reset the invite?</p>

        <p>
          This will remove the saved data of attending, notes, and date-stamps.
        </p>
      </template>
    </confirm-dialog>

    <!-- Confirm delete RSVP and Guest -->
    <confirm-dialog
      v-model:display-dialog="dialogs.delete"
      :is-loading="isLoading"
      confirm-text="Delete Invite"
      @confirm-action="handleDeleteInvite"
    >
      <template #title>Confirm Delete User</template>

      <template #text>
        <p class="mb-2">
          You will be deleting the invite for {{ firstGuestName }}.
        </p>

        <p>This cannot be reversed. Are you sure?</p>
      </template>
    </confirm-dialog>
  </v-pull-to-refresh>
</template>

<script lang="ts" setup>
  import { VPullToRefresh } from 'vuetify/labs/VPullToRefresh';

  import { ref } from 'vue';
  import { useDisplay } from 'vuetify';
  import { createError } from '#app';

  import type { InviteAdminType } from '@/types/invite.ts';
  import type { GuestType } from '@/types/guest';
  import type { DataTableHeaderType } from '@/types/dataTableHeaders';

  import { useAdminInviteActions } from '@/composables/useAdminInviteActions';
  import { useDateFormatter } from '@/composables/useDateFormatter';

  import actionItem from '@/components/admin/action-item.vue';
  import searchGuests from '@/components/search-guests.vue';
  import inviteFormDialog from '@/components/admin/invite-form-dialog.vue';
  import guestTable from '@/components/admin/guest-table.vue';
  import confirmDialog from '@/components/admin/confirm-dialog.vue';

  type TableItemType = {
    item: InviteAdminType;
  };

  type InvitePayloadType = {
    invitesWithGuests: InviteAdminType[];
    totalAttendingGuests: number;
  };

  type SortByType = { key: string; order?: boolean | 'asc' | 'desc' };

  definePageMeta({
    layout: 'basic',
  });

  const { t } = useI18n();
  const localePath = useLocalePath();
  const { mdAndUp } = useDisplay();

  const {
    dialogs,
    dialogInvite,
    firstGuestName,
    openDialog,
    closeDialog,
    copyRSVPUrl,
    resetRSVP,
    deleteRSVP,
  } = useAdminInviteActions();

  const { formatDate } = useDateFormatter();

  /**
   * Close the dialog window and refresh the list of invites and guests
   * @param inviteData
   */
  const handleSavedInvite = () => {
    closeDialog('manage');
    refetchInvites(); // Refresh data
  };

  // Pulldown threshold
  const pullDownThreshold = ref(46);

  // Table settings
  const expanded = ref([]);
  const sortBy = ref<SortByType[]>([
    { key: 'has_submitted_rsvp', order: 'desc' },
    { key: 'update_timestamp', order: 'desc' },
  ]);

  // Search by guests
  const filteredByGuests = ref<GuestType[]>([]); // Stores selected guests
  const searchGuestsRef = ref<InstanceType<typeof searchGuests> | null>(null);

  // Loading state
  const loading = ref<boolean>(false);
  const isLoading = computed(
    () => loading.value || invitesStatus.value === 'pending',
  );

  // Fetch the invite API
  const {
    data: invitesData,
    error: inviteError,
    refresh: refetchInvites,
    status: invitesStatus,
  } = await useAsyncData<InvitePayloadType>('invitesData', () =>
    $fetch(`/api/invite/`),
  );

  // Handle errors from API fetch
  if (inviteError.value) {
    const handleError = handleApiError(inviteError.value, {
      statusMessage: t('error-state.invite-list-get.title'),
      message: t('error-state.invite-list-get.message'),
    });

    useError().value = handleError;
    throw handleError;
  }

  // Table headers
  const headers = ref<DataTableHeaderType[]>([
    { title: 'ID', key: 'id' },
    { title: 'Invitee', key: 'guests_summary', sortable: false },
    { title: 'Guest Count', key: 'guest_count', align: 'start' },
    { title: 'Submitted RSVP', key: 'has_submitted_rsvp' },
    { title: 'Is Attending', key: 'is_any_guest_attending', align: 'start' },
    { title: 'Arrival Date', key: 'arrival_date' },
    { title: 'Leave Date', key: 'departure_date' },
    { title: 'Additional Notes', key: 'additional_notes' },
    { title: 'Arriving by train', key: 'is_arriving_by_train' },
    {
      title: 'Shared Album',
      key: 'shared_photos_link',
      sortable: false,
      align: 'center',
    },
    {
      title: 'Actions',
      key: 'actions',
      sortable: false,
      align: 'center',
      width: 152,
    },
  ]);

  const filteredItems = computed(() => {
    if (!filteredByGuests.value.length)
      return invitesData.value?.invitesWithGuests;

    const selectedInviteIds = new Set(
      filteredByGuests.value.map((g: GuestType) => g.invite_id),
    );

    return invitesData.value?.invitesWithGuests.filter(
      (invite: InviteAdminType) => selectedInviteIds.has(invite.id!),
    );
  });

  const handleResetRSVP = async () => {
    loading.value = true;
    await resetRSVP();
    closeDialog('reset');
    await handleRefetchingLists();
    loading.value = false;
  };

  const handleDeleteInvite = async () => {
    // TODO: Connect to API to delete guests and invite
    loading.value = true;
    await deleteRSVP();
    closeDialog('delete');
    await handleRefetchingLists();
    loading.value = false;
  };

  /**
   * Unified refetch function between v-pull-to-refetch and click handler
   * @param event
   */
  const handleRefetchingLists = async (event?: { done?: () => void }) => {
    try {
      await Promise.all([
        refetchInvites(),
        searchGuestsRef.value?.fetchGuests(),
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      event?.done?.();
    }
  };

  useSeoMeta({
    title: () => 'Admin',
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
        // @ts-expect-error Ignoring TypeScript error due to the 'rel' property not being recognized in the style tag
        // when using `useHead` for adding custom styles. The error occurs because TypeScript's type
        // definitions do not support the 'rel' property within the 'style' object, even though the code
        // works correctly at runtime. This is a temporary workaround to proceed with the implementation
        // while waiting for a potential fix or a more type-safe solution in the future.
        rel: 'stylesheet',
        type: 'text/css',
        innerHTML: `
        html {
          ${
            !mdAndUp.value ? 'overflow: hidden; overscroll-behavior: none;' : ''
          }
        }
      `,
      },
    ],
  });
</script>
