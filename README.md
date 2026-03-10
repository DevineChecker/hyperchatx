## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

### Option 2: Cloudflare Pages

1. Connect your GitHub repo to [Cloudflare Pages](https://dash.cloudflare.com/).
2. Configure build settings:
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
   - **Deploy command:** *(leave empty)*
3. Set environment variable: `NODE_VERSION` = `20`
4. Deploy — Cloudflare will build and serve the `dist` folder automatically.

> **Note:** Do not use `npx wrangler deploy` as the deploy command. Cloudflare Pages handles deployment automatically from the build output.
