# HistoryAxis

HistoryAxis is a React + TypeScript timeline app for browsing major periods of Chinese history on a single horizontal axis. The interface is optimized for classroom review and keyboard navigation.

## Features

- Continuous timeline from early human activity to the present
- Era labels, event markers, and institutional topics
- Left and right arrow key navigation
- Static deployment with Vite and GitHub Pages

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- pnpm

## Development

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
pnpm preview
```

## Deployment

The repository includes a GitHub Actions workflow that builds the project on every push to `main` and deploys `dist/` to GitHub Pages.

For the site to publish correctly in GitHub:

1. Open the repository settings.
2. Go to `Pages`.
3. Set `Source` to `GitHub Actions`.

The Vite `base` path is configured for the repository name `HistoryAxis`, so the site will be served under `/HistoryAxis/`.

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE).
