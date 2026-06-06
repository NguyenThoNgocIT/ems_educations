const PAGES_ORIGIN = "https://production.education-ems.pages.dev";
const API_ORIGIN = "https://apiems.ryon.website";
const INSECURE_API_ORIGIN = "http://uems-backend.us-east-1.elasticbeanstalk.com";

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/")) {
      const target = new URL(url.pathname + url.search, API_ORIGIN);
      return fetch(new Request(target, request));
    }

    const target = new URL(url.pathname + url.search, PAGES_ORIGIN);
    const upstreamRequest = new Request(target, request);
    upstreamRequest.headers.set("cache-control", "no-cache");
    const response = await fetch(upstreamRequest, {
      cf: {
        cacheTtl: 0,
        cacheEverything: false,
      },
    });
    const contentType = response.headers.get("content-type") || "";
    const shouldRewrite =
      contentType.includes("text/html") ||
      contentType.includes("javascript") ||
      contentType.includes("text/plain") ||
      url.pathname.endsWith(".js");

    if (shouldRewrite) {
      const headers = new Headers(response.headers);
      headers.delete("content-length");
      headers.set("cache-control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      headers.set("pragma", "no-cache");
      headers.set("expires", "0");
      const body = (await response.text())
        .replaceAll(INSECURE_API_ORIGIN, "")
        .replaceAll(`${INSECURE_API_ORIGIN}/`, "/");
      return new Response(body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }

    return response;
  },
};
