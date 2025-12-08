export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Redirect www to non-www
    if (url.hostname === 'www.noslopgrenade.com') {
      return Response.redirect(`https://noslopgrenade.com${url.pathname}${url.search}`, 301);
    }

    // Pass through to static assets
    return fetch(request);
  }
}
