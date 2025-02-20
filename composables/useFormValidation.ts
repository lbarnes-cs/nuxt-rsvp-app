import type { InviteType } from "@/types/invite";

export function useFormValidation() {
  const { t } = useI18n();

  // Validation Rules
  const requiredField = (value: string): true | string =>
    !!value || t("validationRules.fieldRequired");

  const requiredAttendance = (value: boolean | null): true | string =>
    value !== null || t("validationRules.attendance");

  const validDates = (
    value: Date[] | null,
    inviteData: InviteType | null
  ): true | string => {
    // Check if any guest has selected `is_attending` as true
    const isAnyGuestAttending = inviteData?.guests.some(
      (guest) => guest.is_attending === true
    );

    // If no guest is attending, the date input is not required
    if (!isAnyGuestAttending) {
      return true; // Validation passes without any dates
    }

    // If at least one guest is attending, validate the date input
    return (value && value.length >= 2) || t("validationRules.validDates");
  };

  const validUrl = (value: string | null): true | string => {
    const urlPattern =
      /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;

    return (value && urlPattern.test(value)) || "Please enter a valid URL";
  };

  /**
   * Check to see if a string matches a valid UUID (v4) format
   * https://gist.github.com/johnelliott/cf77003f72f889abbc3f32785fa3df8d
   *
   * @param uuid {string}
   * @returns boolean | string
   */
  const validUUID = (uuid: string): true | string => {
    const uuidV4Regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidV4Regex.test(uuid) || "Please enter a valid UUID";
  };

  return {
    requiredField,
    requiredAttendance,
    validDates,
    validUrl,
    validUUID,
  };
}
