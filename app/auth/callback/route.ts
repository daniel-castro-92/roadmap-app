import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=auth_error`);
  }

  // Build the redirect response first so session cookies can be written
  // directly onto it. cookieStore.set() from next/headers does NOT transfer
  // cookies onto a separately-constructed NextResponse (BUG-007 pattern).
  // Reading from request.cookies is also more reliable than cookies() for
  // finding the PKCE code verifier stored before the OAuth redirect.
  const response = NextResponse.redirect(`${origin}/`);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      `${origin}/login?error=auth_error&msg=${encodeURIComponent(error.message)}`
    );
  }

  return response;
}
