// Free-LLM provider adapter (awesome-freellm-apis): env-keyed primary, keyless fallback.
// LLM_API_KEY / LLM_BASE_URL / LLM_MODEL override; otherwise keyless Pollinations.

const SYSTEM_LEGAL = `تو دستیار حقوقی شریف‌مند هستی — یک وکیل هوشمند فارسی‌زبان.
به سوالات حقوقی کاربر به فارسی پاسخ بده؛ مختصر، دقیق و کاربردی.
اگر پاسخ دقیق نیاز به مطالعه اسناد/قوانین دارد، بگو برای نظر قطعی با وکیل مشورت کند.
هیچ‌وقت خودت را وکیل رسمی معرفی نکن و در پایان یادآوری کن: "این پاسخ جنبه اطلاع‌رسانی دارد و جایگزین مشاوره حقوقی رسمی نیست."`;

async function post(base: string, body: unknown, key?: string, timeoutMs = 25000): Promise<string> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(base, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(key ? { Authorization: `Bearer ${key}` } : {}) },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`llm http ${res.status}`);
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content ?? data?.output_text ?? data?.response ?? "";
    if (!text) throw new Error("llm empty");
    return text;
  } finally {
    clearTimeout(t);
  }
}

export async function askLLM(messages: { role: string; content: string }[], maxTokens = 700): Promise<string | null> {
  const key = process.env.LLM_API_KEY;
  const base = process.env.LLM_BASE_URL ?? "https://api.groq.com/openai/v1";
  const model = process.env.LLM_MODEL ?? "llama-3.3-70b-versatile";
  const all = [{ role: "system", content: SYSTEM_LEGAL }, ...messages];
  if (key) {
    try {
      return await post(`${base.replace(/\/$/, "")}/chat/completions`, { model, messages: all, max_tokens: maxTokens }, key);
    } catch {
      /* fall through to keyless */
    }
  }
  try {
    return await post("https://text.pollinations.ai/", { messages: all, model: "openai", max_tokens: maxTokens, seed: 1 });
  } catch {
    return null;
  }
}
