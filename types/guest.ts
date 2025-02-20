export type GuestCreationType = {
  first_name: string | null;
  last_name: string | null;
  is_attending: boolean | null;
};

export type GuestType = GuestCreationType & {
  id?: number;
  invite_id: string;
  first_name: string;
  last_name: string;
  is_attending: boolean;
  full_name?: string;
};
