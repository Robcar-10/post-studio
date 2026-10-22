export async function aiComplete(prompt: string, opts: { model?: string; maxTokens?: number } = {}): Promise<string> {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, ...opts }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "AI request failed");
  }
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.text as string;
}
