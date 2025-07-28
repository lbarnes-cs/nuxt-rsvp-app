# ✨ Event Info & RSVP Web App (Code Review)

> ⚠️ This project is intended for **code review purposes only**.  
> It is not configured to run out of the box, as it requires a Supabase backend with specific tables and environment variables.  
> If you’re reviewing the code, feel free to explore the logic, structure, and components without needing to run it locally.

---

## ✨ Overview

A modern, internationalized Nuxt 3 web app designed for sharing event details and collecting user responses. Built with Supabase, Vuetify, and Playwright, the project demonstrates a clean architecture, internationalization, and a performant frontend.

---

## 🙌 About

This is a pet project build to help a friend run a small event. I have created a public copy to be used to beportfolio-ready demonstration of a modern Vue/Nuxt 3 frontend stack — showcasing best practices for routing, localization, testing, and external service integration.

---

## 🚀 Features

- **Nuxt 3**: Modern app framework with hybrid rendering and file-based routing
- **Vuetify 3**: Material Design UI system with tree-shaking enabled for optimized bundle size
- **Supabase Integration**: Stores RSVP data and enables server-side interaction via Nuxt API routes
- **Server API Routes**: All backend communication is handled through Nuxt’s server routes, keeping secrets out of the frontend and logic in one place
- **i18n Support**: Locale is automatically detected from the user's browser and redirects to the appropriate translation
- **Admin Dashboard**:
  - View RSVP records
  - Create new entries
  - Summarize expected attendance by timeframe
- **Playwright Testing**: Automated E2E tests for key user flows

---

## 🧩 Architecture Notes

All backend logic is handled using Nuxt 3’s built-in server API routes. This allows the frontend to communicate securely with Supabase without exposing any keys to the client.

Benefits of this approach include:

- Keeping backend logic centralized and easy to maintain
- Avoiding the need for a separate backend service
- Laying the foundation for future improvements like:
  - Input validation
  - Rate-limiting
  - JWT-based write protection

---

## 🌍 Internationalization

The app uses Vue I18n with automatic locale detection via the browser's `navigator.language`.

**Supported languages:**

- English (`en`)
- French (`fr`)
- German (`de`)
- Italian (`it`)
- Polish (`pl`)

---

## 🧪 Testing

End-to-end tests are written with **Playwright** and cover:

- Page access and rendering
- Locale redirection logic
- RSVP form validation and submission

Run End-to-End tests with:

```bash
pnpm test:e2e
```

Run unit tests with:

```bash
pnpm test:unit
```

---

## 🛠 Tech Stack

| Purpose              | Tool/Library                              |
| -------------------- | ----------------------------------------- |
| Framework            | [Nuxt 3](https://nuxt.com)                |
| UI Library           | [Vuetify 3](https://vuetifyjs.com)        |
| Backend-as-a-Service | [Supabase](https://supabase.com)          |
| Localization (i18n)  | [Vue I18n](https://vue-i18n.intlify.dev/) |
| Testing              | [Playwright](https://playwright.dev/)     |
| Build Tool           | [Vite](https://vitejs.dev/)               |

---

## 🔐 Security (Planned)

In a future iteration, write operations (e.g. form submissions) will be secured using **JWT tokens** issued by Supabase Auth.

---

## 📌 Roadmap

- [x] Supabase integration (read/write)
- [x] Internationalization (i18n) with locale detection
- [x] Vuetify + tree-shaking
- [x] Playwright E2E tests
- [x] Admin section to view & manage RSVPs
- [ ] Add Left Hook and ESLint for pre-commit checks to maintain code quality
- [ ] Finish merger of the consts for the event, this could also be included in a database to manage multiple events
- [ ] Add SSO to admin board
- [ ] JWT-based write protection (planned)
- [ ] Create a dummy supabase database to allow for this project to be run for review

---

## 📄 License

MIT
