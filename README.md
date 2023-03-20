## Usage

```bash
$ pnpm install
```

## Available Scripts

In the project directory, you can run:

### `pnpm dev` or `pnpm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>

### `pnpm run deploy`

Builds the app, deploys it to AWS S3 (bucket: `neurodeploy-console`), and invalidate old cloudfront distribution!

The website is [https://console.neurodeploy.com](https://console.neurodeploy.com)
