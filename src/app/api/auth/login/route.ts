import { NextRequest, NextResponse } from "next/server";
import { signSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // 1. Enforce brute-force rate limiting (Max 5 attempts per 15 minutes)
    const clientIp = getClientIp(req.headers);
    const rateLimit = checkRateLimit(`login:${clientIp}`, {
      windowMs: 15 * 60 * 1000,
      maxRequests: 5,
    });

    if (!rateLimit.allowed) {
      const retryAfterSec = Math.ceil(rateLimit.resetMs / 1000);
      return NextResponse.json(
        {
          success: false,
          message: `Too many login attempts. For security reasons, please retry in ${retryAfterSec} seconds.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfterSec),
          },
        }
      );
    }

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { success: false, message: "Invalid email or password format." },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = password.trim();

    // Validated on the SERVER ONLY (Never bundled into client JavaScript)
    const configuredAdminEmail = (process.env.ADMIN_INITIAL_EMAIL || "sujal@.com").toLowerCase();
    const configuredAdminPass = process.env.ADMIN_INITIAL_PASSWORD || "radhasolanki";

    const isEmailValid =
      trimmedEmail === configuredAdminEmail ||
      trimmedEmail === "sujal@trendstreet.com" ||
      trimmedEmail === "sujal@.com";
    const isPassValid = trimmedPass === configuredAdminPass;

    if (isEmailValid && isPassValid) {
      const token = await signSessionToken(trimmedEmail);

      const response = NextResponse.json(
        {
          success: true,
          email: trimmedEmail,
          message: "Authentication successful. Administrative session initialized.",
        },
        { status: 200 }
      );

      response.cookies.set({
        name: SESSION_COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_MAX_AGE,
      });

      return response;
    }

    // Generic error message to prevent account enumeration
    return NextResponse.json(
      { success: false, message: "Invalid administrative credentials." },
      { status: 401 }
    );
  } catch (error) {
    console.error("Auth login error:", error);
    return NextResponse.json(
      { success: false, message: "Authentication service error." },
      { status: 500 }
    );
  }
}
