// Free-LLM provider adapter (awesome-freellm-apis): env-keyed primary, keyless fallback.
// LLM_API_KEY / LLM_BASE_URL / LLM_MODEL override; otherwise keyless Pollinations.

const SYSTEM_LEGAL = `تو دستیار حقوقی شریف‌مند هستی — یک وکیل هوشمند فارسی‌زبان.
به سوالات حقوقی کاربر به فارسی روان و طبیعی پاسخ بده؛ مختصر، دقیق و کاربردی (حداکثر ۸-۱۰ خط).
در پاسخ‌ات حتماً به مواد قانونی مرتبط با موضوع استناد کن: شماره ماده و نام قانون را دقیق بنویس
(مثلاً «ماده ۱۰۸۲ قانون مدنی» یا «ماده ۲ قانون روابط موجر و مستأجر ۱۳۷۶») و اگر آن ماده تبصره دارد،
خلاصه تبصره را هم ذکر کن (مثلاً «تبصره ماده ۱۰۸۲ قانون مدنی مقرر می‌دارد…»).
مهم‌ترین مواد مرتبط را بیاور و اگر موضوع به قانون خاصی مربوط است (قانون صدور چک، قانون کار،
قانون حمایت خانواده، قانون مجازات اسلامی و…)، حتماً به آن استناد کن.
پاسخ را حتماً به زبان فارسی بنویس و از هر کاراکتر غیرفارسی (چینی، کره‌ای، ژاپنی و غیره) خودداری کن.
اگر پاسخ دقیق نیاز به مطالعه اسناد/قوانین دارد، بگو برای نظر قطعی با وکیل مشورت کند.
هیچ​وقت خودت را وکیل رسمی معرفی نکن و در پایان در یک جمله یادآوری کن: "این پاسخ جنبه اطلاع‌رسانی دارد و جایگزین مشاوره حقوقی رسمی نیست."`;
function sanitizePersian(text: string): string {
  return text
    // eslint-disable-next-line no-control-regex
    .replace(
      /[\u0400-\u04ff\u0500-\u052f\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uac00-\ud7af\u0400-\u04ff\u0590-\u05ff\u0370-\u03ff\u00c0-\u024f\uff00-\uffef]/g,
      "",
    )
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}
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

export async function askLLM(messages: { role: string; content: string }[], maxTokens = 400): Promise<string | null> {
  const key = process.env.LLM_API_KEY;
  const base = process.env.LLM_BASE_URL ?? "https://api.groq.com/openai/v1";
  const model = process.env.LLM_MODEL ?? "openai/gpt-oss-20b";
  const all = [{ role: "system", content: SYSTEM_LEGAL }, ...messages];
  if (key) {
    try {
      return sanitizePersian(await post(`${base.replace(/\/$/, "")}/chat/completions`, { model, messages: all, max_tokens: maxTokens }, key));
    } catch {
      /* fall through to keyless */
    }
  }
  try {
    return sanitizePersian(await post("https://text.pollinations.ai/", { messages: all, model: "openai", max_tokens: maxTokens, seed: 1 }));
  } catch {
    return null;
  }
}
