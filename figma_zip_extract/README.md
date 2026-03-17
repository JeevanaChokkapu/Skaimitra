# LMS UI Design Showcase

This project is a frontend UI showcase built with React and Vite.

## Project Type

- Frontend only
- Built with `React`
- Bundled with `Vite`
- Styled with project CSS and Tailwind support

## Prerequisites

Before running this project, make sure the following are installed on your machine:

1. `Node.js` version 18 or later
2. `npm` version 9 or later

To check:

```bash
node -v
npm -v
```

## Step-by-Step Setup

### 1. Download or clone the project

If you downloaded the ZIP, extract it first.

If you are using Git:

```bash
git clone <your-repository-url>
```

### 2. Open the project folder

Go to the `figma_zip_extract` folder:

```bash
cd figma_zip_extract
```

### 3. Install dependencies

Run:

```bash
npm install
```

This will download all required packages from `package.json`.

### 4. Start the development server

Run:

```bash
npm run dev
```

After that, Vite will show a local URL, usually:

```bash
http://localhost:5173
```

Open that URL in your browser.

## Build for Production

To create a production build:

```bash
npm run build
```

This will generate the optimized output for deployment.

## Available Scripts

- `npm install` installs all dependencies
- `npm run dev` starts the local development server
- `npm run build` creates the production build

## Project Structure

Important files and folders:

- `src/` main application source code
- `src/app/` app components and routes
- `src/styles/` global styles, fonts, and theme files
- `index.html` Vite entry HTML file
- `vite.config.ts` Vite configuration
- `package.json` project scripts and dependencies

## Troubleshooting

### If `npm install` fails

Try:

```bash
npm cache clean --force
npm install
```

### If `npm run dev` does not start

Check that:

1. `Node.js` is installed correctly
2. You are inside the `figma_zip_extract` folder
3. Dependencies were installed successfully

### If the port is already in use

Vite may suggest another port automatically. Open the new URL shown in the terminal.

## Notes

- This project does not currently require a backend server to run the UI.
- If you want to connect it to an API later, you can add your API configuration separately.

## Attribution

Original design reference:
https://www.figma.com/design/XOOsnT1A0MG20JN0DwgW2n/LMS-UI-Design-Showcase
