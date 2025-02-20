declare module "vuetify/lib/composables/goto" {
  export interface InternalGoToOptions {
    path: string;
    container?: string | HTMLElement;
    duration?: number;
    easing?: string;
    offset?: number;
  }

  export function useGoto(): (options: InternalGoToOptions) => void;
}
