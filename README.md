# ✨ Event Info & RSVP Web App

A modern, internationalized Nuxt 3 web app designed for sharing event details and collecting user responses. Built with Supabase, Vuetify, and Playwright, the project demonstrates a clean architecture, internationalization, and a performant frontend.

---

## 🙌 About


This is a pet project build to help a friend run a small event. I have created a public copy to be used to beportfolio-ready demonstration of a modern Vue/Nuxt 3 frontend stack — showcasing best practices for routing, localization, testing, and external service integration.

---

## 🚀 Features

- **Nuxt 3 Framework**: File-based routing, server-side rendering, and hybrid rendering capabilities.
- **Vuetify 3**: Fast development with accessible UI components and tree-shaking for smaller bundle size.
- **Supabase Backend**: Cloud-native backend for storing RSVP responses and event metadata.
- **i18n + Locale Detection**: Automatically detects user locale via user agent and redirects to the appropriate language version (if supported).
- **Playwright E2E Tests**: Robust end-to-end testing of core user flows.
- **Lightweight & Stateless**: No state management library; uses Nuxt composables and Vue’s built-in reactivity.

---

## 🛠 Tech Stack

| Purpose                | Tool/Library             |
|------------------------|--------------------------|
| Framework              | [Nuxt 3](https://nuxt.com) |
| UI Library             | [Vuetify 3](https://vuetifyjs.com) |
| Backend-as-a-Service   | [Supabase](https://supabase.com) |
| Localization (i18n)    | [Vue I18n](https://vue-i18n.intlify.dev/) |
| Testing                | [Playwright](https://playwright.dev/) |
| Build Tool             | [Vite](https://vitejs.dev/) |

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

Run tests with:

```bash
npm run test:e2e
```

---


## 🏗 Development

```
# Install dependencies
npm install

# Run local dev server
npm run dev

# Build for production
npm run build
```

```

## 📌 Roadmap
- [x] Supabase integration (read/write)
- [x] Internationalization (i18n) with locale detection
- [x] Vuetify + tree-shaking
- [x] Playwright E2E tests
- [ ] Admin dashboard for reviewing RSVPs 
- [ ] Add SSO to admin board
- [ ] JWT-based write protection (planned)


---

## 📄 License
MIT