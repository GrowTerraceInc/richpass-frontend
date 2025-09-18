const API = process.env.NEXT_PUBLIC_API_ORIGIN!;

function getXsrfFromCookie() {
  const m = document.cookie.split("; ").find(v => v.startsWith("XSRF-TOKEN="));
  return m ? decodeURIComponent(m.split("=")[1]) : "";
}

export async function ensureCsrf() {
  if (!getXsrfFromCookie()) {
    await fetch(`${API}/sanctum/csrf-cookie`, {
      credentials: "include",
      headers: { Accept: "application/json" },
    });
  }
}

export async function csrfFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  await ensureCsrf();
  const token = getXsrfFromCookie();
  const headers = new Headers(init.headers as HeadersInit);
  headers.set("Accept", "application/json");
  headers.set("X-XSRF-TOKEN", token);
  return fetch(input, { ...init, headers, credentials: "include" });
}
