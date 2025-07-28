// Define the custom type for headers
export type DataTableHeaderType = {
  key: string;
  title: string;
  align?: 'start' | 'center' | 'end';
  sortable?: boolean;
  value?: string;
  width?: string | number | undefined;
  children?: DataTableHeaderType[];
};
