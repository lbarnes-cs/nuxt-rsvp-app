# ✨ Event Info & RSVP Web App

A modern, internationalized Nuxt 3 web app designed for sharing event details and collecting user responses. Built with Supabase, Vuetify, and Playwright, the project demonstrates a clean architecture, internationalization, and a performant frontend.

---

## 🙌 About

This is a pet project build to help a friend run a small event. I have created a public copy to be used to beportfolio-ready demonstration of a modern Vue/Nuxt 3 frontend stack — showcasing best practices for routing, localization, testing, and external service integration.

---

## 🚀 Features

- **Nuxt 3 Framework**: Full-stack capabilities with file-based routing and hybrid rendering.
- **Vuetify 3**: Material-based design system with accessible, responsive components and tree-shaking.
- **Supabase Integration**: Stores RSVP and form data in a managed Postgres database.
- **Nuxt Server API Endpoints**: Handles all Supabase communication through server routes — keeping secrets safe and enabling backend flexibility.
- **i18n with Locale Detection**: Detects browser language and serves the corresponding localized version.
- **Playwright Testing**: Covers end-to-end functionality including redirection, form submission, and more.
- **Admin Dashboard**: Manage RSVP records, create new entries, and view attendee summaries based on event timeframes.

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

The app detects the user's language using the browser’s user agent and redirects to a matching localized version of the site if available.

**Supported languages:**

- English (`en`)
- French (`fr`)
- German (`de`)
- Italian (`it`)
- Polish (`pl`)

---

## 🔐 Security (Planned)

In a future iteration, write operations (e.g. form submissions) will be secured using **JWT tokens** issued by Supabase Auth.

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

## 🏗 Development

```
# Install dependencies
pnpm install

# Run local dev server
pnpm run dev

# Build for production
pnpm run build
```

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

---

## 📄 License

MIT
