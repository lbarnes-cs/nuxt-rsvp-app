// composables/useRsvpInviteLocale.ts
import { computed } from 'vue';
import type { InviteSection, LinkItem } from '@/types/inviteLocale';

import { PAYPAL_LINK, VENUE_GOOGLE_MAPS } from '@/constants/links';
import { personA, personB } from '@/constants/people';
import { eventInfo } from '@/constants/event';

import { useDateFormatter } from '@/composables/useDateFormatter';
import { useFormatGuestNames } from '@/composables/useFormatGuestNames';

export function useRsvpInviteLocale() {
  const { t, tm, rt } = useI18n();
  const { formatDate } = useDateFormatter();

  // Localized invite sections (with links etc)
  const sections = computed<Record<string, InviteSection>>(
    () => tm('invite.sections') as Record<string, InviteSection>,
  );

  /**
   * Returns an array of link objects for a given section.
   * Supports both array or single link object.
   */
  function getSectionSlots(sectionKey: string): LinkItem[] {
    const key = String(sectionKey);
    const section = sections.value?.[key];

    if (!section?.slots) return [];

    return Array.isArray(section.slots) ? section.slots : [section.slots];
  }

  // Map of keys (from i18n) to actual URLs/constants
  const LINKS_MAP: Record<string, string> = {
    PAYPAL_LINK,
    VENUE_GOOGLE_MAPS,
    // add more as needed
  };

  /**
   * Get the href for a given slot item.
   * If link.key matches a known constant, return that URL.
   * Otherwise fallback to link.url.
   */
  function getSectionHref(link: LinkItem): string {
    // rt() resolves the i18n key if present, else empty string
    const resolvedValue = rt(link.value || '');

    // Check if resolvedValue matches a constant key in LINKS_MAP
    if (resolvedValue && LINKS_MAP[resolvedValue]) {
      return LINKS_MAP[resolvedValue];
    }

    // Otherwise resolve link.url or fallback empty string
    return rt(link.url || '');
  }

  function formatSectionText(sectionKey: string): string {
    const section = sections.value[sectionKey];
    if (!section) return '';

    // Declare the empty list
    let listText = '';
    // Declare the empty props object
    const slotProps: Record<string, string> = {};

    // Format the title of the section
    const title = '[strong]' + rt(section.title) + '[/strong]';

    // Get the props assoicated to the slot
    for (const slot of getSectionSlots(rt(sectionKey))) {
      const href = getSectionHref(slot);
      slotProps[rt(slot.key)] = `[url]${href}|${rt(slot.text)}[/url]`;
    }

    // Propagate the props into the text
    const text =
      typeof section.text === 'string'
        ? section.text
        : rt(section.text, slotProps);

    if (Array.isArray(section.list)) {
      listText = '[ul]';
      listText += section.list
        .map((item: string) => `[li]${rt(item)}`)
        .join('[/li]');
      listText += '[/ul]';
    }
    return [title, `[p]${text}[/p]`, listText].filter(Boolean).join('');
  }

  function getEventDescription(invite): string {
    return `[h2]${t('calendar.eventDescription', {
      personA: personA.fullName,
      personB: personB.fullName,
    })}[/h2]Staying at ${eventInfo.venueName}, [url]${eventInfo.address.googleMapUrl}|${eventInfo.address.fullAddress}[/url].[ul][li]Arriving on ${formatDate(new Date(invite.arrival_date!))}[/li][li]Leaving on ${formatDate(new Date(invite.departure_date!))}[/li][/ul][h3]${t('invite.hello', { guests: useFormatGuestNames(invite?.guests).value })}[/h3][p]${t('invite.intro')}[/p]${formatSectionText('travel')}${formatSectionText('meals')}${formatSectionText('reception')}${formatSectionText('gifts')}${formatSectionText('packing')}`;
  }

  return {
    sections,
    getSectionSlots,
    getSectionHref,
    getEventDescription,
  };
}
