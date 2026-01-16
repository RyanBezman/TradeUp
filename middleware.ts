import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get("sessionToken")?.value;
  const email = request.cookies.get("email")?.value;

  if (!sessionToken || !email) {
    const url = new URL("/how-to-use", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*"],
};
