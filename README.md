# Movie Recommendation App

A modern, responsive web application built with React and TypeScript for discovering and exploring movies. It features user authentication, personalized recommendations, and seamless data fetching from The Movie Database (TMDB) API.

## Tech Stack

- **Frontend Framework:** [React 18](https://reactjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **State Management:** React Context API & useReducer
- **Testing:** [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- **Deployment:** [Vercel](https://vercel.com/) / [Netlify](https://www.netlify.com/)
- **CI/CD:** GitLab CI/CD

## Features

-   **Movie Discovery:** Browse a vast collection of movies.
-   **Advanced Search:** Search for movies by title, genre, or keyword.
-   **Detailed Views:** See comprehensive information about each movie, including title, poster, overview, cast, crew, ratings, etc.
-   **User Authentication:** Mock JWT-based login/logout flow.
-   **Pagination:** Efficiently browse through large lists of movies.
-   **Responsive Design:** Optimized for desktop, tablet, and mobile devices.
-   **Clean & Maintainable Code:** Built with best practices, type safety, and testability in mind.

## Project Structure

src/
├── components/ # Reusable UI components (MovieCard, SearchBar, etc.)
├── contexts/ # React Context providers for global state
├── services/ # API service layer (TMDB client, auth service)
├── types/ # TypeScript type definitions
├── utils/ # Helper functions and utilities
├── tests/ # Unit and integration tests
├── App.tsx
└── main.tsx

## Development

### Prerequisites

-   Node.js (v18 or higher)
-   npm, yarn, or pnpm

### Installation

1.  Clone the repository:
    git clone https://github.com/Arl-Kim/movie-recommendation-app.git
    cd movie-recommendation-app

2.  Install dependencies:
    npm install

3.  Obtain a free API key from [The Movie Database (TMDB)](https://www.themoviedb.org/settings/api).
4.  Create a `.env` file in the root directory and add your key:
    VITE_TMDB_API_KEY=your_api_key_here
    VITE_TMDB_ACCESS_TOKEN=your_read_access_token_here

5.  Start the development server:
    npm run dev

6.  Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available Scripts

-   `npm run dev` - Starts the development server.
-   `npm run build` - Builds the app for production.
-   `npm run preview` - Previews the production build locally.
-   `npm run test` - Runs the test suite.
-   `npm run lint` - Runs ESLint for code linting.

## Default Vite Documentation

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
