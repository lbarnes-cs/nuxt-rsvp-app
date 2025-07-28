export interface LinkItem {
  key: string;
  url?: string;
  value?: string;
  text: string;
}

export interface InviteSection {
  title: string;
  text: string;
  list?: string[];
  slots?: LinkItem | LinkItem[];
}
