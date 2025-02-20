import type { GuestType, GuestCreationType } from "./guest";

export type InviteType = {
  id: string; // UUID as string
  guests: GuestType[]; // Guests are of type `GuestType[]` in InviteType
  additional_notes: string | null;
  accommadation_arrival_date: Date | string | null;
  accommadation_leave_date: Date | string | null;
  shared_photos_link: string | null;
  created_at: Date | null;
  first_replied: Date | null;
  update_timestamp: Date | null;
};

// Omit properties from InviteType and ensure guests are typed as `GuestCreationType[]`
export type InviteCreationType = Omit<
  InviteType,
  | "additional_notes"
  | "created_at"
  | "first_replied"
  | "update_timestamp"
  | "guests"
> & {
  guests: GuestCreationType[]; // Ensure guests are typed as `GuestCreationType[]` for creation
};

export type InviteAdminType = InviteType & {
  has_submitted_rsvp: boolean;
  guest_count: number;
  is_any_guest_attending: boolean;
  attending_guest_count: number;
};
