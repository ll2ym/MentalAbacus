# Mental Abacus

![Mental Abacus](public/ico.png)

A fully interactive, visually appealing web application that allows users to solve math equations using an interactive abacus. The application helps users practice mental arithmetic by providing a digital, interactive version of a traditional abacus.

Live Demo: [https://resplendent-boba-cad33f.netlify.app](https://resplendent-boba-cad33f.netlify.app)

## Features

- **Interactive Visual Abacus:** Drag beads manually or enter equations to see the beads move and automatically calculate the value.
- **Math Solver:** Enter an equation using basic arithmetic operators (+, -, *, /) and parentheses to see the final result displayed on the abacus.
- **Mobile Responsive Layout:** Carefully optimized for mobile view with scalable elements and responsive touch constraints.
- **Internationalization (i18n):** Support for multiple languages with a built-in language selector. The app translates interface text dynamically.
- **Physical Stacking Mechanics:** Lower beads accurately enforce real-world physical stacking constraints.

## Tech Stack

- **React** (Frontend Framework)
- **Vite** (Build Tool)
- **Tailwind CSS** (Styling)
- **Express.js** (Backend Framework, API)
- **TypeScript** (Language)
- **Drizzle ORM** (Database interaction, if applicable to future extensions)

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   `npm install`

### Running Locally

To start the local development server:

`npm run dev`

This command will start both the frontend Vite server and the Express backend server concurrently.

### Production Build

To create a production-ready build:

`npm run build`

## Deployment

### Deploying to Render, Heroku, or similar Node.js platforms

This repository contains a fullstack application (Vite + Express). The start command is configured to serve the built frontend via the Express backend.

1. Configure your platform's Build Command to:
   `npm install && npm run build`
2. Configure the Start Command to:
   `npm start`
3. Provide appropriate environment variables if connecting to a database (e.g., `DATABASE_URL`).

### Deploying to Static Hosting (Netlify, Vercel)

If you only wish to deploy the frontend interface (and any backend functionality relies on serverless functions or is unused):

1. **Build Command:** `npm run build`
2. **Publish Directory:** `dist/public`
3. Add a configuration file for rewrites (e.g., `_redirects` for Netlify) to fall back to `index.html` for single-page applications.

## License

Copyright 2026 Masrur Odinaev - [http://www.odinaev.de](http://www.odinaev.de)
