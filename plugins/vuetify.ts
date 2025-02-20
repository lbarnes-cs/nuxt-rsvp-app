import "vuetify/styles";
// import "@/assets/styles/vuetify.scss";
import { createVuetify } from "vuetify";

import "@mdi/font/css/materialdesignicons.css";

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    // ... your configuration
    ssr: true,
    icons: {
      defaultSet: "mdi", // Set default icon pack to Material Design Icons
    },
    theme: {
      defaultTheme: "light",
      themes: {
        light: {
          variables: {
            fontPrimary: "'Roboto', sans-serif",
            fontSecondary: "'Tangerine', cursive",
          },
        },
      },
    },
    defaults: {
      VTextField: {
        variant: "solo-filled",
      },
      VSelect: {
        variant: "solo-filled",
      },
      VTextarea: {
        variant: "solo-filled",
      },
      VDateInput: {
        variant: "solo-filled",
      },
      VAutocomplete: {
        variant: "solo-filled",
      },
      VContainer: {
        maxWidth: "960px", // Set the max-width globally for VContainer
      },
    },
  });

  app.vueApp.use(vuetify);
});
