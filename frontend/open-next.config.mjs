// open-next.config.mjs
export default {
  buildCommand: "npm run build",
  output: "cloudflare",
  experimental: {
    disableDynamoDB: true,
    disableIncrementalCache: true,
    disableTagCache: true,
  },
};
