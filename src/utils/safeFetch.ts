export async function safeFetch(url: string, options?: RequestInit) {
  try {
    const res = await fetch(url, options);

    if (!res) throw new Error("No response");

    const text = await res.text();

    if (!text) throw new Error("Empty response");

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("Invalid JSON");
    }

    return { ok: res.ok, data };

  } catch (err) {
    console.error("SAFE FETCH ERROR:", err);
    return { ok: false, data: { error: "Fetch failed" } };
  }
}
