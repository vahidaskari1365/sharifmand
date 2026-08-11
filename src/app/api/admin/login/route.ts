import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkCredentials, signSession, cookieName } from "@/lib/admin-auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!checkCredentials(String(email ?? ""), String(password ?? ""))) {
      return NextResponse.json({ ok: false, error: "ایمیل یا رمز عبور اشتباه است" }, { status: 401 });
    }
    const store = await cookies();
    store.set(cookieName(), signSession(String(email)), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "درخواست نامعتبر" }, { status: 400 });
  }
}
